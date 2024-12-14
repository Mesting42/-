class HeartTrail {
    constructor() {
        this.hearts = [];
        this.mouse = { x: 0, y: 0 };
        this.lastCreated = 0;
        this.minInterval = 30; // 减少间隔，增加爱心产生频率

        // 创建画布
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // 设置画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 监听鼠标/触摸移动
        document.addEventListener('mousemove', (e) => this.updateMousePosition(e));
        document.addEventListener('touchmove', (e) => {
            if (e.touches[0]) {
                e.preventDefault();
                this.updateMousePosition(e.touches[0]);
            }
        }, { passive: false });

        // 开始动画
        requestAnimationFrame(() => this.animate());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    updateMousePosition(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        const currentTime = Date.now();
        if (currentTime - this.lastCreated > this.minInterval) {
            this.createHeart();
            this.lastCreated = currentTime;
        }
    }

    createHeart() {
        const colors = ['#ff69b4', '#ff1493', '#ff0000', '#ff007f', '#ff66ff', '#ff3366'];
        this.hearts.push({
            x: this.mouse.x,
            y: this.mouse.y,
            size: Math.random() * 20 + 15, // 增大爱心尺寸
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: (Math.random() - 0.5) * 3, // 增加水平速度
                y: -Math.random() * 4 - 3    // 增加垂直速度
            },
            alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            scale: 1
        });
    }

    drawHeart(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(size, size);

        // 优化爱心形状
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-2, -2.5, -4, -1.5, 0, 2);
        ctx.bezierCurveTo(4, -1.5, 2, -2.5, 0, 0);
        ctx.closePath();

        // 添加阴影效果
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;

        ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];

            heart.x += heart.velocity.x;
            heart.y += heart.velocity.y;
            heart.velocity.y += 0.15; // 增加重力效果
            heart.alpha -= 0.008; // 减慢消失速度
            heart.rotation += 0.05;
            heart.scale = Math.max(0.2, heart.alpha * 1.2); // 添加缩放效果

            this.ctx.save();
            this.ctx.globalAlpha = heart.alpha;
            this.ctx.fillStyle = heart.color;
            this.drawHeart(this.ctx, heart.x, heart.y, heart.size / 10 * heart.scale, heart.rotation);
            this.ctx.fill();
            this.ctx.restore();

            if (heart.alpha <= 0) {
                this.hearts.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
} 