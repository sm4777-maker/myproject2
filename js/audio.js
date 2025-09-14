/**
 * 오카리나 학습 앱 - 오디오 시스템
 * Web Audio API를 사용한 소리 생성 및 재생
 */

class OcarinaAudio {
    constructor() {
        // 오디오 컨텍스트 초기화
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
        this.currentOscillators = new Map();

        // 오카리나 음색을 위한 설정
        this.waveType = 'sine'; // 부드러운 소리를 위해
        this.attackTime = 0.1;   // 소리가 시작되는 시간
        this.decayTime = 0.3;    // 소리가 감소하는 시간
        this.sustainLevel = 0.6; // 지속되는 음량
        this.releaseTime = 0.8;  // 소리가 끝나는 시간
    }

    /**
     * 오디오 시스템 초기화
     * 사용자 상호작용 후에 호출되어야 함
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // AudioContext 생성 (브라우저 호환성 고려)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // 마스터 볼륨 컨트롤 생성
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3; // 기본 볼륨

            this.isInitialized = true;
            console.log('오카리나 오디오 시스템 초기화 완료');
        } catch (error) {
            console.error('오디오 시스템 초기화 실패:', error);
        }
    }

    /**
     * 특정 주파수의 음을 재생
     * @param {number} frequency - 재생할 주파수 (Hz)
     * @param {number} duration - 재생 시간 (초, 기본값: 1초)
     * @param {number} volume - 음량 (0-1, 기본값: 0.5)
     */
    async playNote(frequency, duration = 1, volume = 0.5) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            if (!this.audioContext || this.audioContext.state === 'closed') {
                console.warn('오디오 컨텍스트가 사용할 수 없습니다.');
                return;
            }

            // AudioContext가 suspended 상태인 경우 재개
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // 브라우저 호환성을 위한 강제 초기화
            if (!this.audioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.connect(this.audioContext.destination);
                this.masterGain.gain.value = 0.3;
            }

        const noteId = `note_${frequency}_${Date.now()}`;

        try {
            // 오실레이터 생성 (기본 음파 생성)
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // 오카리나 음색을 위한 필터 추가
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = frequency * 3; // 부드러운 음색을 위해
            filter.Q.value = 1;

            // 노드 연결: 오실레이터 → 필터 → 게인 → 마스터게인 → 출력
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);

            // 오실레이터 설정
            oscillator.type = this.waveType;
            oscillator.frequency.value = frequency;

            // ADSR 엔벨로프 적용 (Attack, Decay, Sustain, Release)
            const now = this.audioContext.currentTime;

            // 초기 볼륨 0에서 시작
            gainNode.gain.value = 0;

            // Attack: 볼륨이 서서히 증가
            gainNode.gain.linearRampToValueAtTime(volume, now + this.attackTime);

            // Decay: 지속 볼륨으로 감소
            gainNode.gain.linearRampToValueAtTime(
                volume * this.sustainLevel,
                now + this.attackTime + this.decayTime
            );

            // Sustain: 지속 시간 동안 볼륨 유지
            const sustainTime = duration - this.attackTime - this.decayTime - this.releaseTime;
            if (sustainTime > 0) {
                gainNode.gain.linearRampToValueAtTime(
                    volume * this.sustainLevel,
                    now + this.attackTime + this.decayTime + sustainTime
                );
            }

            // Release: 볼륨이 서서히 감소하여 무음이 됨
            gainNode.gain.linearRampToValueAtTime(
                0,
                now + duration
            );

            // 재생 시작
            oscillator.start(now);
            oscillator.stop(now + duration);

            // 현재 재생 중인 오실레이터 추적
            this.currentOscillators.set(noteId, { oscillator, gainNode });

            // 재생 완료 후 정리
            oscillator.onended = () => {
                this.currentOscillators.delete(noteId);
            };

        } catch (error) {
            console.error('음표 재생 중 오류 발생:', error);
        }
        } catch (mainError) {
            console.error('오디오 재생 실패:', mainError);
            // 사용자에게 오디오 활성화를 요청
            this.showAudioActivationPrompt();
        }
    }

    /**
     * 오디오 활성화 요청 프롬프트 표시
     */
    showAudioActivationPrompt() {
        const existingPrompt = document.querySelector('.audio-activation-prompt');
        if (existingPrompt) return;

        const prompt = document.createElement('div');
        prompt.className = 'audio-activation-prompt';
        prompt.innerHTML = `
            <div class="prompt-content">
                <h3>🔊 오디오 활성화 필요</h3>
                <p>브라우저 정책으로 인해 오디오를 재생하려면 클릭이 필요합니다.</p>
                <button class="btn btn-primary activate-audio-btn">오디오 활성화</button>
                <button class="btn btn-secondary close-prompt-btn">닫기</button>
            </div>
        `;

        document.body.appendChild(prompt);

        // 활성화 버튼 이벤트
        prompt.querySelector('.activate-audio-btn').addEventListener('click', async () => {
            try {
                await this.initialize();
                prompt.remove();
                console.log('오디오가 성공적으로 활성화되었습니다.');
            } catch (error) {
                console.error('오디오 활성화 실패:', error);
            }
        });

        // 닫기 버튼 이벤트
        prompt.querySelector('.close-prompt-btn').addEventListener('click', () => {
            prompt.remove();
        });
    }

    /**
     * 현재 재생 중인 모든 소리를 중지
     */
    stopAllNotes() {
        this.currentOscillators.forEach(({ oscillator, gainNode }) => {
            try {
                // 즉시 볼륨을 0으로 감소
                gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);

                // 짧은 지연 후 오실레이터 중지
                oscillator.stop(this.audioContext.currentTime + 0.05);
            } catch (error) {
                // 이미 중지된 오실레이터는 무시
                console.debug('오실레이터 중지 중 오류 (이미 중지됨):', error);
            }
        });

        this.currentOscillators.clear();
    }

    /**
     * 마스터 볼륨 설정
     * @param {number} volume - 볼륨 (0-1)
     */
    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * 마스터 볼륨 가져오기
     * @returns {number} 현재 마스터 볼륨 (0-1)
     */
    getMasterVolume() {
        return this.masterGain ? this.masterGain.gain.value : 0.3;
    }

    /**
     * 음계를 순서대로 재생 (상행 또는 하행)
     * @param {Array} frequencies - 주파수 배열
     * @param {string} direction - 'ascending' 또는 'descending'
     * @param {number} noteDuration - 각 음표의 재생 시간
     */
    async playScale(frequencies, direction = 'ascending', noteDuration = 0.8) {
        const notes = direction === 'descending' ? [...frequencies].reverse() : frequencies;

        for (let i = 0; i < notes.length; i++) {
            await this.playNote(notes[i], noteDuration);
            // 다음 음표까지 약간의 간격
            await new Promise(resolve => setTimeout(resolve, noteDuration * 1000 * 0.9));
        }
    }

    /**
     * 메트로놈 소리 생성
     * @param {boolean} isAccent - 강박인지 여부
     */
    playMetronomeClick(isAccent = false) {
        if (!this.audioContext || !this.isInitialized) return;

        const frequency = isAccent ? 1000 : 800; // 강박은 더 높은 주파수
        const duration = 0.1; // 짧은 클릭 소리
        const volume = isAccent ? 0.8 : 0.6;

        this.playNote(frequency, duration, volume);
    }

    /**
     * 오디오 시스템 정리
     */
    dispose() {
        this.stopAllNotes();

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }

        this.isInitialized = false;
        console.log('오카리나 오디오 시스템 정리 완료');
    }
}

// 전역 오디오 인스턴스 생성
const ocarinaAudio = new OcarinaAudio();

// 음표 주파수 매핑 (12홀 오카리나용)
const NOTE_FREQUENCIES = {
    'C4': 261.63,   // 도
    'D4': 293.66,   // 레
    'E4': 329.63,   // 미
    'F4': 349.23,   // 파
    'G4': 392.00,   // 솔
    'A4': 440.00,   // 라
    'B4': 493.88,   // 시
    'C5': 523.25,   // 높은 도
    'D5': 587.33,   // 높은 레
    'E5': 659.25,   // 높은 미
    'F5': 698.46,   // 높은 파
    'G5': 783.99    // 높은 솔
};

// 음계 배열 (기본 음계)
const SCALE_NOTES = [
    NOTE_FREQUENCIES.C4,
    NOTE_FREQUENCIES.D4,
    NOTE_FREQUENCIES.E4,
    NOTE_FREQUENCIES.F4,
    NOTE_FREQUENCIES.G4,
    NOTE_FREQUENCIES.A4,
    NOTE_FREQUENCIES.B4,
    NOTE_FREQUENCIES.C5
];

// 유틸리티 함수들
const AudioUtils = {
    /**
     * 음표 이름을 주파수로 변환
     * @param {string} noteName - 음표 이름 (예: 'C4', 'A#4')
     * @returns {number} 주파수
     */
    noteToFrequency(noteName) {
        return NOTE_FREQUENCIES[noteName] || 0;
    },

    /**
     * 주파수를 음표 이름으로 변환 (근사치)
     * @param {number} frequency - 주파수
     * @returns {string} 음표 이름
     */
    frequencyToNote(frequency) {
        let closestNote = 'C4';
        let minDiff = Math.abs(frequency - NOTE_FREQUENCIES.C4);

        for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
            const diff = Math.abs(frequency - freq);
            if (diff < minDiff) {
                minDiff = diff;
                closestNote = note;
            }
        }

        return closestNote;
    },

    /**
     * BPM을 밀리초 간격으로 변환
     * @param {number} bpm - 분당 박자 수
     * @returns {number} 밀리초 단위 간격
     */
    bpmToInterval(bpm) {
        return (60 / bpm) * 1000;
    },

    /**
     * 볼륨을 데시벨로 변환
     * @param {number} volume - 선형 볼륨 (0-1)
     * @returns {number} 데시벨 값
     */
    linearToDecibel(volume) {
        return volume === 0 ? -Infinity : 20 * Math.log10(volume);
    }
};

// 모듈 내보내기 (ES6 모듈 사용 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OcarinaAudio,
        ocarinaAudio,
        NOTE_FREQUENCIES,
        SCALE_NOTES,
        AudioUtils
    };
}

// 전역 스코프에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
    window.ocarinaAudio = ocarinaAudio;
    window.NOTE_FREQUENCIES = NOTE_FREQUENCIES;
    window.SCALE_NOTES = SCALE_NOTES;
    window.AudioUtils = AudioUtils;
}

// 페이지 로드 시 오디오 시스템 준비
document.addEventListener('DOMContentLoaded', () => {
    // 첫 번째 사용자 상호작용에서 오디오 초기화
    const initAudioOnFirstClick = async () => {
        if (!ocarinaAudio.isInitialized) {
            await ocarinaAudio.initialize();
            // 한 번만 실행되도록 이벤트 리스너 제거
            document.removeEventListener('click', initAudioOnFirstClick);
            document.removeEventListener('touchstart', initAudioOnFirstClick);
            document.removeEventListener('keydown', initAudioOnFirstClick);
        }
    };

    // 다양한 사용자 상호작용에 대응
    document.addEventListener('click', initAudioOnFirstClick);
    document.addEventListener('touchstart', initAudioOnFirstClick);
    document.addEventListener('keydown', initAudioOnFirstClick);
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    ocarinaAudio.dispose();
});