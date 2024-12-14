class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.lastTime = 0;
        this.fireworkTypes = ['normal', 'circle', 'heart', 'spiral'];
        this.typeWeights = {
            'normal': 0.3,
            'circle': 0.2,
            'heart': 0.3,
            'spiral': 0.2
        };
        this.lastFirework = 0;
        this.minInterval = 200;
        this.maxParticles = 1500;

        this.startFireworks();
        requestAnimationFrame((time) => this.animate(time));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startFireworks() {
        setInterval(() => {
            if (this.particles.length < this.maxParticles * 0.8) {
                const count = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < count; i++) {
                    this.createRandomFirework();
                }
            }
        }, this.minInterval);
    }

    createRandomFirework() {
        const random = Math.random();
        let sum = 0;
        let selectedType = 'normal';

        for (const [type, weight] of Object.entries(this.typeWeights)) {
            sum += weight;
            if (random < sum) {
                selectedType = type;
                break;
            }
        }

        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * (this.canvas.height * 0.5);

        switch (selectedType) {
            case 'heart':
                this.createHeartFirework(x, y, targetY);
                break;
            case 'normal':
                this.createNormalFirework(x, y, targetY);
                break;
            case 'circle':
                this.createCircleFirework(x, y, targetY);
                break;
            case 'spiral':
                this.createSpiralFirework(x, y, targetY);
                break;
        }
    }

    createNormalFirework(x, y, targetY) {
        const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ffd700', '#ff69b4'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const particleCount = 60 + Math.floor(Math.random() * 20);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 8 + Math.random() * 4;
            this.createParticle(x, y, targetY, color, angle, velocity);
        }
    }

    createCircleFirework(x, y, targetY) {
        const color = '#ffd700';
        const particleCount = 80;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 7;
            this.createParticle(x, y, targetY, color, angle, velocity, 'circle');
        }
    }

    createHeartFirework(x, y, targetY) {
        const colors = ['#ff69b4', '#ff1493', '#ff0000', '#ff007f'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const scale = 2.0;
        const particleCount = 180;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const heartX = scale * (16 * Math.pow(Math.sin(angle), 3));
            const heartY = scale * -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));

            const randomOffset = (Math.random() - 0.5) * 0.2;
            const velocity = 6 + Math.random() * 2;
            const finalAngle = Math.atan2(heartY, heartX);

            this.createParticle(
                x, y, targetY,
                color,
                finalAngle + randomOffset,
                velocity,
                'heart',
                scale
            );
        }

        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 * scale;
            const sparkleX = x + Math.cos(angle) * distance;
            const sparkleY = targetY + Math.sin(angle) * distance;
            this.createSparkles(sparkleX, sparkleY, color);
        }
    }

    createSpiralFirework(x, y, targetY) {
        const colors = ['#ff0000', '#ffd700', '#ff69b4'];
        const spirals = 3;

        for (let s = 0; s < spirals; s++) {
            const color = colors[s % colors.length];
            for (let i = 0; i < 40; i++) {
                const angle = (Math.PI * 2 * i) / 40 + (s * Math.PI * 2 / spirals);
                const velocity = 8 + Math.sin(i * 0.1) * 3;
                this.createParticle(x, y, targetY, color, angle, velocity, 'spiral');
            }
        }
    }

    createParticle(x, y, targetY, color, angle, velocity, type = 'normal', scale = 1) {
        if (this.particles.length >= this.maxParticles) return;

        const particle = {
            x,
            y,
            targetY,
            color,
            radius: type === 'heart' ? 3.5 * scale : (type === 'sparkle' ? 1.8 : 2.5),
            angle,
            velocity,
            alpha: 1,
            stage: 1,
            type,
            spin: Math.random() * 0.2 - 0.1,
            scale,
            brightness: type === 'heart' ? 1.2 : 1
        };
        this.particles.push(particle);
    }

    createTrail(particle) {
        if (this.particles.length < this.maxParticles) {
            const trail = {
                x: particle.x,
                y: particle.y,
                color: particle.color,
                radius: particle.radius * 0.5,
                alpha: particle.alpha * 0.4,
                stage: 2,
                velocity: particle.velocity * 0.4,
                angle: particle.angle,
                type: 'trail'
            };
            this.particles.push(trail);
        }
    }

    createSparkles(x, y, color) {
        const sparkleCount = 8;
        for (let i = 0; i < sparkleCount; i++) {
            if (this.particles.length >= this.maxParticles) break;

            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 2;
            const particle = {
                x,
                y,
                color,
                radius: 1.2,
                angle,
                velocity,
                alpha: 1,
                stage: 2,
                type: 'sparkle'
            };
            this.particles.push(particle);
        }
    }

    animate(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        const timeScale = Math.min(deltaTime / 16.67, 2);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'lighter';

        const activeParticles = [];
        for (const p of this.particles) {
            if (this.updateParticle(p, timeScale)) {
                activeParticles.push(p);
            }
        }
        this.particles = activeParticles;

        this.ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame((time) => this.animate(time));
    }

    updateParticle(p, timeScale) {
        if (p.stage === 1) {
            p.y -= 10 * timeScale;
            if (p.y <= p.targetY) {
                p.stage = 2;
                if (p.type === 'heart' && Math.random() < 0.5) {
                    this.createSparkles(p.x, p.y, p.color);
                }
            }
        } else {
            if (p.type === 'spiral') {
                p.angle += p.spin * timeScale;
            }
            p.x += Math.cos(p.angle) * p.velocity * timeScale;
            p.y += (Math.sin(p.angle) * p.velocity + 0.4) * timeScale;
            p.velocity *= p.type === 'heart' ? 0.98 : 0.97;
            p.alpha *= p.type === 'heart' ? 0.985 : 0.96;

            if (p.alpha > 0.3 && Math.random() < 0.4 && p.type !== 'trail') {
                this.createTrail(p);
            }
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const alpha = p.alpha * p.brightness;
        this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${alpha})`;
        this.ctx.fill();

        return p.alpha >= 0.05;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : null;
    }
}

window.onload = () => {
    const canvas = document.getElementById('fireworks');
    new Firework(canvas);
}; 