class SoundEffect {
    constructor() {
        // 创建音频上下文
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 预加载点击音效
        this.loadClickSound();

        // 添加点击事件监听
        document.addEventListener('click', () => this.playClickSound());
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

        // 快速淡入淡���创造可爱的点击音效
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    }
} 