class SoundEffect {
    constructor() {
        // 创建音频上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 预加载点击音效
        this.loadClickSound();

        // 添加点击和触摸事件监听
        document.addEventListener('click', (e) => this.handleInteraction(e));
        document.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 阻止默认行为
            this.handleInteraction(e);
        }, { passive: false });
    }

    handleInteraction(e) {
        // 忽略非文字区域的点击
        const target = e.target;
        if (target.classList.contains('char') || target.classList.contains('wish-char')) {
            this.playClickSound();
        }
    }

    async loadClickSound() {
        // 创建一个可爱的音效
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        this.clickSound = {
            oscillator,
            gainNode
        };

        oscillator.start();
    }

    playClickSound() {
        const { gainNode } = this.clickSound;
        const now = this.audioContext.currentTime;

        // 快速淡入淡出创造可爱的点击音效
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    }
} 