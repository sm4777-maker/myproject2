/**
 * 오카리나 학습 앱 - 메인 애플리케이션
 * 전체 앱의 초기화, 탭 관리, 사용자 설정 등을 담당
 */

class OcarinaLearningApp {
    constructor() {
        this.currentTab = 'fingering';
        this.settings = this.loadSettings();
        this.userProgress = this.loadUserProgress();

        this.init();
    }

    /**
     * 앱 초기화
     */
    async init() {
        try {
            // DOM이 로드될 때까지 대기
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupApp());
            } else {
                this.setupApp();
            }
        } catch (error) {
            console.error('앱 초기화 실패:', error);
            this.showError('앱을 초기화하는 중 오류가 발생했습니다.');
        }
    }

    /**
     * 앱 설정 및 이벤트 리스너 등록
     */
    setupApp() {
        this.setupTabNavigation();
        this.setupThemeToggle();
        this.setupVolumeControl();
        this.setupResponsiveLayout();
        this.initializeComponents();
        this.showWelcomeMessage();

        console.log('🎵 오카리나 학습 앱이 시작되었습니다!');
    }

    /**
     * 탭 네비게이션 설정
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // 초기 탭 활성화
        this.switchTab(this.currentTab);
    }

    /**
     * 탭 전환
     */
    switchTab(tabId) {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        // 모든 탭 비활성화
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 선택된 탭 활성화
        const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.querySelector(`#${tabId}`);

        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
            this.currentTab = tabId;

            // 탭별 특별한 초기화 작업
            this.onTabSwitch(tabId);
        }
    }

    /**
     * 탭 전환 시 실행되는 작업
     */
    onTabSwitch(tabId) {
        switch (tabId) {
            case 'fingering':
                // 운지표가 제대로 렌더링되었는지 확인
                if (window.fingeringSystem) {
                    window.fingeringSystem.render();
                }
                break;

            case 'songs':
                // 곡 목록이 제대로 렌더링되었는지 확인
                if (window.songManager) {
                    window.songManager.renderSongList();
                }
                break;

            case 'practice':
                // 연습 모드 초기화
                if (window.practiceManager) {
                    window.practiceManager.updateMetronomeButton();
                }
                break;

            case 'progress':
                this.updateProgressDisplay();
                break;
        }
    }

    /**
     * 다크모드 토글 설정
     */
    setupThemeToggle() {
        const themeToggle = document.querySelector('#theme-toggle');

        if (themeToggle) {
            // 저장된 테마 적용
            if (this.settings.theme === 'dark') {
                document.body.classList.add('dark-theme');
                themeToggle.checked = true;
            }

            themeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-theme');
                this.settings.theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                this.saveSettings();
            });
        }
    }

    /**
     * 볼륨 컨트롤 설정
     */
    setupVolumeControl() {
        const volumeSlider = document.querySelector('#volume-slider');
        const volumeDisplay = document.querySelector('#volume-display');

        if (volumeSlider && window.ocarinaAudio) {
            // 저장된 볼륨 적용
            volumeSlider.value = this.settings.volume * 100;
            if (volumeDisplay) {
                volumeDisplay.textContent = Math.round(this.settings.volume * 100);
            }
            ocarinaAudio.setMasterVolume(this.settings.volume);

            volumeSlider.addEventListener('input', (e) => {
                const volume = parseFloat(e.target.value) / 100;
                ocarinaAudio.setMasterVolume(volume);

                if (volumeDisplay) {
                    volumeDisplay.textContent = Math.round(volume * 100);
                }

                this.settings.volume = volume;
                this.saveSettings();
            });
        }
    }

    /**
     * 반응형 레이아웃 설정
     */
    setupResponsiveLayout() {
        // 화면 크기 변경 감지
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 초기 레이아웃 설정
        this.handleResize();
    }

    /**
     * 화면 크기 변경 처리
     */
    handleResize() {
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile', isMobile);

        // 모바일에서는 운지표 크기 조정
        if (window.fingeringSystem && isMobile) {
            window.fingeringSystem.adjustForMobile();
        }
    }

    /**
     * 컴포넌트 초기화
     */
    initializeComponents() {
        // 각 컴포넌트가 로드되었는지 확인하고 초기화
        const components = [
            'fingeringSystem',
            'songManager',
            'practiceManager',
            'ocarinaAudio'
        ];

        components.forEach(componentName => {
            if (window[componentName]) {
                console.log(`✅ ${componentName} 초기화 완료`);
            } else {
                console.warn(`⚠️ ${componentName}을 찾을 수 없습니다`);
            }
        });

        // 오디오 시스템 초기화 (사용자 상호작용 후)
        this.setupAudioInitialization();
    }

    /**
     * 오디오 초기화 설정
     */
    setupAudioInitialization() {
        const initializeAudio = async () => {
            if (window.ocarinaAudio && !window.ocarinaAudio.isInitialized) {
                try {
                    await window.ocarinaAudio.initialize();
                    console.log('🔊 오디오 시스템 초기화 완료');

                    // 초기화 완료 후 이벤트 리스너 제거
                    document.removeEventListener('click', initializeAudio);
                    document.removeEventListener('keydown', initializeAudio);
                    document.removeEventListener('touchstart', initializeAudio);
                } catch (error) {
                    console.error('오디오 초기화 실패:', error);
                }
            }
        };

        // 사용자 상호작용 대기
        document.addEventListener('click', initializeAudio, { once: true });
        document.addEventListener('keydown', initializeAudio, { once: true });
        document.addEventListener('touchstart', initializeAudio, { once: true });
    }

    /**
     * 환영 메시지 표시
     */
    showWelcomeMessage() {
        const userName = this.userProgress.name || '연주자';
        const welcomeElement = document.querySelector('.welcome-message');

        if (welcomeElement) {
            welcomeElement.innerHTML = `
                <h2>안녕하세요, ${userName}님! 🎵</h2>
                <p>오카리나 학습을 시작해보세요.</p>
            `;

            // 3초 후 메시지 페이드아웃
            setTimeout(() => {
                welcomeElement.style.opacity = '0';
                setTimeout(() => {
                    welcomeElement.style.display = 'none';
                }, 500);
            }, 3000);
        }
    }

    /**
     * 진도 표시 업데이트
     */
    updateProgressDisplay() {
        const progressContainer = document.querySelector('.progress-overview');
        if (!progressContainer) return;

        const stats = this.calculateUserStats();

        progressContainer.innerHTML = `
            <div class="progress-stats">
                <div class="stat-item">
                    <div class="stat-number">${stats.songsLearned}</div>
                    <div class="stat-label">학습한 곡</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.practiceHours}h</div>
                    <div class="stat-label">연습 시간</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.currentLevel}</div>
                    <div class="stat-label">현재 레벨</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.accuracy}%</div>
                    <div class="stat-label">정확도</div>
                </div>
            </div>
            <div class="progress-chart">
                <h3>최근 연습 활동</h3>
                <div class="activity-chart">
                    ${this.generateActivityChart()}
                </div>
            </div>
            <div class="achievements">
                <h3>달성한 목표</h3>
                <div class="achievement-list">
                    ${this.generateAchievements()}
                </div>
            </div>
        `;
    }

    /**
     * 사용자 통계 계산
     */
    calculateUserStats() {
        const practiceHistory = window.practiceManager ?
            window.practiceManager.practiceHistory : [];

        const songsLearned = new Set(practiceHistory.map(p => p.songId)).size;
        const totalPracticeTime = practiceHistory.reduce((total, session) =>
            total + (session.duration || 0), 0);
        const practiceHours = Math.round(totalPracticeTime / (1000 * 60 * 60));

        return {
            songsLearned,
            practiceHours,
            currentLevel: this.userProgress.level || '초급',
            accuracy: this.userProgress.accuracy || 85
        };
    }

    /**
     * 활동 차트 생성
     */
    generateActivityChart() {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const today = new Date();

        return days.map((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));

            // 해당 날짜의 연습 시간 계산 (실제로는 localStorage에서 가져와야 함)
            const practiceTime = Math.random() * 2; // 임시 데이터
            const height = Math.max(10, practiceTime * 50);

            return `
                <div class="activity-day" title="${date.toLocaleDateString()} - ${practiceTime.toFixed(1)}시간">
                    <div class="activity-bar" style="height: ${height}px"></div>
                    <div class="day-label">${day}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * 달성 목표 생성
     */
    generateAchievements() {
        const achievements = [
            { name: '첫 곡 완주', description: '첫 번째 곡을 끝까지 연주했습니다', achieved: true },
            { name: '일주일 연습', description: '7일 연속 연습했습니다', achieved: true },
            { name: '완벽한 연주', description: '한 곡을 100% 정확도로 연주했습니다', achieved: false },
            { name: '속도 마스터', description: '원래 속도로 곡을 연주했습니다', achieved: false }
        ];

        return achievements.map(achievement => `
            <div class="achievement-item ${achievement.achieved ? 'achieved' : ''}">
                <div class="achievement-icon">
                    ${achievement.achieved ? '🏆' : '🔒'}
                </div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * 설정 불러오기
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem('ocarina_settings');
            return settings ? JSON.parse(settings) : {
                theme: 'light',
                volume: 0.3,
                metronomeSound: true,
                autoPlay: false
            };
        } catch (error) {
            console.error('설정 불러오기 실패:', error);
            return {
                theme: 'light',
                volume: 0.3,
                metronomeSound: true,
                autoPlay: false
            };
        }
    }

    /**
     * 설정 저장
     */
    saveSettings() {
        try {
            localStorage.setItem('ocarina_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('설정 저장 실패:', error);
        }
    }

    /**
     * 사용자 진도 불러오기
     */
    loadUserProgress() {
        try {
            const progress = localStorage.getItem('ocarina_user_progress');
            return progress ? JSON.parse(progress) : {
                level: '초급',
                completedSongs: [],
                totalPracticeTime: 0,
                accuracy: 85,
                name: ''
            };
        } catch (error) {
            console.error('진도 불러오기 실패:', error);
            return {
                level: '초급',
                completedSongs: [],
                totalPracticeTime: 0,
                accuracy: 85,
                name: ''
            };
        }
    }

    /**
     * 사용자 진도 저장
     */
    saveUserProgress() {
        try {
            localStorage.setItem('ocarina_user_progress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.error('진도 저장 실패:', error);
        }
    }

    /**
     * 에러 메시지 표시
     */
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <div class="error-content">
                <i class="error-icon">⚠️</i>
                <span class="error-text">${message}</span>
                <button class="error-close">×</button>
            </div>
        `;

        document.body.appendChild(errorElement);

        // 자동 제거
        setTimeout(() => {
            errorElement.remove();
        }, 5000);

        // 닫기 버튼
        errorElement.querySelector('.error-close').addEventListener('click', () => {
            errorElement.remove();
        });
    }

    /**
     * 성공 메시지 표시
     */
    showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `
            <div class="success-content">
                <i class="success-icon">✅</i>
                <span class="success-text">${message}</span>
            </div>
        `;

        document.body.appendChild(successElement);

        setTimeout(() => {
            successElement.remove();
        }, 3000);
    }

    /**
     * 앱 종료 시 정리 작업
     */
    cleanup() {
        // 오디오 시스템 정리
        if (window.ocarinaAudio) {
            window.ocarinaAudio.dispose();
        }

        // 메트로놈 중지
        if (window.practiceManager && window.practiceManager.metronome) {
            window.practiceManager.metronome.stop();
        }

        // 설정 저장
        this.saveSettings();
        this.saveUserProgress();

        console.log('🎵 오카리나 학습 앱이 종료되었습니다.');
    }
}

// 전역 앱 인스턴스 생성
const ocarinaApp = new OcarinaLearningApp();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    ocarinaApp.cleanup();
});

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OcarinaLearningApp, ocarinaApp };
}

// 전역 스코프에서 사용할 수 있도록 추가
if (typeof window !== 'undefined') {
    window.ocarinaApp = ocarinaApp;
    window.OcarinaLearningApp = OcarinaLearningApp;
}