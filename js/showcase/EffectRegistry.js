/**
 * 效果注册表
 * 负责注册和管理所有内置的视觉效果
 * @module EffectRegistry
 */

class EffectRegistry {
    constructor(showcaseEngine) {
        this.engine = showcaseEngine;
        this.effectsRenderer = null;
    }

    /**
     * 注册所有内置效果
     */
    registerAllEffects() {
        this.registerMatrixRain();
        this.registerNetworkTopology();
        this.registerParticleExplosion();
        this.registerGlitchEffect();
        this.registerScanlines();
        this.registerScreenFlash();
        this.registerTypewriter();
        this.registerCodeRain();
        this.registerWaveEffect();
        this.registerPulseEffect();
        this.registerRippleEffect();
        this.registerDistortionEffect();
        
        console.log('[EffectRegistry] 所有内置效果已注册');
    }

    /**
     * 注册矩阵雨效果
     */
    registerMatrixRain() {
        this.engine.registerEffect('matrix_rain', {
            name: '矩阵雨',
            category: 'matrix',
            description: '经典黑客绿色字符雨效果',
            duration: 10000,
            tags: ['矩阵', '字符', '黑客', '经典'],
            defaultParams: {
                color: '#00ff00',
                fontSize: 14,
                speed: 30,
                density: 0.9,
                characters: 'アィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴ 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            },
            params: {
                color: { type: 'color', label: '颜色', default: '#00ff00' },
                fontSize: { type: 'range', label: '字体大小', min: 8, max: 32, default: 14 },
                speed: { type: 'range', label: '下落速度', min: 10, max: 100, default: 30 },
                density: { type: 'range', label: '密度', min: 0.1, max: 1, step: 0.1, default: 0.9 }
            },
            play: async (params) => {
                return this.playMatrixRain(params);
            },
            stop: () => {
                this.stopMatrixRain();
            }
        });
    }

    /**
     * 播放矩阵雨
     * @param {Object} params - 参数
     */
    async playMatrixRain(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { color, fontSize, speed, density, characters } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > density) {
                    drops[i] = 0;
                }
                drops[i] += speed / 10;
            }
        };

        const interval = setInterval(draw, 33);
        return { interval, canvas, ctx };
    }

    /**
     * 停止矩阵雨
     */
    stopMatrixRain() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册网络拓扑效果
     */
    registerNetworkTopology() {
        this.engine.registerEffect('network_topology', {
            name: '网络拓扑',
            category: 'network',
            description: '动态节点连接动画',
            duration: 8000,
            tags: ['网络', '节点', '连接', '拓扑'],
            defaultParams: {
                nodeCount: 50,
                connectionDistance: 150,
                nodeSize: 3,
                color: '#00ffff',
                speed: 1
            },
            play: async (params) => {
                return this.playNetworkTopology(params);
            },
            stop: () => {
                this.stopNetworkTopology();
            }
        });
    }

    /**
     * 播放网络拓扑
     * @param {Object} params - 参数
     */
    async playNetworkTopology(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { nodeCount, connectionDistance, nodeSize, color, speed } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed
            });
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = color;
                        ctx.globalAlpha = 1 - distance / connectionDistance;
                        ctx.lineWidth = 1;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }

            ctx.fillStyle = color;
            for (const node of nodes) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const interval = setInterval(draw, 16);
        return { interval, canvas, ctx, nodes };
    }

    /**
     * 停止网络拓扑
     */
    stopNetworkTopology() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册粒子爆炸效果
     */
    registerParticleExplosion() {
        this.engine.registerEffect('particle_explosion', {
            name: '粒子爆炸',
            category: 'particle',
            description: '点击位置产生粒子爆炸效果',
            duration: 3000,
            tags: ['粒子', '爆炸', '点击', '动画'],
            defaultParams: {
                particleCount: 100,
                colors: ['#ff0000', '#ffff00', '#ff8800'],
                size: 5,
                gravity: 0.2,
                friction: 0.98,
                spread: 360
            },
            play: async (params) => {
                return this.playParticleExplosion(params);
            },
            stop: () => {
                this.stopParticleExplosion();
            }
        });
    }

    /**
     * 播放粒子爆炸
     * @param {Object} params - 参数
     */
    async playParticleExplosion(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { particleCount, colors, size, gravity, friction, spread } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const velocity = 5 + Math.random() * 10;
            particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: size + Math.random() * 3
            });
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += gravity;
                p.vx *= friction;
                p.vy *= friction;
                p.life -= p.decay;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if (particles.length > 0) {
                requestAnimationFrame(draw);
            }
        };

        draw();
        return { canvas, ctx, particles };
    }

    /**
     * 停止粒子爆炸
     */
    stopParticleExplosion() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册故障效果
     */
    registerGlitchEffect() {
        this.engine.registerEffect('glitch', {
            name: '故障艺术',
            category: 'glitch',
            description: '屏幕抖动和色彩分离效果',
            duration: 2000,
            tags: ['故障', '抖动', '色彩分离', '赛博朋克'],
            defaultParams: {
                intensity: 20,
                duration: 2000,
                slices: 10,
                colors: ['#ff0000', '#00ff00', '#0000ff']
            },
            play: async (params) => {
                return this.playGlitchEffect(params);
            },
            stop: () => {
                this.stopGlitchEffect();
            }
        });
    }

    /**
     * 播放故障效果
     * @param {Object} params - 参数
     */
    async playGlitchEffect(params = {}) {
        const { intensity, duration, slices, colors } = params;
        const container = document.querySelector('.main-container') || document.body;
        
        let elapsed = 0;
        const interval = setInterval(() => {
            const slice = Math.floor(Math.random() * slices);
            const offset = (Math.random() - 0.5) * intensity;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            container.style.transform = `translate(${offset}px, ${Math.random() * 10 - 5}px)`;
            container.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(2)`;
            
            elapsed += 50;
            if (elapsed >= duration) {
                clearInterval(interval);
                container.style.transform = '';
                container.style.filter = '';
            }
        }, 50);

        return { interval, duration };
    }

    /**
     * 停止故障效果
     */
    stopGlitchEffect() {
        const container = document.querySelector('.main-container') || document.body;
        container.style.transform = '';
        container.style.filter = '';
    }

    /**
     * 注册扫描线效果
     */
    registerScanlines() {
        this.engine.registerEffect('scanlines', {
            name: '扫描线',
            category: 'overlay',
            description: 'CRT 显示器扫描线效果',
            duration: 5000,
            tags: ['扫描线', 'CRT', '复古', '覆盖层'],
            defaultParams: {
                color: 'rgba(0, 255, 0, 0.1)',
                speed: 2,
                thickness: 2
            },
            play: async (params) => {
                return this.playScanlines(params);
            },
            stop: () => {
                this.stopScanlines();
            }
        });
    }

    /**
     * 播放扫描线
     * @param {Object} params - 参数
     */
    async playScanlines(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { color, speed, thickness } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let y = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = color;
            for (let i = y; i < canvas.height; i += thickness * 2) {
                ctx.fillRect(0, i, canvas.width, thickness);
            }

            y += speed;
            if (y >= thickness * 2) {
                y = 0;
            }

            return requestAnimationFrame(draw);
        };

        const animationId = draw();
        return { animationId, canvas, ctx };
    }

    /**
     * 停止扫描线
     */
    stopScanlines() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册屏幕闪烁效果
     */
    registerScreenFlash() {
        this.engine.registerEffect('screen_flash', {
            name: '屏幕闪烁',
            category: 'flash',
            description: '全屏闪烁效果',
            duration: 500,
            tags: ['闪烁', '白光', '提示'],
            defaultParams: {
                color: '#ffffff',
                intensity: 0.8,
                fadeDuration: 300
            },
            play: async (params) => {
                return this.playScreenFlash(params);
            },
            stop: () => {
                this.stopScreenFlash();
            }
        });
    }

    /**
     * 播放屏幕闪烁
     * @param {Object} params - 参数
     */
    async playScreenFlash(params = {}) {
        const { color, intensity, fadeDuration } = params;
        
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = color;
        flash.style.opacity = intensity;
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9999';
        flash.style.transition = `opacity ${fadeDuration}ms ease-out`;
        
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                flash.remove();
            }, fadeDuration);
        }, 50);

        return { flash, duration: fadeDuration + 50 };
    }

    /**
     * 停止屏幕闪烁
     */
    stopScreenFlash() {
        const flash = document.querySelector('div[style*="z-index: 9999"]');
        if (flash) {
            flash.remove();
        }
    }

    /**
     * 注册打字机效果
     */
    registerTypewriter() {
        this.engine.registerEffect('typewriter', {
            name: '打字机',
            category: 'text',
            description: '文本逐字显示效果',
            duration: 3000,
            tags: ['文本', '打字机', '逐字', '动画'],
            defaultParams: {
                text: 'Hello, World!',
                speed: 100,
                color: '#00ff00',
                fontSize: 24
            },
            play: async (params) => {
                return this.playTypewriter(params);
            },
            stop: () => {
                this.stopTypewriter();
            }
        });
    }

    /**
     * 播放打字机效果
     * @param {Object} params - 参数
     */
    async playTypewriter(params = {}) {
        const { text, speed, color, fontSize } = params;
        
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.color = color;
        container.style.fontSize = `${fontSize}px`;
        container.style.fontFamily = 'monospace';
        container.style.zIndex = '9998';
        container.style.pointerEvents = 'none';
        
        document.body.appendChild(container);

        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                container.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => container.remove(), 2000);
            }
        }, speed);

        return { container, interval: typeInterval, text };
    }

    /**
     * 停止打字机效果
     */
    stopTypewriter() {
        const container = document.querySelector('div[style*="z-index: 9998"]');
        if (container) {
            container.remove();
        }
    }

    /**
     * 注册代码雨效果
     */
    registerCodeRain() {
        this.engine.registerEffect('code_rain', {
            name: '代码雨',
            category: 'code',
            description: '编程语言代码下落效果',
            duration: 8000,
            tags: ['代码', '编程', '下落', '技术'],
            defaultParams: {
                language: 'javascript',
                color: '#00ff00',
                fontSize: 12,
                speed: 50
            },
            play: async (params) => {
                return this.playCodeRain(params);
            },
            stop: () => {
                this.stopCodeRain();
            }
        });
    }

    /**
     * 播放代码雨
     * @param {Object} params - 参数
     */
    async playCodeRain(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { language, color, fontSize, speed } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const codeSnippets = {
            javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
            python: ['def', 'class', 'if', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except'],
            cpp: ['int', 'void', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'include', 'namespace', 'template']
        };

        const words = codeSnippets[language] || codeSnippets.javascript;
        const columns = Math.floor(canvas.width / 100);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = {
                y: Math.random() * -100,
                text: words[Math.floor(Math.random() * words.length)]
            };
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                ctx.fillText(drop.text, i * 100, drop.y);
                drop.y += speed;

                if (drop.y > canvas.height) {
                    drop.y = Math.random() * -100;
                    drop.text = words[Math.floor(Math.random() * words.length)];
                }
            }
        };

        const interval = setInterval(draw, 100);
        return { interval, canvas, ctx };
    }

    /**
     * 停止代码雨
     */
    stopCodeRain() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册波浪效果
     */
    registerWaveEffect() {
        this.engine.registerEffect('wave', {
            name: '波浪',
            category: 'wave',
            description: '正弦波浪动画',
            duration: 6000,
            tags: ['波浪', '正弦', '波动', '动画'],
            defaultParams: {
                color: '#00ffff',
                amplitude: 50,
                frequency: 0.02,
                speed: 0.05,
                lineWidth: 2
            },
            play: async (params) => {
                return this.playWaveEffect(params);
            },
            stop: () => {
                this.stopWaveEffect();
            }
        });
    }

    /**
     * 播放波浪效果
     * @param {Object} params - 参数
     */
    async playWaveEffect(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { color, amplitude, frequency, speed, lineWidth } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let offset = 0;

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();

            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + Math.sin(x * frequency + offset) * amplitude;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
            offset += speed;
            return requestAnimationFrame(draw);
        };

        const animationId = draw();
        return { animationId, canvas, ctx };
    }

    /**
     * 停止波浪效果
     */
    stopWaveEffect() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册脉冲效果
     */
    registerPulseEffect() {
        this.engine.registerEffect('pulse', {
            name: '脉冲',
            category: 'pulse',
            description: '圆形脉冲扩散效果',
            duration: 3000,
            tags: ['脉冲', '扩散', '圆形', '动画'],
            defaultParams: {
                color: '#ff00ff',
                startRadius: 10,
                endRadius: 300,
                speed: 5,
                lineWidth: 3
            },
            play: async (params) => {
                return this.playPulseEffect(params);
            },
            stop: () => {
                this.stopPulseEffect();
            }
        });
    }

    /**
     * 播放脉冲效果
     * @param {Object} params - 参数
     */
    async playPulseEffect(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { color, startRadius, endRadius, speed, lineWidth } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let radius = startRadius;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = 1 - (radius - startRadius) / (endRadius - startRadius);
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;

            radius += speed;

            if (radius < endRadius) {
                return requestAnimationFrame(draw);
            }
        };

        const animationId = draw();
        return { animationId, canvas, ctx };
    }

    /**
     * 停止脉冲效果
     */
    stopPulseEffect() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册涟漪效果
     */
    registerRippleEffect() {
        this.engine.registerEffect('ripple', {
            name: '涟漪',
            category: 'ripple',
            description: '鼠标点击涟漪扩散效果',
            duration: 2000,
            tags: ['涟漪', '点击', '扩散', '交互'],
            defaultParams: {
                color: 'rgba(0, 255, 255, 0.6)',
                maxRadius: 200,
                speed: 5,
                lineWidth: 2
            },
            play: async (params) => {
                return this.playRippleEffect(params);
            },
            stop: () => {
                this.stopRippleEffect();
            }
        });
    }

    /**
     * 播放涟漪效果
     * @param {Object} params - 参数
     */
    async playRippleEffect(params = {}) {
        const canvas = document.getElementById('effect-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { color, maxRadius, speed, lineWidth } = params;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ripples = [];

        const addRipple = (x, y) => {
            ripples.push({
                x,
                y,
                radius: 0,
                alpha: 1
            });
        };

        const handleClick = (e) => {
            addRipple(e.clientX, e.clientY);
        };

        canvas.addEventListener('click', handleClick);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i];
                ripple.radius += speed;
                ripple.alpha -= 0.02;

                if (ripple.alpha <= 0 || ripple.radius >= maxRadius) {
                    ripples.splice(i, 1);
                    continue;
                }

                ctx.strokeStyle = color.replace(/[\d.]+\)$/g, `${ripple.alpha})`);
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (ripples.length > 0) {
                return requestAnimationFrame(draw);
            } else {
                canvas.removeEventListener('click', handleClick);
            }
        };

        const animationId = draw();
        return { animationId, canvas, ctx, addRipple };
    }

    /**
     * 停止涟漪效果
     */
    stopRippleEffect() {
        const canvas = document.getElementById('effect-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /**
     * 注册扭曲效果
     */
    registerDistortionEffect() {
        this.engine.registerEffect('distortion', {
            name: '扭曲',
            category: 'distortion',
            description: '屏幕扭曲波动效果',
            duration: 3000,
            tags: ['扭曲', '波动', '变形', '特效'],
            defaultParams: {
                amplitude: 30,
                frequency: 0.05,
                speed: 0.1,
                direction: 'horizontal'
            },
            play: async (params) => {
                return this.playDistortionEffect(params);
            },
            stop: () => {
                this.stopDistortionEffect();
            }
        });
    }

    /**
     * 播放扭曲效果
     * @param {Object} params - 参数
     */
    async playDistortionEffect(params = {}) {
        const { amplitude, frequency, speed, direction } = params;
        const container = document.querySelector('.main-container') || document.body;
        
        let offset = 0;
        let frameId;

        const animate = () => {
            if (direction === 'horizontal') {
                container.style.transform = `perspective(1000px) rotateY(${Math.sin(offset) * 10}deg)`;
            } else {
                container.style.transform = `perspective(1000px) rotateX(${Math.sin(offset) * 10}deg)`;
            }
            
            offset += speed;
            frameId = requestAnimationFrame(animate);
        };

        animate();
        return { frameId, container };
    }

    /**
     * 停止扭曲效果
     */
    stopDistortionEffect() {
        const container = document.querySelector('.main-container') || document.body;
        container.style.transform = '';
    }
}

window.EffectRegistry = EffectRegistry;
