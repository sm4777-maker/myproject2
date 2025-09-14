/**
 * 오카리나 학습 앱 - 운지법 시스템
 * 12홀 오카리나 운지법 매핑 및 시각화
 */

// 12홀 오카리나 운지법 데이터
// true = 막기, false = 열기
const FINGERING_CHART = {
    'C4': {
        name: '도 (C)',
        holes: {
            1: false, 2: false, 3: false, 4: false,
            5: false, 6: false, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 1,
        description: '오른손 새끼손가락과 약지, 왼손 엄지만 막습니다.',
        tips: '첫 번째 배우는 음입니다. 숨을 너무 세게 불지 마세요.'
    },
    'D4': {
        name: '레 (D)',
        holes: {
            1: false, 2: false, 3: false, 4: false,
            5: false, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 1,
        description: '오른손 중지, 약지, 새끼손가락과 왼손 엄지를 막습니다.',
        tips: '도에서 오른손 중지만 추가로 막으면 됩니다.'
    },
    'E4': {
        name: '미 (E)',
        holes: {
            1: false, 2: false, 3: false, 4: false,
            5: true, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 2,
        description: '오른손 검지, 중지, 약지, 새끼손가락과 왼손 엄지를 막습니다.',
        tips: '오른손 모든 손가락을 사용합니다.'
    },
    'F4': {
        name: '파 (F)',
        holes: {
            1: false, 2: false, 3: false, 4: true,
            5: true, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 2,
        description: '왼손 약지와 오른손 모든 손가락, 왼손 엄지를 막습니다.',
        tips: '왼손 약지를 정확히 막는 것이 중요합니다.'
    },
    'G4': {
        name: '솔 (G)',
        holes: {
            1: false, 2: false, 3: true, 4: true,
            5: true, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 2,
        description: '왼손 중지, 약지와 오른손 모든 손가락, 왼손 엄지를 막습니다.',
        tips: '안정적인 음을 내기 위해 모든 구멍을 완전히 막으세요.'
    },
    'A4': {
        name: '라 (A)',
        holes: {
            1: false, 2: true, 3: true, 4: true,
            5: true, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 3,
        description: '왼손 검지, 중지, 약지와 오른손 모든 손가락, 왼손 엄지를 막습니다.',
        tips: '왼손 검지 위치를 정확히 잡는 것이 중요합니다.'
    },
    'B4': {
        name: '시 (B)',
        holes: {
            1: true, 2: true, 3: true, 4: true,
            5: true, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: false
        },
        difficulty: 3,
        description: '오른손 엄지를 제외한 모든 구멍을 막습니다.',
        tips: '모든 손가락의 협응이 필요합니다. 충분히 연습하세요.'
    },
    'C5': {
        name: '높은 도 (C)',
        holes: {
            1: true, 2: true, 3: true, 4: true,
            5: true, 6: true, 7: true, 8: true,
            thumb1: true, thumb2: true
        },
        difficulty: 4,
        description: '모든 구멍을 막습니다.',
        tips: '모든 구멍을 완전히 막고 적절한 숨의 압력으로 불어주세요.'
    }
};

// 손가락 위치 매핑 (시각적 표현용)
const FINGER_POSITIONS = {
    1: { name: '왼손 검지', hand: 'left', finger: 'index' },
    2: { name: '왼손 중지', hand: 'left', finger: 'middle' },
    3: { name: '왼손 중지', hand: 'left', finger: 'middle' },
    4: { name: '왼손 약지', hand: 'left', finger: 'ring' },
    5: { name: '오른손 검지', hand: 'right', finger: 'index' },
    6: { name: '오른손 중지', hand: 'right', finger: 'middle' },
    7: { name: '오른손 약지', hand: 'right', finger: 'ring' },
    8: { name: '오른손 새끼', hand: 'right', finger: 'pinky' },
    thumb1: { name: '왼손 엄지', hand: 'left', finger: 'thumb' },
    thumb2: { name: '오른손 엄지', hand: 'right', finger: 'thumb' }
};

class FingeringSystem {
    constructor() {
        this.currentNote = null;
        this.holeElements = new Map();
        this.noteButtons = new Map();
        this.isAnimating = false;

        this.init();
    }

    /**
     * 운지법 시스템 초기화
     */
    init() {
        this.setupHoleElements();
        this.setupNoteButtons();
        this.bindEvents();

        console.log('운지법 시스템 초기화 완료');
    }

    /**
     * 구멍 엘리먼트들을 Map에 저장
     */
    setupHoleElements() {
        const holes = document.querySelectorAll('.hole');
        holes.forEach(hole => {
            const holeId = hole.dataset.hole;
            this.holeElements.set(holeId, hole);
        });
    }

    /**
     * 음표 버튼들을 Map에 저장
     */
    setupNoteButtons() {
        const noteButtons = document.querySelectorAll('.note-btn');
        noteButtons.forEach(button => {
            const note = button.dataset.note;
            this.noteButtons.set(note, button);
        });
    }

    /**
     * 이벤트 리스너 바인딩
     */
    bindEvents() {
        // 음표 버튼 클릭 이벤트
        this.noteButtons.forEach((button, note) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectNote(note);
            });
        });

        // 구멍 클릭 이벤트 (개별 구멍 연습용)
        this.holeElements.forEach((hole, holeId) => {
            hole.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleHole(holeId);
            });
        });

        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    /**
     * 특정 음표 선택 및 운지법 표시
     * @param {string} note - 음표 이름
     */
    async selectNote(note) {
        if (this.isAnimating) return;

        const fingeringData = FINGERING_CHART[note];
        if (!fingeringData) {
            console.warn(`운지법 데이터를 찾을 수 없습니다: ${note}`);
            return;
        }

        this.currentNote = note;
        this.isAnimating = true;

        try {
            // 이전 선택 해제
            this.clearAllSelections();

            // 현재 음표 버튼 활성화
            const currentButton = this.noteButtons.get(note);
            if (currentButton) {
                currentButton.classList.add('playing');
            }

            // 운지법 애니메이션으로 표시
            await this.animateFingeringPattern(fingeringData.holes);

            // 소리 재생
            const frequency = parseFloat(currentButton?.dataset.freq || '0');
            if (frequency > 0) {
                await window.ocarinaAudio.playNote(frequency, 1.5, 0.6);
            }

            // 운지법 정보 업데이트
            this.updateFingeringInfo(fingeringData);

        } catch (error) {
            console.error('음표 선택 중 오류:', error);
        } finally {
            this.isAnimating = false;

            // 버튼 애니메이션 종료
            setTimeout(() => {
                const currentButton = this.noteButtons.get(note);
                if (currentButton) {
                    currentButton.classList.remove('playing');
                }
            }, 1500);
        }
    }

    /**
     * 운지법 패턴을 애니메이션으로 표시
     * @param {Object} holes - 구멍별 상태 객체
     */
    async animateFingeringPattern(holes) {
        // 모든 구멍 초기화
        this.clearAllHoles();

        // 구멍별로 순차적으로 애니메이션
        const holeIds = Object.keys(holes);

        for (let i = 0; i < holeIds.length; i++) {
            const holeId = holeIds[i];
            const shouldCover = holes[holeId];

            await new Promise(resolve => {
                setTimeout(() => {
                    this.setHoleState(holeId, shouldCover);
                    resolve();
                }, i * 100); // 100ms 간격으로 순차 실행
            });
        }
    }

    /**
     * 특정 구멍의 상태 설정
     * @param {string} holeId - 구멍 ID
     * @param {boolean} covered - 막힌 상태 여부
     */
    setHoleState(holeId, covered) {
        const hole = this.holeElements.get(holeId);
        if (!hole) return;

        hole.classList.remove('covered', 'open');

        if (covered) {
            hole.classList.add('covered');
            hole.setAttribute('aria-label', `${FINGER_POSITIONS[holeId]?.name} - 막기`);
        } else {
            hole.classList.add('open');
            hole.setAttribute('aria-label', `${FINGER_POSITIONS[holeId]?.name} - 열기`);
        }

        // 시각적 피드백
        hole.style.transform = 'scale(1.1)';
        setTimeout(() => {
            hole.style.transform = 'scale(1)';
        }, 200);
    }

    /**
     * 개별 구멍 토글 (연습용)
     * @param {string} holeId - 구멍 ID
     */
    toggleHole(holeId) {
        const hole = this.holeElements.get(holeId);
        if (!hole) return;

        const isCovered = hole.classList.contains('covered');
        this.setHoleState(holeId, !isCovered);

        // 피드백 사운드
        window.ocarinaAudio.playMetronomeClick(!isCovered);
    }

    /**
     * 모든 구멍 상태 초기화
     */
    clearAllHoles() {
        this.holeElements.forEach(hole => {
            hole.classList.remove('covered', 'open');
            hole.style.transform = 'scale(1)';
        });
    }

    /**
     * 모든 선택 해제
     */
    clearAllSelections() {
        this.noteButtons.forEach(button => {
            button.classList.remove('playing', 'active');
        });
        this.currentNote = null;
    }

    /**
     * 운지법 정보 업데이트
     * @param {Object} fingeringData - 운지법 데이터
     */
    updateFingeringInfo(fingeringData) {
        // 정보 카드 업데이트 (필요시 구현)
        const infoArea = document.getElementById('fingeringInfo');
        if (infoArea) {
            infoArea.innerHTML = `
                <div class="fingering-details">
                    <h4>🎵 ${fingeringData.name}</h4>
                    <p><strong>설명:</strong> ${fingeringData.description}</p>
                    <p><strong>연습 팁:</strong> ${fingeringData.tips}</p>
                    <div class="difficulty-indicator">
                        <strong>난이도:</strong>
                        ${'⭐'.repeat(fingeringData.difficulty)}${'☆'.repeat(5 - fingeringData.difficulty)}
                    </div>
                </div>
            `;
        }
    }

    /**
     * 키보드 입력 처리
     * @param {KeyboardEvent} event - 키보드 이벤트
     */
    handleKeyboardInput(event) {
        // 숫자 키로 음표 선택
        const keyMap = {
            '1': 'C4', '2': 'D4', '3': 'E4', '4': 'F4',
            '5': 'G4', '6': 'A4', '7': 'B4', '8': 'C5'
        };

        const note = keyMap[event.key];
        if (note) {
            event.preventDefault();
            this.selectNote(note);
            return;
        }

        // ESC 키로 모든 선택 해제
        if (event.key === 'Escape') {
            event.preventDefault();
            this.clearAllSelections();
            this.clearAllHoles();
            window.ocarinaAudio.stopAllNotes();
        }

        // 스페이스바로 현재 음표 재생
        if (event.key === ' ' && this.currentNote) {
            event.preventDefault();
            const button = this.noteButtons.get(this.currentNote);
            const frequency = parseFloat(button?.dataset.freq || '0');
            if (frequency > 0) {
                window.ocarinaAudio.playNote(frequency, 1, 0.6);
            }
        }
    }

    /**
     * 음계 연습 모드
     * @param {string} direction - 'ascending' 또는 'descending'
     */
    async practiceScale(direction = 'ascending') {
        if (this.isAnimating) return;

        const notes = direction === 'ascending'
            ? ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
            : ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

        this.isAnimating = true;

        try {
            for (const note of notes) {
                await this.selectNote(note);
                // 다음 음으로 넘어가기 전 잠시 대기
                await new Promise(resolve => setTimeout(resolve, 1200));
            }
        } catch (error) {
            console.error('음계 연습 중 오류:', error);
        } finally {
            this.isAnimating = false;
            this.clearAllSelections();
            this.clearAllHoles();
        }
    }

    /**
     * 운지법 테스트 모드
     * @param {Array} testNotes - 테스트할 음표들
     */
    async startFingeringTest(testNotes = null) {
        if (!testNotes) {
            testNotes = Object.keys(FINGERING_CHART);
        }

        // 랜덤하게 섞기
        const shuffled = [...testNotes].sort(() => Math.random() - 0.5);

        for (const note of shuffled) {
            // 사용자에게 운지법을 보여주지 않고 음만 재생
            const button = this.noteButtons.get(note);
            const frequency = parseFloat(button?.dataset.freq || '0');

            if (frequency > 0) {
                await window.ocarinaAudio.playNote(frequency, 1, 0.6);
            }

            // 사용자가 운지법을 맞힐 때까지 대기 (실제 구현 시에는 더 복잡한 로직 필요)
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    /**
     * 현재 선택된 음표 가져오기
     * @returns {string|null} 현재 음표
     */
    getCurrentNote() {
        return this.currentNote;
    }

    /**
     * 특정 음표의 운지법 데이터 가져오기
     * @param {string} note - 음표 이름
     * @returns {Object|null} 운지법 데이터
     */
    getFingeringData(note) {
        return FINGERING_CHART[note] || null;
    }

    /**
     * 모든 운지법 데이터 가져오기
     * @returns {Object} 전체 운지법 차트
     */
    getAllFingeringData() {
        return { ...FINGERING_CHART };
    }
}

// 전역 운지법 시스템 인스턴스
let fingeringSystem = null;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    fingeringSystem = new FingeringSystem();

    // 전역 스코프에서 접근 가능하도록 설정
    window.fingeringSystem = fingeringSystem;

    // 운지법 관련 전역 함수들
    window.playScale = async (direction) => {
        await fingeringSystem.practiceScale(direction);
    };

    window.startFingeringTest = async () => {
        await fingeringSystem.startFingeringTest();
    };
});

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FingeringSystem,
        FINGERING_CHART,
        FINGER_POSITIONS
    };
}