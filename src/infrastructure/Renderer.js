/**
 * ==========================================
 * 模块名称：infrastructure/Renderer.js
 * 功能：渲染引擎 - 统一管理所有视觉渲染
 * 版本：1.0.0 - 模块化、高性能
 * 依赖：EventBus, ConfigManager
 * ==========================================
 */

/**
 * 渲染模式枚举
 */
const RenderMode = {
    CANVAS: 'canvas',
    DOM: 'dom',
    WEBGL: 'webgl'
};

/**
 * 质量级别枚举
 */
const QualityLevel = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    ULTRA: 'ultra'
};

/**
 * 默认配置
 */
const DefaultConfig = {
    mode: 'canvas',
    enableHardwareAcceleration: true,
    targetFPS: 60,
    enableEffects: true,
    enableParticles: false,
    quality: {
        level: 'high',
        particleLimit: 1000,
        effectQuality: 1.0
    },
    performanceMonitor: true
};

/**
 * 渲染层类
 */
class RenderLayer {
    /**
     * 创建渲染层
     * @param {string} name - 层名称
     * @param {HTMLCanvasElement} canvas - Canvas 元素
     * @param {Object} options - 层选项
     */
    constructor(name, canvas, options = {}) {
        this.name = name;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.zIndex = options.zIndex || 0;
        this.opacity = options.opacity || 1.0;
        this.visible = options.visible !== false;
        this.blendMode = options.blendMode || 'source-over';
        
        this.canvas.style.zIndex = this.zIndex;
        this.canvas.style.opacity = this.opacity;
        this.canvas.style.display = this.visible ? 'block' : 'none';
    }
    
    /**
     * 清除层
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * 设置透明度
     * @param {number} opacity - 透明度 (0-1)
     */
    setOpacity(opacity) {
        this.opacity = Math.max(0, Math.min(1, opacity));
        this.canvas.style.opacity = this.opacity;
    }
    
    /**
     * 显示层
     */
    show() {
        this.visible = true;
        this.canvas.style.display = 'block';
    }
    
    /**
     * 隐藏层
     */
    hide() {
        this.visible = false;
        this.canvas.style.display = 'none';
    }
    
    /**
     * 置顶
     */
    toFront(zIndex = 999) {
        this.zIndex = zIndex;
        this.canvas.style.zIndex = this.zIndex;
    }
    
    /**
     * 置底
     */
    toBack(zIndex = 0) {
        this.zIndex = zIndex;
        this.canvas.style.zIndex = this.zIndex;
    }
    
    /**
     * 调整尺寸
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

/**
 * 粒子类
 */
class Particle {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || (Math.random() - 0.5) * 10;
        this.vy = options.vy || (Math.random() - 0.5) * 10;
        this.life = options.life || 1.0;
        this.maxLife = this.life;
        this.size = options.size || 3;
        this.color = options.color || '#ffffff';
        this.gravity = options.gravity || 0.2;
        this.friction = options.friction || 0.99;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.life -= 0.02;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.life / this.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
    
    isDead() {
        return this.life <= 0;
    }
}

/**
 * 动画类
 */
class Animation {
    constructor(name, config) {
        this.name = name;
        this.duration = config.duration || 1000;
        this.easing = config.easing || 'linear';
        this.onStart = config.onStart;
        this.onUpdate = config.onUpdate;
        this.onComplete = config.onComplete;
        
        this.startTime = 0;
        this.elapsed = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 0;
    }
    
    start() {
        this.startTime = performance.now();
        this.elapsed = 0;
        this.progress = 0;
        this.isPlaying = true;
        this.isPaused = false;
        
        if (this.onStart) {
            this.onStart();
        }
    }
    
    update(currentTime) {
        if (!this.isPlaying || this.isPaused) return true;
        
        this.elapsed = currentTime - this.startTime;
        this.progress = Math.min(1, this.elapsed / this.duration);
        
        const easedProgress = this.ease(this.progress, this.easing);
        
        if (this.onUpdate) {
            this.onUpdate(easedProgress);
        }
        
        if (this.progress >= 1) {
            this.complete();
            return false;
        }
        
        return true;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.startTime = performance.now() - this.elapsed;
        }
    }
    
    stop() {
        this.isPlaying = false;
        this.progress = 0;
    }
    
    complete() {
        this.isPlaying = false;
        this.progress = 1;
        
        if (this.onComplete) {
            this.onComplete();
        }
    }
    
    ease(progress, easing) {
        switch (easing) {
            case 'linear':
                return progress;
            case 'easeInQuad':
                return progress * progress;
            case 'easeOutQuad':
                return progress * (2 - progress);
            case 'easeInOutQuad':
                return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            case 'easeInCubic':
                return progress * progress * progress;
            case 'easeOutCubic':
                return 1 - Math.pow(1 - progress, 3);
            default:
                return progress;
        }
    }
}

/**
 * 性能监控器
 */
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.frameTime = 0;
        this.avgFrameTime = 0;
        this.frameTimes = [];
        this.maxSamples = 60;
    }
    
    begin() {
        this.frameStart = performance.now();
    }
    
    end() {
        const frameTime = performance.now() - this.frameStart;
        this.frameTime = frameTime;
        
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.maxSamples) {
            this.frameTimes.shift();
        }
        
        this.avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        
        this.frameCount++;
        
        const now = performance.now();
        const elapsed = now - this.lastTime;
        
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastTime = now;
        }
    }
    
    getStats() {
        return {
            fps: this.fps,
            frameTime: this.frameTime,
            avgFrameTime: this.avgFrameTime,
            isSlow: this.fps < 30,
            isCritical: this.fps < 15
        };
    }
    
    reset() {
        this.frameCount = 0;
        this.fps = 0;
        this.frameTimes = [];
        this.lastTime = performance.now();
    }
}

/**
 * 渲染器主类
 */
class Renderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.layers = new Map();
        this.particles = [];
        this.animations = new Map();
        this.effects = new Map();
        this.activeEffects = new Set();
        
        this.config = { ...DefaultConfig };
        this.isRunning = false;
        this.animationFrameId = null;
        this.lastTime = 0;
        
        this.performanceMonitor = new PerformanceMonitor();
        
        this.eventBus = null;
        this.configManager = null;
    }
    
    /**
     * 初始化渲染器
     * @param {Object} options - 配置选项
     * @returns {Promise<Renderer>}
     */
    async init(options = {}) {
        this.config = { ...DefaultConfig, ...options };
        
        if (window.EventBus) {
            this.eventBus = window.EventBus;
        }
        
        if (window.ConfigManager) {
            this.configManager = window.ConfigManager;
        }
        
        this.canvas = document.getElementById('effect-canvas');
        
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'effect-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
            `;
            document.body.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize(window.innerWidth, window.innerHeight);
        
        this.createLayer('background', { zIndex: 0, opacity: 1.0 });
        this.createLayer('foreground', { zIndex: 10, opacity: 1.0 });
        this.createLayer('effects', { zIndex: 20, opacity: 1.0 });
        
        if (this.eventBus) {
            await this.eventBus.emit('renderer:initialized', {
                mode: this.config.mode,
                quality: this.config.quality.level
            });
        }
        
        console.log('Renderer initialized');
        return this;
    }
    
    /**
     * 配置渲染器
     * @param {Object} config - 配置对象
     */
    configure(config) {
        this.config = { ...this.config, ...config };
        
        if (config.quality && this.configManager) {
            this.configManager.set('renderer.quality', config.quality, { saveHistory: false });
        }
    }
    
    /**
     * 创建渲染层
     * @param {string} name - 层名称
     * @param {Object} options - 层选项
     * @returns {RenderLayer}
     */
    createLayer(name, options = {}) {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        
        document.body.appendChild(canvas);
        
        const layer = new RenderLayer(name, canvas, options);
        layer.resize(this.canvas.width, this.canvas.height);
        this.layers.set(name, layer);
        
        return layer;
    }
    
    /**
     * 获取渲染层
     * @param {string} name - 层名称
     * @returns {RenderLayer}
     */
    getLayer(name) {
        return this.layers.get(name);
    }
    
    /**
     * 移除渲染层
     * @param {string} name - 层名称
     */
    removeLayer(name) {
        const layer = this.layers.get(name);
        if (layer) {
            layer.canvas.remove();
            this.layers.delete(name);
        }
    }
    
    /**
     * 调整渲染尺寸
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.layers.forEach(layer => {
            layer.resize(width, height);
        });
        
        if (this.eventBus) {
            this.eventBus.emit('renderer:resized', { width, height });
        }
    }
    
    /**
     * 开始渲染循环
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
        
        if (this.eventBus) {
            this.eventBus.emit('renderer:started');
        }
    }
    
    /**
     * 停止渲染循环
     */
    stop() {
        this.isRunning = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.eventBus) {
            this.eventBus.emit('renderer:stopped');
        }
    }
    
    /**
     * 渲染循环
     */
    loop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.config.performanceMonitor) {
            this.performanceMonitor.begin();
        }
        
        this.update(deltaTime, currentTime);
        this.render(deltaTime);
        
        if (this.config.performanceMonitor) {
            this.performanceMonitor.end();
            
            const stats = this.performanceMonitor.getStats();
            if (stats.isCritical) {
                this.handlePerformanceCritical(stats);
            }
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
    
    /**
     * 更新逻辑
     * @param {number} deltaTime - 时间增量 (ms)
     * @param {number} currentTime - 当前时间
     */
    update(deltaTime, currentTime) {
        this.animations.forEach((animation, name) => {
            const stillPlaying = animation.update(currentTime);
            if (!stillPlaying) {
                this.animations.delete(name);
            }
        });
        
        this.particles = this.particles.filter(particle => {
            particle.update();
            return !particle.isDead();
        });
        
        if (this.config.enableEffects) {
            this.updateEffects(deltaTime);
        }
    }
    
    /**
     * 渲染画面
     * @param {number} deltaTime - 时间增量 (ms)
     */
    render(deltaTime) {
        this.clear();
        
        const sortedLayers = Array.from(this.layers.values())
            .sort((a, b) => a.zIndex - b.zIndex);
        
        sortedLayers.forEach(layer => {
            if (layer.visible) {
                this.ctx.save();
                this.ctx.globalAlpha = layer.opacity;
                this.ctx.globalCompositeOperation = layer.blendMode;
                this.ctx.drawImage(layer.canvas, 0, 0);
                this.ctx.restore();
            }
        });
        
        if (this.config.enableParticles) {
            this.renderParticles();
        }
        
        if (this.config.enableEffects && this.activeEffects.size > 0) {
            this.renderEffects();
        }
    }
    
    /**
     * 清除所有层
     * @param {boolean} allLayers - 是否清除所有层
     */
    clear(allLayers = false) {
        if (allLayers) {
            this.layers.forEach(layer => layer.clear());
        } else {
            const bgLayer = this.layers.get('background');
            if (bgLayer) {
                bgLayer.clear();
            }
        }
    }
    
    /**
     * 添加粒子
     * @param {Particle} particle - 粒子对象
     */
    addParticle(particle) {
        if (this.particles.length >= this.config.quality.particleLimit) {
            this.particles.shift();
        }
        this.particles.push(particle);
    }
    
    /**
     * 添加爆炸效果
     * @param {number} x - X 坐标
     * @param {number} y - Y 坐标
     * @param {Object} options - 选项
     */
    addExplosion(x, y, options = {}) {
        const count = options.count || 50;
        const color = options.color || '#ff6600';
        
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y, {
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1.0,
                size: Math.random() * 4 + 2,
                color: color,
                gravity: 0.3
            });
            this.addParticle(particle);
        }
    }
    
    /**
     * 渲染粒子
     */
    renderParticles() {
        const fgLayer = this.layers.get('foreground');
        if (!fgLayer) return;
        
        this.particles.forEach(particle => {
            particle.draw(fgLayer.ctx);
        });
    }
    
    /**
     * 创建动画
     * @param {string} name - 动画名称
     * @param {Object} config - 动画配置
     * @returns {Animation}
     */
    createAnimation(name, config) {
        const animation = new Animation(name, config);
        this.animations.set(name, animation);
        return animation;
    }
    
    /**
     * 播放动画
     * @param {string} name - 动画名称
     */
    playAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.start();
        }
    }
    
    /**
     * 暂停动画
     * @param {string} name - 动画名称
     */
    pauseAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.pause();
        }
    }
    
    /**
     * 恢复动画
     * @param {string} name - 动画名称
     */
    resumeAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.resume();
        }
    }
    
    /**
     * 停止动画
     * @param {string} name - 动画名称
     */
    stopAnimation(name) {
        const animation = this.animations.get(name);
        if (animation) {
            animation.stop();
            this.animations.delete(name);
        }
    }
    
    /**
     * 启用特效
     * @param {string} effectName - 特效名称
     * @param {Object} options - 特效选项
     */
    enableEffect(effectName, options = {}) {
        this.activeEffects.add(effectName);
        
        const effect = this.effects.get(effectName);
        if (effect && effect.onStart) {
            effect.onStart(options);
        }
    }
    
    /**
     * 禁用特效
     * @param {string} effectName - 特效名称
     */
    disableEffect(effectName) {
        this.activeEffects.delete(effectName);
        
        const effect = this.effects.get(effectName);
        if (effect && effect.onStop) {
            effect.onStop();
        }
    }
    
    /**
     * 注册特效
     * @param {string} name - 特效名称
     * @param {Object} effect - 特效对象
     */
    registerEffect(name, effect) {
        this.effects.set(name, effect);
    }
    
    /**
     * 更新特效
     * @param {number} deltaTime - 时间增量 (ms)
     */
    updateEffects(deltaTime) {
        this.effects.forEach((effect, name) => {
            if (this.activeEffects.has(name) && effect.onUpdate) {
                effect.onUpdate(deltaTime);
            }
        });
    }
    
    /**
     * 渲染特效
     */
    renderEffects() {
        const fxLayer = this.layers.get('effects');
        if (!fxLayer) return;
        
        this.effects.forEach((effect, name) => {
            if (this.activeEffects.has(name) && effect.onRender) {
                effect.onRender(fxLayer.ctx);
            }
        });
    }
    
    /**
     * 触发故障效果
     * @param {number} duration - 持续时间 (ms)
     */
    triggerGlitch(duration = 500) {
        const glitchEffect = {
            startTime: performance.now(),
            duration: duration,
            
            onUpdate: (deltaTime) => {
                const elapsed = performance.now() - glitchEffect.startTime;
                if (elapsed >= duration) {
                    this.disableEffect('glitch');
                }
            },
            
            onRender: (ctx) => {
                const elapsed = performance.now() - glitchEffect.startTime;
                const progress = elapsed / duration;
                
                if (Math.random() > 0.5) {
                    const offset = (Math.random() - 0.5) * 20;
                    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                    
                    ctx.putImageData(imageData, offset, 0);
                    
                    ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.1 * (1 - progress)})`;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                }
            }
        };
        
        this.registerEffect('glitch', glitchEffect);
        this.enableEffect('glitch');
    }
    
    /**
     * 触发矩阵雨效果
     * @param {number} duration - 持续时间 (ms)
     */
    triggerMatrixRain(duration = 5000) {
        const matrixEffect = {
            columns: [],
            charSize: 20,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()',
            
            onStart: () => {
                const bgLayer = this.layers.get('background');
                if (bgLayer) {
                    const columnCount = Math.floor(bgLayer.canvas.width / matrixEffect.charSize);
                    matrixEffect.columns = Array(columnCount).fill(1);
                }
            },
            
            onRender: (ctx) => {
                const bgLayer = this.layers.get('background');
                if (!bgLayer || matrixEffect.columns.length === 0) return;
                
                ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                
                ctx.fillStyle = '#0F0';
                ctx.font = `${matrixEffect.charSize}px monospace`;
                
                for (let i = 0; i < matrixEffect.columns.length; i++) {
                    const char = matrixEffect.chars[Math.floor(Math.random() * matrixEffect.chars.length)];
                    ctx.fillText(char, i * matrixEffect.charSize, matrixEffect.columns[i] * matrixEffect.charSize);
                    
                    if (matrixEffect.columns[i] * matrixEffect.charSize > ctx.canvas.height && Math.random() > 0.975) {
                        matrixEffect.columns[i] = 0;
                    }
                    matrixEffect.columns[i]++;
                }
            },
            
            onStop: () => {
                const bgLayer = this.layers.get('background');
                if (bgLayer) {
                    bgLayer.clear();
                }
            }
        };
        
        this.registerEffect('matrixRain', matrixEffect);
        this.enableEffect('matrixRain');
        
        setTimeout(() => {
            this.disableEffect('matrixRain');
        }, duration);
    }
    
    /**
     * 触发扫描线效果
     */
    addScanline() {
        const scanlineEffect = {
            y: 0,
            speed: 2,
            
            onRender: (ctx) => {
                ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                ctx.fillRect(0, scanlineEffect.y, ctx.canvas.width, 2);
                
                scanlineEffect.y += scanlineEffect.speed;
                if (scanlineEffect.y > ctx.canvas.height) {
                    scanlineEffect.y = 0;
                }
            }
        };
        
        this.registerEffect('scanline', scanlineEffect);
        this.enableEffect('scanline');
    }
    
    /**
     * 处理性能临界状态
     * @param {Object} stats - 性能统计
     */
    handlePerformanceCritical(stats) {
        console.warn('Renderer performance critical:', stats);
        
        if (this.config.quality.level !== 'low') {
            this.configure({
                quality: {
                    ...this.config.quality,
                    particleLimit: Math.floor(this.config.quality.particleLimit * 0.5),
                    effectQuality: this.config.quality.effectQuality * 0.7
                }
            });
            
            if (this.eventBus) {
                this.eventBus.emit('performance:degraded', {
                    reason: 'low_fps',
                    fps: stats.fps
                });
            }
        }
    }
    
    /**
     * 获取性能统计
     * @returns {Object}
     */
    getPerformanceStats() {
        return this.performanceMonitor.getStats();
    }
    
    /**
     * 销毁渲染器
     */
    dispose() {
        this.stop();
        
        this.layers.forEach((layer, name) => {
            this.removeLayer(name);
        });
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animations.clear();
        this.effects.clear();
        this.activeEffects.clear();
        
        if (this.eventBus) {
            this.eventBus.emit('renderer:disposed');
        }
    }
}

const Renderer = new Renderer();

if (typeof window !== 'undefined') {
    window.Renderer = Renderer;
}

export default Renderer;
