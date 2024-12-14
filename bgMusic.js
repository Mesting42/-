class BackgroundMusic {
    constructor() {
        this.initAudio();
    }

    async initAudio() {
        try {
            this.audio = new Audio();
            this.audio.src = 'obj-wo3DlMOGwrbDjj7DisKw-31062848162-638b-6bb5-44d9-59abd7a1ed96fb2fe3345999f9536021.mp3';
            this.audio.loop = true;
            this.audio.preload = 'auto';
            this.audio.volume = 0.4;

            await this.audio.load();
            this.createMusicButton();
            this.initAutoPlay();
            this.handleVisibilityChange();
            this.handleErrors();
        } catch (error) {
            console.error('音频初始化失败:', error);
        }
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.audio.pause();
            } else if (this.isPlaying) {
                this.audio.play().catch(console.error);
            }
        });
    }

    handleErrors() {
        this.audio.addEventListener('error', (e) => {
            console.error('音频错误:', e);
        });
    }

    async initAutoPlay() {
        try {
            // 等待文档加载完成
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve, { once: true });
                });
            }

            // 尝试自动播放
            await this.play();
            document.querySelector('.music-control').classList.add('playing');

            // 如果自动播放失败，监听用户首次交互
            if (!this.isPlaying) {
                const startPlayback = async () => {
                    await this.play();
                    document.querySelector('.music-control').classList.add('playing');
                    // 移除所有交互事件监听
                    ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'].forEach(event => {
                        document.removeEventListener(event, startPlayback);
                    });
                };

                // 添加多个交互事件监听
                ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'].forEach(event => {
                    document.addEventListener(event, startPlayback, { once: true });
                });
            }
        } catch (err) {
            console.log('自动播放初始化��败:', err);
        }
    }

    createMusicButton() {
        const button = document.createElement('button');
        button.className = 'music-control';
        button.innerHTML = '🎵';
        document.body.appendChild(button);

        // 添加点击事件
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.isPlaying) {
                this.pause();
                button.classList.remove('playing');
            } else {
                this.play();
                button.classList.add('playing');
            }
        });

        // 添加触摸事件
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.isPlaying) {
                this.pause();
                button.classList.remove('playing');
            } else {
                this.play();
                button.classList.add('playing');
            }
        }, { passive: false });
    }

    async play() {
        try {
            // 确保音频已加载
            if (this.audio.readyState < 2) {
                await new Promise((resolve) => {
                    this.audio.addEventListener('canplay', resolve, { once: true });
                });
            }

            // 确保从头开始播放
            if (this.audio.currentTime === this.audio.duration) {
                this.audio.currentTime = 0;
            }

            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                await playPromise;
                this.isPlaying = true;
                // 确保循环播放
                this.audio.loop = true;
            }
        } catch (err) {
            console.log('播放失败:', err);
            this.isPlaying = false;
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }
} 