class ChristmasTree {
    constructor() {
        try {
            this.createTrees();
            this.initLights();
            this.animateLights();
            this.addDecorations();
            this.initSnowfall();
        } catch (error) {
            console.error('圣诞树初始化失败:', error);
        }
    }

    createTrees() {
        this.createTree('left');
        this.createTree('right');
    }

    createTree(position) {
        const tree = document.createElement('div');
        tree.className = `christmas-tree-bg christmas-tree-${position}`;

        // 创建星星
        const star = document.createElement('div');
        star.className = 'tree-star';
        star.innerHTML = '⭐';
        tree.appendChild(star);

        // 创建树的层级
        for (let i = 0; i < 4; i++) {
            const layer = document.createElement('div');
            layer.className = 'tree-layer';
            layer.style.setProperty('--layer-index', i);
            tree.appendChild(layer);
        }

        // 创建树干
        const trunk = document.createElement('div');
        trunk.className = 'tree-trunk';
        tree.appendChild(trunk);

        document.body.appendChild(tree);
    }

    initLights() {
        const layers = document.querySelectorAll('.tree-layer');
        layers.forEach((layer, layerIndex) => {
            const lightsCount = 6 + layerIndex * 2;
            for (let i = 0; i < lightsCount; i++) {
                const light = document.createElement('div');
                light.className = 'tree-light';
                light.style.setProperty('--light-index', i);
                light.style.animationDelay = `${Math.random() * 2}s`;
                layer.appendChild(light);
            }
        });
    }

    animateLights() {
        const lights = document.querySelectorAll('.tree-light');
        lights.forEach(light => {
            light.addEventListener('animationend', () => {
                light.style.animationDelay = `${Math.random() * 2}s`;
                light.classList.remove('twinkle');
                void light.offsetWidth; // 触发重绘
                light.classList.add('twinkle');
            });
            light.classList.add('twinkle');
        });
    }

    addDecorations() {
        const layers = document.querySelectorAll('.tree-layer');
        const colors = ['#ff69b4', '#ff1493', '#ffd700', '#ff4500'];

        layers.forEach((layer, layerIndex) => {
            const decorCount = 4 + layerIndex * 2;
            for (let i = 0; i < decorCount; i++) {
                const decor = document.createElement('div');
                decor.className = 'tree-decoration';
                decor.style.background = colors[Math.floor(Math.random() * colors.length)];
                decor.style.left = `${Math.random() * 100}%`;
                decor.style.top = `${Math.random() * 100}%`;
                decor.style.animationDelay = `${Math.random() * 2}s`;
                layer.appendChild(decor);
            }
        });
    }

    initSnowfall() {
        // 创建雪花容器
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        document.body.appendChild(snowContainer);

        // 创建多种雪花形状和大小
        const snowflakes = [
            { char: '❄', size: '10px', speed: 5, opacity: 0.9 },
            { char: '❅', size: '14px', speed: 6, opacity: 0.8 },
            { char: '❆', size: '12px', speed: 4, opacity: 0.7 },
            { char: '✻', size: '16px', speed: 7, opacity: 0.9 },
            { char: '✼', size: '11px', speed: 5, opacity: 0.8 },
            { char: '❉', size: '13px', speed: 6, opacity: 0.7 },
            { char: '❋', size: '15px', speed: 4, opacity: 0.9 },
            { char: '✧', size: '12px', speed: 5, opacity: 0.8 }
        ];

        // 初始化一批雪花
        this.createInitialSnowflakes(snowContainer, snowflakes, 50);

        // 持续创建新雪花
        let lastTime = 0;
        const animate = (currentTime) => {
            if (currentTime - lastTime > 200) { // 每200ms创建新雪花
                this.createSnowflake(snowContainer, snowflakes);
                lastTime = currentTime;
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    createInitialSnowflakes(container, types, count) {
        for (let i = 0; i < count; i++) {
            const snowflake = this.createSnowflake(container, types, true);
            snowflake.style.top = `${Math.random() * 100}vh`;
            // 设置初始动画进度
            snowflake.style.animationDelay = `-${Math.random() * 5}s`;
        }
    }

    createSnowflake(container, types, isInitial = false) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // 随机选择雪花类型
        const type = types[Math.floor(Math.random() * types.length)];
        snowflake.innerHTML = type.char;

        // 随机位置和动画参数
        const startX = Math.random() * window.innerWidth;
        const swayAmount = 50 + Math.random() * 100;
        const duration = type.speed + Math.random() * 2;
        const delay = Math.random() * 3;

        // 设置样式
        Object.assign(snowflake.style, {
            left: `${startX}px`,
            fontSize: type.size,
            opacity: type.opacity,
            animation: `
                snowfall ${duration}s linear infinite,
                sway ${duration * 0.5}s ease-in-out infinite alternate
            `,
            animationDelay: `${delay}s, ${delay * 0.5}s`,
            textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
            zIndex: Math.floor(Math.random() * 3)
        });

        container.appendChild(snowflake);

        // 当雪花飘出屏幕时移除
        const removeAfter = (duration + delay) * 1000;
        setTimeout(() => {
            if (snowflake.parentNode === container) {
                container.removeChild(snowflake);
            }
        }, removeAfter);

        return snowflake;
    }
} 