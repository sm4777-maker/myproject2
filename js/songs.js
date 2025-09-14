/**
 * 오카리나 학습 앱 - 곡 데이터 및 관리
 * 곡 목록, 악보, 재생 기능
 */

class SongManager {
    constructor() {
        this.songs = [];
        this.currentSong = null;
        this.isPlaying = false;
        this.currentNoteIndex = 0;
        this.playTimeout = null;

        this.initializeSongs();
        this.setupEventListeners();
    }

    /**
     * 곡 데이터 초기화
     */
    initializeSongs() {
        this.songs = [
            // 초급곡
            {
                id: 'twinkle',
                title: '반짝반짝 작은 별',
                level: 'beginner',
                bpm: 120,
                description: '가장 기본적인 연습곡입니다.',
                notes: [
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'A4', duration: 0.5, fingering: 'A4' },
                    { note: 'A4', duration: 0.5, fingering: 'A4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'C4', duration: 1.0, fingering: 'C4' }
                ]
            },
            {
                id: 'mary_lamb',
                title: '메리의 어린 양',
                level: 'beginner',
                bpm: 100,
                description: '간단한 멜로디로 기본 운지법을 익힐 수 있습니다.',
                notes: [
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'E4', duration: 1.0, fingering: 'E4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' }
                ]
            },
            {
                id: 'do_re_mi',
                title: '도레미 음계',
                level: 'beginner',
                bpm: 110,
                description: '기본 음계를 순서대로 연습하는 기초곡입니다.',
                notes: [
                    { note: 'C4', duration: 1.0, fingering: 'C4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'E4', duration: 1.0, fingering: 'E4' },
                    { note: 'F4', duration: 1.0, fingering: 'F4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'A4', duration: 1.0, fingering: 'A4' },
                    { note: 'B4', duration: 1.0, fingering: 'B4' },
                    { note: 'C5', duration: 2.0, fingering: 'C5' },
                    { note: 'B4', duration: 1.0, fingering: 'B4' },
                    { note: 'A4', duration: 1.0, fingering: 'A4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'F4', duration: 1.0, fingering: 'F4' },
                    { note: 'E4', duration: 1.0, fingering: 'E4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'C4', duration: 2.0, fingering: 'C4' }
                ]
            },
            {
                id: 'hot_cross_buns',
                title: '십자 빵',
                level: 'beginner',
                bpm: 120,
                description: '세 개 음표만으로 연주하는 매우 쉬운 곡입니다.',
                notes: [
                    { note: 'E4', duration: 1.0, fingering: 'E4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'C4', duration: 2.0, fingering: 'C4' },
                    { note: 'E4', duration: 1.0, fingering: 'E4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'C4', duration: 2.0, fingering: 'C4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'E4', duration: 1.0, fingering: 'E4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'C4', duration: 2.0, fingering: 'C4' }
                ]
            },
            // 중급곡
            {
                id: 'london_bridge',
                title: '런던 브릿지',
                level: 'intermediate',
                bpm: 110,
                description: '운지 전환이 포함된 중급 연습곡입니다.',
                notes: [
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'A4', duration: 0.25, fingering: 'A4' },
                    { note: 'G4', duration: 0.25, fingering: 'G4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' }
                ]
            },
            {
                id: 'amazing_grace',
                title: '어메이징 그레이스',
                level: 'intermediate',
                bpm: 90,
                description: '아름다운 멜로디로 표현력을 기를 수 있습니다.',
                notes: [
                    { note: 'D4', duration: 0.75, fingering: 'D4' },
                    { note: 'G4', duration: 1.5, fingering: 'G4' },
                    { note: 'B4', duration: 0.75, fingering: 'B4' },
                    { note: 'G4', duration: 0.75, fingering: 'G4' },
                    { note: 'B4', duration: 1.5, fingering: 'B4' },
                    { note: 'A4', duration: 0.75, fingering: 'A4' },
                    { note: 'G4', duration: 1.5, fingering: 'G4' },
                    { note: 'E4', duration: 0.75, fingering: 'E4' },
                    { note: 'D4', duration: 1.5, fingering: 'D4' }
                ]
            },
            {
                id: 'ode_to_joy',
                title: '환희의 송가',
                level: 'intermediate',
                bpm: 95,
                description: '베토벤의 명곡으로 아름다운 선율을 연습할 수 있습니다.',
                notes: [
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'F4', duration: 0.5, fingering: 'F4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'C4', duration: 0.5, fingering: 'C4' },
                    { note: 'D4', duration: 0.5, fingering: 'D4' },
                    { note: 'E4', duration: 0.5, fingering: 'E4' },
                    { note: 'E4', duration: 0.75, fingering: 'E4' },
                    { note: 'D4', duration: 0.25, fingering: 'D4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' }
                ]
            },
            {
                id: 'happy_birthday',
                title: '생일 축하 노래',
                level: 'intermediate',
                bpm: 100,
                description: '친숙한 멜로디로 중급 실력을 향상시킬 수 있습니다.',
                notes: [
                    { note: 'C4', duration: 0.75, fingering: 'C4' },
                    { note: 'C4', duration: 0.25, fingering: 'C4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'C4', duration: 1.0, fingering: 'C4' },
                    { note: 'F4', duration: 1.0, fingering: 'F4' },
                    { note: 'E4', duration: 2.0, fingering: 'E4' },
                    { note: 'C4', duration: 0.75, fingering: 'C4' },
                    { note: 'C4', duration: 0.25, fingering: 'C4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'C4', duration: 1.0, fingering: 'C4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'F4', duration: 2.0, fingering: 'F4' }
                ]
            },
            // 고급곡
            {
                id: 'canon_in_d',
                title: '캐논 변주곡',
                level: 'advanced',
                bpm: 80,
                description: '복잡한 운지와 빠른 패시지가 포함된 고급곡입니다.',
                notes: [
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'A4', duration: 1.0, fingering: 'A4' },
                    { note: 'B4', duration: 1.0, fingering: 'B4' },
                    { note: 'F4', duration: 1.0, fingering: 'F4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'D4', duration: 1.0, fingering: 'D4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'A4', duration: 1.0, fingering: 'A4' },
                    // 더 복잡한 패턴
                    { note: 'D4', duration: 0.25, fingering: 'D4' },
                    { note: 'F4', duration: 0.25, fingering: 'F4' },
                    { note: 'A4', duration: 0.25, fingering: 'A4' },
                    { note: 'D5', duration: 0.25, fingering: 'D5' }
                ]
            },
            {
                id: 'zelda_theme',
                title: '젤다의 자장가',
                level: 'advanced',
                bpm: 85,
                description: '오카리나의 아름다운 소리를 최대한 활용한 명곡입니다.',
                notes: [
                    { note: 'B4', duration: 1.5, fingering: 'B4' },
                    { note: 'D5', duration: 0.5, fingering: 'D5' },
                    { note: 'A4', duration: 2.0, fingering: 'A4' },
                    { note: 'G4', duration: 0.5, fingering: 'G4' },
                    { note: 'A4', duration: 0.5, fingering: 'A4' },
                    { note: 'B4', duration: 1.5, fingering: 'B4' },
                    { note: 'D5', duration: 0.5, fingering: 'D5' },
                    { note: 'A4', duration: 1.0, fingering: 'A4' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' }
                ]
            },
            {
                id: 'fur_elise',
                title: '엘리제를 위하여',
                level: 'advanced',
                bpm: 70,
                description: '베토벤의 명곡으로 빠른 운지 변화를 연습할 수 있습니다.',
                notes: [
                    { note: 'E5', duration: 0.25, fingering: 'E5' },
                    { note: 'D5', duration: 0.25, fingering: 'D5' },
                    { note: 'E5', duration: 0.25, fingering: 'E5' },
                    { note: 'D5', duration: 0.25, fingering: 'D5' },
                    { note: 'E5', duration: 0.25, fingering: 'E5' },
                    { note: 'B4', duration: 0.25, fingering: 'B4' },
                    { note: 'D5', duration: 0.25, fingering: 'D5' },
                    { note: 'C5', duration: 0.25, fingering: 'C5' },
                    { note: 'A4', duration: 0.5, fingering: 'A4' },
                    { note: 'C4', duration: 0.25, fingering: 'C4' },
                    { note: 'E4', duration: 0.25, fingering: 'E4' },
                    { note: 'A4', duration: 0.25, fingering: 'A4' },
                    { note: 'B4', duration: 0.5, fingering: 'B4' }
                ]
            },
            {
                id: 'moonlight_sonata',
                title: '월광 소나타',
                level: 'advanced',
                bpm: 60,
                description: '느리지만 깊은 감정을 표현하는 고급 연주곡입니다.',
                notes: [
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'C5', duration: 1.0, fingering: 'C5' },
                    { note: 'E5', duration: 2.0, fingering: 'E5' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'C5', duration: 1.0, fingering: 'C5' },
                    { note: 'E5', duration: 2.0, fingering: 'E5' },
                    { note: 'G4', duration: 1.0, fingering: 'G4' },
                    { note: 'C5', duration: 1.0, fingering: 'C5' },
                    { note: 'E5', duration: 1.0, fingering: 'E5' },
                    { note: 'G5', duration: 1.0, fingering: 'G5' },
                    { note: 'F5', duration: 2.0, fingering: 'F5' },
                    { note: 'E5', duration: 2.0, fingering: 'E5' }
                ]
            },
            {
                id: 'flight_bumblebee',
                title: '꿀벌의 비행',
                level: 'advanced',
                bpm: 160,
                description: '매우 빠른 템포의 최고 난이도 곡입니다.',
                notes: [
                    { note: 'A4', duration: 0.125, fingering: 'A4' },
                    { note: 'B4', duration: 0.125, fingering: 'B4' },
                    { note: 'C5', duration: 0.125, fingering: 'C5' },
                    { note: 'D5', duration: 0.125, fingering: 'D5' },
                    { note: 'E5', duration: 0.125, fingering: 'E5' },
                    { note: 'F5', duration: 0.125, fingering: 'F5' },
                    { note: 'G5', duration: 0.125, fingering: 'G5' },
                    { note: 'A5', duration: 0.125, fingering: 'A4' },
                    { note: 'G5', duration: 0.125, fingering: 'G5' },
                    { note: 'F5', duration: 0.125, fingering: 'F5' },
                    { note: 'E5', duration: 0.125, fingering: 'E5' },
                    { note: 'D5', duration: 0.125, fingering: 'D5' },
                    { note: 'C5', duration: 0.125, fingering: 'C5' },
                    { note: 'B4', duration: 0.125, fingering: 'B4' },
                    { note: 'A4', duration: 0.125, fingering: 'A4' },
                    { note: 'G4', duration: 0.125, fingering: 'G4' }
                ]
            }
        ];
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 곡 목록 렌더링
        this.renderSongList();

        // 악보 모달 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.matches('.song-item .play-btn')) {
                e.stopPropagation();
                const songId = e.target.closest('.song-item').dataset.songId;
                this.playSong(songId);
            }

            if (e.target.matches('.song-item .demo-btn')) {
                e.stopPropagation();
                const songId = e.target.closest('.song-item').dataset.songId;
                this.playDemoVersion(songId);
            }

            if (e.target.matches('.song-item')) {
                const songId = e.target.dataset.songId;
                this.showSheetMusic(songId);
            }
        });

        // 모달 닫기
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-overlay') || e.target.matches('.close-modal')) {
                this.closeModal();
            }
        });

        // ESC로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    /**
     * 곡 목록 렌더링
     */
    renderSongList() {
        const containers = {
            beginner: document.querySelector('#beginner-songs .songs-grid'),
            intermediate: document.querySelector('#intermediate-songs .songs-grid'),
            advanced: document.querySelector('#advanced-songs .songs-grid')
        };

        Object.values(containers).forEach(container => {
            if (container) container.innerHTML = '';
        });

        this.songs.forEach(song => {
            const container = containers[song.level];
            if (!container) return;

            const songElement = document.createElement('div');
            songElement.className = 'song-item';
            songElement.dataset.songId = song.id;

            songElement.innerHTML = `
                <div class="song-info">
                    <h4>${song.title}</h4>
                    <p class="song-description">${song.description}</p>
                    <div class="song-meta">
                        <span class="bpm">♪ ${song.bpm} BPM</span>
                        <span class="note-count">${song.notes.length}개 음표</span>
                    </div>
                </div>
                <div class="song-actions">
                    <button class="play-btn" title="재생">
                        <i class="icon-play">▶</i>
                    </button>
                    <button class="demo-btn" title="데모 듣기" style="margin-left: 5px;">
                        <i class="icon-demo">🎵</i>
                    </button>
                </div>
            `;

            container.appendChild(songElement);
        });
    }

    /**
     * 곡 재생
     */
    async playSong(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song || this.isPlaying) return;

        this.currentSong = song;
        this.isPlaying = true;
        this.currentNoteIndex = 0;

        const playBtn = document.querySelector(`[data-song-id="${songId}"] .play-btn`);
        if (playBtn) {
            playBtn.innerHTML = '<i class="icon-stop">⏸</i>';
            playBtn.title = '정지';
        }

        await this.playNextNote();
    }

    /**
     * 다음 음표 재생
     */
    async playNextNote() {
        if (!this.currentSong || !this.isPlaying || this.currentNoteIndex >= this.currentSong.notes.length) {
            this.stopSong();
            return;
        }

        const noteData = this.currentSong.notes[this.currentNoteIndex];
        const frequency = NOTE_FREQUENCIES[noteData.note];

        if (frequency && ocarinaAudio) {
            // 운지법 표시 업데이트
            if (window.fingeringSystem) {
                window.fingeringSystem.selectNote(noteData.fingering);
            }

            // 음표 재생
            await ocarinaAudio.playNote(frequency, noteData.duration * 0.8);

            // 다음 음표로 진행
            this.currentNoteIndex++;
            const nextDelay = (noteData.duration * (60 / this.currentSong.bpm)) * 1000;

            this.playTimeout = setTimeout(() => {
                this.playNextNote();
            }, nextDelay);
        } else {
            this.currentNoteIndex++;
            this.playNextNote();
        }
    }

    /**
     * 곡 재생 중지
     */
    stopSong() {
        this.isPlaying = false;

        if (this.playTimeout) {
            clearTimeout(this.playTimeout);
            this.playTimeout = null;
        }

        if (ocarinaAudio) {
            ocarinaAudio.stopAllNotes();
        }

        // 재생 버튼 복원
        if (this.currentSong) {
            const playBtn = document.querySelector(`[data-song-id="${this.currentSong.id}"] .play-btn`);
            if (playBtn) {
                playBtn.innerHTML = '<i class="icon-play">▶</i>';
                playBtn.title = '재생';
            }
        }

        this.currentSong = null;
        this.currentNoteIndex = 0;
    }

    /**
     * 악보 모달 표시
     */
    showSheetMusic(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;

        const modal = this.createSheetMusicModal(song);
        document.body.appendChild(modal);

        // 애니메이션을 위한 약간의 지연
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    /**
     * 악보 모달 생성
     */
    createSheetMusicModal(song) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content sheet-music-modal">
                <div class="modal-header">
                    <h2>${song.title}</h2>
                    <button class="close-modal">×</button>
                </div>
                <div class="modal-body">
                    <div class="song-details">
                        <div class="detail-item">
                            <span class="label">난이도:</span>
                            <span class="value level-${song.level}">
                                ${song.level === 'beginner' ? '초급' :
                                  song.level === 'intermediate' ? '중급' : '고급'}
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="label">템포:</span>
                            <span class="value">${song.bpm} BPM</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">음표 수:</span>
                            <span class="value">${song.notes.length}개</span>
                        </div>
                    </div>
                    <div class="sheet-music">
                        <div class="musical-staff">
                            <div class="staff-lines">
                                <div class="staff-line"></div>
                                <div class="staff-line"></div>
                                <div class="staff-line"></div>
                                <div class="staff-line"></div>
                                <div class="staff-line"></div>
                            </div>
                            <div class="notes-on-staff">
                                ${song.notes.map((noteData, index) => `
                                    <div class="staff-note" data-note-index="${index}" style="left: ${index * 60 + 20}px; top: ${this.getNotePosition(noteData.note)}px;">
                                        <div class="note-head ${this.getNoteClass(noteData.duration)}"></div>
                                        <div class="note-stem ${noteData.duration < 1 ? 'with-stem' : ''}"></div>
                                        <div class="note-label">${noteData.note}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="notes-sequence">
                            <h4>음표 순서:</h4>
                            ${song.notes.map((noteData, index) => `
                                <div class="note-item" data-note-index="${index}">
                                    <div class="note-name">${noteData.note}</div>
                                    <div class="note-duration">${this.formatDuration(noteData.duration)}</div>
                                    <div class="fingering-hint" onclick="window.fingeringSystem.selectNote('${noteData.fingering}')">
                                        운지보기
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-primary play-song-btn" data-song-id="${song.id}">
                            <i class="icon-play">▶</i> 재생
                        </button>
                        <button class="btn btn-secondary demo-btn" data-song-id="${song.id}">
                            <i class="icon-demo">🎵</i> 데모 듣기
                        </button>
                        <button class="btn btn-secondary practice-btn" data-song-id="${song.id}">
                            <i class="icon-practice">🎯</i> 연습 모드
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 모달 내 버튼 이벤트
        modal.querySelector('.play-song-btn').addEventListener('click', () => {
            this.closeModal();
            this.playSong(song.id);
        });

        modal.querySelector('.practice-btn').addEventListener('click', () => {
            this.closeModal();
            this.startPracticeMode(song.id);
        });

        modal.querySelector('.demo-btn').addEventListener('click', () => {
            this.playDemoVersion(song.id);
        });

        return modal;
    }

    /**
     * 연습 모드 시작
     */
    startPracticeMode(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;

        // 연습 탭으로 전환
        const practiceTab = document.querySelector('[data-tab="practice"]');
        if (practiceTab) {
            practiceTab.click();

            // 연습곡 설정
            setTimeout(() => {
                if (window.practiceManager) {
                    window.practiceManager.loadSongForPractice(song);
                }
            }, 100);
        }
    }

    /**
     * 데모 버전 재생 (더 풍성한 사운드)
     */
    async playDemoVersion(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song || this.isPlaying) return;

        this.currentSong = song;
        this.isPlaying = true;
        this.currentNoteIndex = 0;

        // 데모 버튼 상태 변경
        const demoBtn = document.querySelector(`[data-song-id="${songId}"] .demo-btn`);
        if (demoBtn) {
            demoBtn.innerHTML = '<i class="icon-stop">⏸</i> 중지';
            demoBtn.style.background = '#ff6b6b';
        }

        // 더 풍성한 사운드로 재생
        await this.playDemoNotes();
    }

    /**
     * 데모용 음표 재생 (하모니 포함)
     */
    async playDemoNotes() {
        if (!this.currentSong || !this.isPlaying || this.currentNoteIndex >= this.currentSong.notes.length) {
            this.stopDemo();
            return;
        }

        const noteData = this.currentSong.notes[this.currentNoteIndex];
        const frequency = NOTE_FREQUENCIES[noteData.note];

        if (frequency && ocarinaAudio) {
            // 메인 멜로디
            const mainPromise = ocarinaAudio.playNote(frequency, noteData.duration * 0.8, 0.7);

            // 하모니 추가 (3도 또는 5도)
            const harmonyFreq = this.getHarmonyFrequency(frequency);
            if (harmonyFreq) {
                const harmonyPromise = ocarinaAudio.playNote(harmonyFreq, noteData.duration * 0.8, 0.3);
            }

            // 운지법 표시 업데이트
            if (window.fingeringSystem) {
                window.fingeringSystem.selectNote(noteData.fingering);
            }

            // 다음 음표로 진행
            this.currentNoteIndex++;
            const nextDelay = (noteData.duration * (60 / this.currentSong.bpm)) * 1000;

            this.playTimeout = setTimeout(() => {
                this.playDemoNotes();
            }, nextDelay);
        } else {
            this.currentNoteIndex++;
            this.playDemoNotes();
        }
    }

    /**
     * 하모니 주파수 계산
     */
    getHarmonyFrequency(mainFreq) {
        // 3도 하모니 (주파수 비율 약 1.26)
        return mainFreq * 0.8; // 옥타브 아래로
    }

    /**
     * 데모 재생 중지
     */
    stopDemo() {
        this.isPlaying = false;

        if (this.playTimeout) {
            clearTimeout(this.playTimeout);
            this.playTimeout = null;
        }

        if (ocarinaAudio) {
            ocarinaAudio.stopAllNotes();
        }

        // 데모 버튼 복원
        if (this.currentSong) {
            const demoBtn = document.querySelector(`[data-song-id="${this.currentSong.id}"] .demo-btn`);
            if (demoBtn) {
                demoBtn.innerHTML = '<i class="icon-demo">🎵</i> 데모 듣기';
                demoBtn.style.background = '';
            }
        }

        this.currentSong = null;
        this.currentNoteIndex = 0;
    }

    /**
     * 모달 닫기
     */
    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    /**
     * 음표 지속시간 포맷팅
     */
    formatDuration(duration) {
        if (duration <= 0.125) return '♬♬'; // 32분음표
        if (duration === 0.25) return '♬'; // 16분음표
        if (duration === 0.5) return '♪'; // 8분음표
        if (duration === 0.75) return '♪.'; // 점8분음표
        if (duration === 1.0) return '♩'; // 4분음표
        if (duration === 1.5) return '♩.'; // 점4분음표
        if (duration === 2.0) return '♫'; // 2분음표
        return '♩';
    }

    /**
     * 음표의 오선상 위치 계산
     */
    getNotePosition(noteName) {
        const notePositions = {
            'C4': 100, 'D4': 90, 'E4': 80, 'F4': 70, 'G4': 60,
            'A4': 50, 'B4': 40, 'C5': 30, 'D5': 20, 'E5': 10,
            'F5': 0, 'G5': -10
        };
        return notePositions[noteName] || 60;
    }

    /**
     * 음표 지속시간에 따른 CSS 클래스
     */
    getNoteClass(duration) {
        if (duration <= 0.125) return 'thirty-second-note';
        if (duration === 0.25) return 'sixteenth-note';
        if (duration === 0.5) return 'eighth-note';
        if (duration === 1.0) return 'quarter-note';
        if (duration === 2.0) return 'half-note';
        return 'quarter-note';
    }

    /**
     * 곡 검색
     */
    searchSongs(query) {
        const filteredSongs = this.songs.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.description.toLowerCase().includes(query.toLowerCase())
        );

        // 검색 결과 표시 로직 (필요시 구현)
        return filteredSongs;
    }

    /**
     * 레벨별 곡 가져오기
     */
    getSongsByLevel(level) {
        return this.songs.filter(song => song.level === level);
    }
}

// 전역 인스턴스 생성
const songManager = new SongManager();

// 모듈 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SongManager, songManager };
}

// 전역 스코프에서 사용할 수 있도록 추가
if (typeof window !== 'undefined') {
    window.songManager = songManager;
    window.SongManager = SongManager;
}