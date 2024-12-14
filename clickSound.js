class SoundEffect {
    constructor() {
        this.audioContext = null;
        this.sounds = null;
        this.initAudioContext();

        document.addEventListener('click', (e) => this.handleInteraction(e));
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInteraction(e);
        }, { passive: false });
    }

    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.sounds = {
                click: this.createClickSound()
            };
        }
    }

    createClickSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        return { oscillator, gainNode };
    }

    handleInteraction(e) {
        this.initAudioContext();

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const target = e.target;
        if (target.classList.contains('char') || target.classList.contains('wish-char')) {
            this.playClickSound();
        } else {
            this.playTouchSound();
        }
    }

    playClickSound() {
        const { gainNode } = this.sounds.click;
        const now = this.audioContext.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    }

    playTouchSound() {
        const { gainNode } = this.sounds.click;
        const now = this.audioContext.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
    }
} 