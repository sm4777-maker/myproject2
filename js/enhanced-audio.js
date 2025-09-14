/**
 * 향상된 오카리나 오디오 시스템
 * 더 나은 음질과 실제 악기 소리에 가까운 시뮬레이션
 */

class EnhancedOcarinaAudio extends OcarinaAudio {
    constructor() {
        super();
        this.reverbNode = null;
        this.compressor = null;
        this.setupAudioEffects();
    }

    /**
     * 오디오 이펙트 설정 (리버브, 컴프레서 등)
     */
    setupAudioEffects() {
        if (this.audioContext) {
            this.createAudioEffects();
        }
    }

    /**
     * 오디오 이펙트 생성
     */
    createAudioEffects() {
        try {
            // 컴프레서 (음량 균일화)
            this.compressor = this.audioContext.createDynamicsCompressor();
            this.compressor.threshold.setValueAtTime(-30, this.audioContext.currentTime);
            this.compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
            this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
            this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
            this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

            // 리버브 효과 (공간감)
            this.createReverb();

            // 체인 연결: 컴프레서 → 리버브 → 마스터게인
            if (this.compressor && this.reverbNode && this.masterGain) {
                this.compressor.connect(this.reverbNode);
                this.reverbNode.connect(this.masterGain);
            }
        } catch (error) {
            console.warn('오디오 이펙트 생성 실패:', error);
        }
    }

    /**
     * 리버브 효과 생성
     */
    createReverb() {
        try {
            const convolver = this.audioContext.createConvolver();

            // 임펄스 응답 생성 (홀 리버브 시뮬레이션)
            const sampleRate = this.audioContext.sampleRate;
            const length = sampleRate * 2; // 2초 길이
            const impulse = this.audioContext.createBuffer(2, length, sampleRate);

            for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < length; i++) {
                    const decay = Math.pow(1 - i / length, 2);
                    channelData[i] = (Math.random() * 2 - 1) * decay * 0.5;
                }
            }

            convolver.buffer = impulse;

            // 드라이/웨트 믹서
            const wetGain = this.audioContext.createGain();
            const dryGain = this.audioContext.createGain();
            const outputGain = this.audioContext.createGain();

            wetGain.gain.value = 0.3; // 리버브 30%
            dryGain.gain.value = 0.7; // 원음 70%

            // 연결 설정
            this.reverbNode = {
                input: this.audioContext.createGain(),
                connect: function(destination) {
                    outputGain.connect(destination);
                }
            };

            this.reverbNode.input.connect(convolver);
            this.reverbNode.input.connect(dryGain);
            convolver.connect(wetGain);
            wetGain.connect(outputGain);
            dryGain.connect(outputGain);

        } catch (error) {
            console.warn('리버브 생성 실패:', error);
            // 리버브 실패시 기본 게인 노드 사용
            this.reverbNode = this.audioContext.createGain();
        }
    }

    /**
     * 향상된 음표 재생 (오카리나 음색 최적화)
     */
    async playEnhancedNote(frequency, duration = 1, volume = 0.5) {
        if (!this.audioContext || !this.isInitialized) {
            await this.initialize();
        }

        if (!this.audioContext) return;

        try {
            const noteId = `enhanced_${frequency}_${Date.now()}`;

            // 메인 오실레이터 (기본 음)
            const mainOsc = this.audioContext.createOscillator();
            const mainGain = this.audioContext.createGain();

            // 하모닉 오실레이터들 (배음 추가)
            const harmonics = [
                { freq: frequency * 2, gain: 0.15 },    // 2차 배음
                { freq: frequency * 3, gain: 0.08 },    // 3차 배음
                { freq: frequency * 4, gain: 0.04 },    // 4차 배음
            ];

            const harmonicNodes = harmonics.map(harmonic => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'sine';
                osc.frequency.value = harmonic.freq;
                gain.gain.value = harmonic.gain * volume;

                return { osc, gain };
            });

            // 메인 오실레이터 설정
            mainOsc.type = 'sine';
            mainOsc.frequency.value = frequency;

            // 로우패스 필터 (부드러운 음색)
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = frequency * 4;
            filter.Q.value = 1;

            // ADSR 엔벨로프 설정
            const now = this.audioContext.currentTime;
            const attackTime = 0.05;
            const decayTime = 0.1;
            const sustainLevel = 0.8;
            const releaseTime = 0.3;

            mainGain.gain.value = 0;
            mainGain.gain.linearRampToValueAtTime(volume, now + attackTime);
            mainGain.gain.linearRampToValueAtTime(volume * sustainLevel, now + attackTime + decayTime);
            mainGain.gain.setValueAtTime(volume * sustainLevel, now + duration - releaseTime);
            mainGain.gain.linearRampToValueAtTime(0, now + duration);

            // 노드 연결
            mainOsc.connect(filter);
            filter.connect(mainGain);

            // 이펙트 체인 연결
            if (this.compressor) {
                mainGain.connect(this.compressor);

                // 하모닉스도 연결
                harmonicNodes.forEach(({osc, gain}) => {
                    osc.connect(gain);
                    gain.connect(this.compressor);
                });
            } else {
                mainGain.connect(this.masterGain);
                harmonicNodes.forEach(({osc, gain}) => {
                    osc.connect(gain);
                    gain.connect(this.masterGain);
                });
            }

            // 재생 시작
            mainOsc.start(now);
            mainOsc.stop(now + duration);

            harmonicNodes.forEach(({osc, gain}) => {
                // 하모닉스에도 엔벨로프 적용
                gain.gain.value = 0;
                gain.gain.linearRampToValueAtTime(gain.gain.value || 0.1, now + attackTime);
                gain.gain.linearRampToValueAtTime((gain.gain.value || 0.1) * sustainLevel, now + attackTime + decayTime);
                gain.gain.linearRampToValueAtTime(0, now + duration);

                osc.start(now);
                osc.stop(now + duration);
            });

            // 추적을 위해 저장
            this.currentOscillators.set(noteId, {
                oscillator: mainOsc,
                gainNode: mainGain,
                harmonics: harmonicNodes
            });

            mainOsc.onended = () => {
                this.currentOscillators.delete(noteId);
            };

        } catch (error) {
            console.error('향상된 음표 재생 실패:', error);
        }
    }

    /**
     * 초기화 시 이펙트 설정
     */
    async initialize() {
        await super.initialize();
        if (this.isInitialized) {
            this.createAudioEffects();
        }
    }
}

// 기존 오카리나 오디오를 향상된 버전으로 교체
if (typeof window !== 'undefined') {
    window.enhancedOcarinaAudio = new EnhancedOcarinaAudio();

    // 기존 playNote 메서드를 향상된 버전으로 오버라이드
    if (window.ocarinaAudio) {
        const originalPlayNote = window.ocarinaAudio.playNote;
        window.ocarinaAudio.playEnhancedNote = function(...args) {
            return window.enhancedOcarinaAudio.playEnhancedNote.apply(window.enhancedOcarinaAudio, args);
        };
    }
}