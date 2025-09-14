/**
 * 오카리나 학습 앱 - 연습 모드 및 게임
 * 메트로놈, 연습 게임, 진도 추적 기능
 */

class PracticeManager {
    constructor() {
        this.currentPracticeSong = null;
        this.metronome = new Metronome();
        this.games = {
            noteRecognition: new NoteRecognitionGame(),
            rhythmTraining: new RhythmTrainingGame(),
            speedChallenge: new SpeedChallengeGame()
        };

        this.practiceHistory = this.loadPracticeHistory();
        this.setupEventListeners();
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 연습 모드 버튼들
        const practiceButtons = document.querySelectorAll('.practice-btn');
        practiceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const gameType = btn.dataset.game;
                this.startGame(gameType);
            });
        });

        // 메트로놈 컨트롤
        const metronomeBtn = document.querySelector('#metronome-toggle');
        const bpmSlider = document.querySelector('#bpm-slider');
        const bpmDisplay = document.querySelector('#bpm-display');

        if (metronomeBtn) {
            metronomeBtn.addEventListener('click', () => {
                this.metronome.toggle();
                this.updateMetronomeButton();
            });
        }

        if (bpmSlider) {
            bpmSlider.addEventListener('input', (e) => {
                const bpm = parseInt(e.target.value);
                this.metronome.setBPM(bpm);
                if (bpmDisplay) {
                    bpmDisplay.textContent = bpm;
                }
            });
        }

        // 연습 세션 종료
        document.addEventListener('click', (e) => {
            if (e.target.matches('.end-practice-btn')) {
                this.endPracticeSession();
            }
        });
    }

    /**
     * 연습용 곡 로드
     */
    loadSongForPractice(song) {
        this.currentPracticeSong = song;
        this.displayPracticeSong();
        this.metronome.setBPM(song.bpm);

        // BPM 슬라이더 업데이트
        const bpmSlider = document.querySelector('#bpm-slider');
        const bpmDisplay = document.querySelector('#bpm-display');

        if (bpmSlider) {
            bpmSlider.value = song.bpm;
        }
        if (bpmDisplay) {
            bpmDisplay.textContent = song.bpm;
        }
    }

    /**
     * 연습곡 표시
     */
    displayPracticeSong() {
        const container = document.querySelector('.practice-song-display');
        if (!container || !this.currentPracticeSong) return;

        container.innerHTML = `
            <div class="current-practice-song">
                <h3>${this.currentPracticeSong.title}</h3>
                <div class="song-info">
                    <span class="level">${this.getLevelText(this.currentPracticeSong.level)}</span>
                    <span class="tempo">${this.currentPracticeSong.bpm} BPM</span>
                </div>
                <div class="practice-controls">
                    <button class="btn btn-primary play-practice-btn">
                        <i class="icon-play">▶</i> 연습 재생
                    </button>
                    <button class="btn btn-secondary slow-practice-btn">
                        <i class="icon-slow">🐢</i> 천천히 연습
                    </button>
                </div>
            </div>
        `;

        // 이벤트 리스너 추가
        container.querySelector('.play-practice-btn').addEventListener('click', () => {
            this.startPracticePlaying();
        });

        container.querySelector('.slow-practice-btn').addEventListener('click', () => {
            this.startSlowPractice();
        });
    }

    /**
     * 게임 시작
     */
    startGame(gameType) {
        const game = this.games[gameType];
        if (game) {
            game.start();
        }
    }

    /**
     * 연습 재생 시작
     */
    startPracticePlaying() {
        if (!this.currentPracticeSong) return;

        // songManager를 통해 곡 재생
        if (window.songManager) {
            window.songManager.playSong(this.currentPracticeSong.id);
        }
    }

    /**
     * 천천히 연습
     */
    startSlowPractice() {
        if (!this.currentPracticeSong) return;

        // 메트로놈을 느린 속도로 설정
        const slowBPM = Math.max(60, Math.floor(this.currentPracticeSong.bpm * 0.7));
        this.metronome.setBPM(slowBPM);

        // BPM 표시 업데이트
        const bpmDisplay = document.querySelector('#bpm-display');
        if (bpmDisplay) {
            bpmDisplay.textContent = slowBPM;
        }

        this.startPracticePlaying();
    }

    /**
     * 메트로놈 버튼 업데이트
     */
    updateMetronomeButton() {
        const btn = document.querySelector('#metronome-toggle');
        if (btn) {
            if (this.metronome.isPlaying) {
                btn.innerHTML = '<i class="icon-stop">⏸</i> 메트로놈 중지';
                btn.classList.add('active');
            } else {
                btn.innerHTML = '<i class="icon-play">▶</i> 메트로놈 시작';
                btn.classList.remove('active');
            }
        }
    }

    /**
     * 연습 세션 종료
     */
    endPracticeSession() {
        this.metronome.stop();
        if (window.songManager) {
            window.songManager.stopSong();
        }

        // 게임들 종료
        Object.values(this.games).forEach(game => {
            if (game.isActive) {
                game.end();
            }
        });

        this.savePracticeSession();
    }

    /**
     * 연습 기록 저장
     */
    savePracticeSession() {
        if (!this.currentPracticeSong) return;

        const sessionData = {
            songId: this.currentPracticeSong.id,
            date: new Date().toISOString(),
            duration: Date.now() - (this.sessionStartTime || Date.now()),
            completed: true
        };

        this.practiceHistory.push(sessionData);
        this.savePracticeHistory();
    }

    /**
     * 연습 기록 불러오기
     */
    loadPracticeHistory() {
        try {
            const history = localStorage.getItem('ocarina_practice_history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('연습 기록 불러오기 실패:', error);
            return [];
        }
    }

    /**
     * 연습 기록 저장
     */
    savePracticeHistory() {
        try {
            localStorage.setItem('ocarina_practice_history', JSON.stringify(this.practiceHistory));
        } catch (error) {
            console.error('연습 기록 저장 실패:', error);
        }
    }

    /**
     * 레벨 텍스트 변환
     */
    getLevelText(level) {
        const levels = {
            beginner: '초급',
            intermediate: '중급',
            advanced: '고급'
        };
        return levels[level] || level;
    }
}

/**
 * 메트로놈 클래스
 */
class Metronome {
    constructor() {
        this.bpm = 120;
        this.isPlaying = false;
        this.interval = null;
        this.beatCount = 0;
        this.beatsPerMeasure = 4;
    }

    /**
     * BPM 설정
     */
    setBPM(bpm) {
        this.bpm = Math.max(40, Math.min(200, bpm));

        if (this.isPlaying) {
            this.stop();
            this.start();
        }
    }

    /**
     * 메트로놈 시작
     */
    start() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.beatCount = 0;

        const intervalTime = (60 / this.bpm) * 1000;

        this.interval = setInterval(() => {
            this.playBeat();
            this.beatCount = (this.beatCount + 1) % this.beatsPerMeasure;
        }, intervalTime);

        this.updateDisplay();
    }

    /**
     * 메트로놈 중지
     */
    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.updateDisplay();
    }

    /**
     * 메트로놈 토글
     */
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * 박자 재생
     */
    playBeat() {
        const isAccent = this.beatCount === 0;

        if (window.ocarinaAudio) {
            ocarinaAudio.playMetronomeClick(isAccent);
        }

        this.visualBeat(isAccent);
    }

    /**
     * 시각적 박자 표시
     */
    visualBeat(isAccent) {
        const indicator = document.querySelector('.metronome-indicator');
        if (indicator) {
            indicator.classList.remove('beat', 'accent');
            setTimeout(() => {
                indicator.classList.add('beat');
                if (isAccent) {
                    indicator.classList.add('accent');
                }
            }, 10);
        }

        // 박자 카운터 업데이트
        const counter = document.querySelector('.beat-counter');
        if (counter) {
            counter.textContent = this.beatCount + 1;
        }
    }

    /**
     * 디스플레이 업데이트
     */
    updateDisplay() {
        const indicator = document.querySelector('.metronome-indicator');
        if (indicator) {
            if (this.isPlaying) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active', 'beat', 'accent');
            }
        }
    }
}

/**
 * 음표 인식 게임
 */
class NoteRecognitionGame {
    constructor() {
        this.isActive = false;
        this.currentNote = null;
        this.score = 0;
        this.totalQuestions = 0;
    }

    start() {
        this.isActive = true;
        this.score = 0;
        this.totalQuestions = 0;
        this.showGameModal('note-recognition');
        this.nextQuestion();
    }

    nextQuestion() {
        if (!this.isActive) return;

        // 랜덤 음표 선택
        const notes = Object.keys(NOTE_FREQUENCIES);
        this.currentNote = notes[Math.floor(Math.random() * notes.length)];

        // 음표 재생
        const frequency = NOTE_FREQUENCIES[this.currentNote];
        if (window.ocarinaAudio && frequency) {
            ocarinaAudio.playNote(frequency, 1.0);
        }

        this.showNoteOptions();
    }

    showNoteOptions() {
        const gameContainer = document.querySelector('.game-content');
        if (!gameContainer) return;

        const notes = Object.keys(NOTE_FREQUENCIES);
        const options = this.shuffleArray([...notes]).slice(0, 4);

        if (!options.includes(this.currentNote)) {
            options[Math.floor(Math.random() * options.length)] = this.currentNote;
        }

        gameContainer.innerHTML = `
            <div class="game-question">
                <h3>재생된 음표는 무엇인가요?</h3>
                <button class="btn btn-secondary replay-btn">
                    <i class="icon-replay">🔄</i> 다시 듣기
                </button>
            </div>
            <div class="game-options">
                ${options.map(note => `
                    <button class="btn btn-option" data-note="${note}">
                        ${note}
                    </button>
                `).join('')}
            </div>
            <div class="game-score">
                점수: ${this.score} / ${this.totalQuestions}
            </div>
        `;

        // 이벤트 리스너 추가
        gameContainer.querySelectorAll('.btn-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.checkAnswer(e.target.dataset.note);
            });
        });

        gameContainer.querySelector('.replay-btn').addEventListener('click', () => {
            this.nextQuestion();
        });
    }

    checkAnswer(selectedNote) {
        this.totalQuestions++;

        if (selectedNote === this.currentNote) {
            this.score++;
            this.showFeedback('정답입니다!', 'success');
        } else {
            this.showFeedback(`틀렸습니다. 정답은 ${this.currentNote}입니다.`, 'error');
        }

        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `game-feedback ${type}`;
        feedback.textContent = message;

        const gameContainer = document.querySelector('.game-content');
        if (gameContainer) {
            gameContainer.appendChild(feedback);
        }
    }

    end() {
        this.isActive = false;
        this.hideGameModal();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showGameModal(gameType) {
        // 게임 모달 표시 로직
        console.log(`Starting ${gameType} game`);
    }

    hideGameModal() {
        // 게임 모달 숨기기 로직
        console.log('Ending game');
    }
}

/**
 * 리듬 연습 게임
 */
class RhythmTrainingGame {
    constructor() {
        this.isActive = false;
        this.currentPattern = [];
        this.userPattern = [];
        this.score = 0;
    }

    start() {
        this.isActive = true;
        this.score = 0;
        this.generateRhythmPattern();
        this.showGameModal('rhythm-training');
    }

    generateRhythmPattern() {
        // 간단한 리듬 패턴 생성
        this.currentPattern = [1, 0, 1, 1, 0, 1, 0, 0]; // 1은 박자, 0은 쉼
        this.userPattern = [];
        this.playPattern();
    }

    playPattern() {
        this.currentPattern.forEach((beat, index) => {
            setTimeout(() => {
                if (beat === 1 && window.ocarinaAudio) {
                    ocarinaAudio.playMetronomeClick(false);
                }
            }, index * 500);
        });
    }

    end() {
        this.isActive = false;
        this.hideGameModal();
    }

    showGameModal(gameType) {
        console.log(`Starting ${gameType} game`);
    }

    hideGameModal() {
        console.log('Ending rhythm game');
    }
}

/**
 * 스피드 챌린지 게임
 */
class SpeedChallengeGame {
    constructor() {
        this.isActive = false;
        this.timeLimit = 30; // 30초
        this.score = 0;
    }

    start() {
        this.isActive = true;
        this.score = 0;
        this.showGameModal('speed-challenge');
        this.startTimer();
    }

    startTimer() {
        let timeLeft = this.timeLimit;
        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0 || !this.isActive) {
                clearInterval(timer);
                this.end();
            }
        }, 1000);
    }

    end() {
        this.isActive = false;
        this.hideGameModal();
    }

    showGameModal(gameType) {
        console.log(`Starting ${gameType} game`);
    }

    hideGameModal() {
        console.log('Ending speed game');
    }
}

// 전역 인스턴스 생성
const practiceManager = new PracticeManager();

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PracticeManager,
        practiceManager,
        Metronome,
        NoteRecognitionGame,
        RhythmTrainingGame,
        SpeedChallengeGame
    };
}

// 전역 스코프에서 사용할 수 있도록 추가
if (typeof window !== 'undefined') {
    window.practiceManager = practiceManager;
    window.PracticeManager = PracticeManager;
    window.Metronome = Metronome;
}