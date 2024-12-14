class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.lastTime = 0;

        this.typeWeights = {
            'heart': 0.25,
            'circle': 0.15,
            'double': 0.15,
            'spiral': 0.15,
            'star': 0.15,
            'chrysanthemum': 0.15
        };

        this.lastFirework = 0;
        this.minInterval = 800;
        this.maxParticles = 1000;
        this.trailLength = 35;
        this.trailOpacity = 1.0;
        this.trailWidth = 5;

        this.startFireworks();
        requestAnimationFrame((time) => this.animate(time));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startFireworks() {
        setInterval(() => {
            if (this.particles.length < this.maxParticles * 0.7) {
                this.createRandomFirework();
            }
        }, this.minInterval);
    }

    createRandomFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * (this.canvas.height * 0.5);

        const random = Math.random();
        let sum = 0;
        for (const [type, weight] of Object.entries(this.typeWeights)) {
            sum += weight;
            if (random < sum) {
                switch (type) {
                    case 'heart':
                        this.createHeartFirework(x, y, targetY);
                        break;
                    case 'circle':
                        this.createCircleFirework(x, y, targetY);
                        break;
                    case 'double':
                        this.createDoubleFirework(x, y, targetY);
                        break;
                    case 'spiral':
                        this.createSpiralFirework(x, y, targetY);
                        break;
                    case 'star':
                        this.createStarFirework(x, y, targetY);
                        break;
                    case 'chrysanthemum':
                        this.createChrysanthemumFirework(x, y, targetY);
                        break;
                }
                break;
            }
        }
    }

    createHeartFirework(x, y, targetY) {
        const colors = ['#ff69b4', '#ff1493', '#ff0000', '#ff007f'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const scale = 3.0;

        this.createLaunchTrail(x, y, targetY, color);

        const particleCount = 120;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const heartX = scale * (16 * Math.pow(Math.sin(angle), 3));
            const heartY = scale * -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * 1.2;

            const velocity = 8 + Math.random() * 3;
            const finalAngle = Math.atan2(heartY, heartX);

            this.createParticle(x, y, targetY, color, finalAngle, velocity, 'heart', scale);
        }
    }

    createLaunchTrail(x, y, targetY, color) {
        const trailCount = this.trailLength;
        const trailSpacing = (y - targetY) / trailCount;

        for (let i = 0; i < trailCount; i++) {
            const trailY = y - i * trailSpacing;
            const particle = {
                x,
                y: trailY,
                color,
                radius: this.trailWidth - (i / trailCount) * 3,
                alpha: this.trailOpacity * (1 - i / trailCount),
                type: 'trail',
                fadeSpeed: 0.01,
                glow: true,
                glowSize: 25,
                sparkle: Math.random() < 0.3
            };
            this.particles.push(particle);
        }
    }

    createParticle(x, y, targetY, color, angle, velocity, type = 'normal', scale = 1) {
        if (this.particles.length >= this.maxParticles) return;

        const particle = {
            x,
            y,
            targetY,
            color,
            radius: type === 'heart' ? 3.5 * scale : 2.5,
            angle,
            velocity,
            alpha: 1,
            stage: 1,
            type,
            scale,
            initialVelocity: velocity,
            glowSize: 15 * scale,
            fadeSpeed: 0.015
        };
        this.particles.push(particle);
    }

    animate(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (deltaTime > 50) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }

        const timeScale = Math.min(deltaTime / 16.67, 2);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const activeParticles = [];

        for (const p of this.particles) {
            if (this.updateParticle(p, timeScale)) {
                activeParticles.push(p);
            }
        }

        this.particles = activeParticles;
        requestAnimationFrame((time) => this.animate(time));
    }

    updateParticle(p, timeScale) {
        if (p.type === 'trail') {
            p.alpha -= p.fadeSpeed;
            if (p.alpha <= 0) return false;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            if (p.sparkle) {
                p.alpha *= 0.95 + Math.random() * 0.1;
            }

            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = p.glowSize;

            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.radius * 2
            );
            gradient.addColorStop(0, `rgba(${this.hexToRgb(p.color)}, ${p.alpha})`);
            gradient.addColorStop(1, `rgba(${this.hexToRgb(p.color)}, 0)`);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            return true;
        }

        if (p.stage === 1) {
            p.y -= 15 * timeScale;
            if (p.y <= p.targetY) {
                p.stage = 2;
            }
            return true;
        }

        p.x += Math.cos(p.angle) * p.velocity * timeScale;
        p.y += (Math.sin(p.angle) * p.velocity + 0.2) * timeScale;
        p.velocity *= 0.99;
        p.alpha *= 0.985;

        if (p.alpha <= 0.05) return false;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * (2 - p.alpha), 0, Math.PI * 2);

        const gradient = this.ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius * (2.5 - p.alpha)
        );
        gradient.addColorStop(0, `rgba(${this.hexToRgb(p.color)}, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(${this.hexToRgb(p.color)}, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 15 * p.alpha;
        this.ctx.fill();
        return true;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : null;
    }

    createCircleFirework(x, y, targetY) {
        const colors = ['#ff69b4', '#4169e1', '#ffd700', '#ff1493'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.createLaunchTrail(x, y, targetY, color);

        const rings = 5;
        for (let ring = 0; ring < rings; ring++) {
            const particleCount = 50 + ring * 20;
            const baseVelocity = 4 + ring * 3;

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = baseVelocity + Math.random() * 3;
                const scale = 2 - ring * 0.3;
                const ringColor = this.shiftHue(color, ring * 15);
                this.createParticle(x, y, targetY, ringColor, angle, velocity, 'circle', scale);
            }
        }
    }

    createDoubleFirework(x, y, targetY) {
        const colors = ['#ff69b4', '#ffd700', '#ff1493', '#4169e1'];
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        let color2;
        do {
            color2 = colors[Math.floor(Math.random() * colors.length)];
        } while (color2 === color1);

        this.createLaunchTrail(x, y, targetY, color1);

        for (let i = 0; i < 80; i++) {
            const angle = (Math.PI * 2 * i) / 80;
            const velocity = 3 + Math.random() * 2;
            const scale = 1.5;
            this.createParticle(x, y, targetY, color1, angle, velocity, 'double', scale);
        }

        for (let i = 0; i < 100; i++) {
            const angle = (Math.PI * 2 * i) / 100;
            const velocity = 10 + Math.random() * 4;
            const scale = 1.2;
            this.createParticle(x, y, targetY, color2, angle, velocity, 'double', scale);
        }
    }

    createSpiralFirework(x, y, targetY) {
        const colors = ['#ff1493', '#ffd700', '#4169e1'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.createLaunchTrail(x, y, targetY, color);

        const arms = 6;
        const particlesPerArm = 50;
        const rotations = 3;

        for (let arm = 0; arm < arms; arm++) {
            const baseAngle = (Math.PI * 2 * arm) / arms;
            const armColor = this.shiftHue(color, arm * 20);

            for (let i = 0; i < particlesPerArm; i++) {
                const angle = baseAngle + (i * Math.PI * 2 * rotations / particlesPerArm);
                const velocity = 3 + i * 0.2;
                const scale = 1.5 - (i / particlesPerArm) * 0.7;
                this.createParticle(x, y, targetY, armColor, angle, velocity, 'spiral', scale);
            }
        }
    }

    createStarFirework(x, y, targetY) {
        const colors = ['#ffd700', '#ff69b4', '#4169e1'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.createLaunchTrail(x, y, targetY, color);

        const points = 5;
        const particlesPerPoint = 35;

        for (let i = 0; i < points; i++) {
            const baseAngle = (Math.PI * 2 * i) / points;
            for (let j = 0; j < particlesPerPoint; j++) {
                const angle = baseAngle + (Math.random() - 0.5) * 0.2;
                const velocity = 9 + Math.random() * 4;
                const scale = 1.5;
                this.createParticle(x, y, targetY, color, angle, velocity, 'star', scale);
            }
            for (let j = 0; j < particlesPerPoint; j++) {
                const angle = baseAngle + (Math.random() - 0.5) * 1.5;
                const velocity = 3 + Math.random() * 3;
                const scale = 1.2;
                const innerColor = this.shiftHue(color, 30);
                this.createParticle(x, y, targetY, innerColor, angle, velocity, 'star', scale);
            }
        }
    }

    createChrysanthemumFirework(x, y, targetY) {
        const colors = ['#ff69b4', '#ffd700', '#ff1493'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.createLaunchTrail(x, y, targetY, color);

        const layers = 6;
        const particlesPerLayer = 60;

        for (let layer = 0; layer < layers; layer++) {
            const radius = 3 + layer * 3;
            const layerColor = this.shiftHue(color, layer * 25);

            for (let i = 0; i < particlesPerLayer; i++) {
                const angle = (Math.PI * 2 * i) / particlesPerLayer;
                const velocity = radius + Math.random() * 2;
                const scale = 1.5 - (layer / layers) * 0.5;
                const angleOffset = (Math.random() - 0.5) * 0.2;
                this.createParticle(x, y, targetY, layerColor, angle + angleOffset, velocity, 'chrysanthemum', scale);
            }
        }
    }

    shiftHue(color, degree) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `#${Math.min(255, r + degree).toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${Math.max(0, b - degree).toString(16).padStart(2, '0')}`;
    }
} 