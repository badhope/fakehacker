/**
 * Visual Effects Lab - Core Engine
 * 特效引擎核心，负责管理所有特效的加载、运行和渲染
 */

class EffectEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.effects = new Map();
        this.currentEffect = null;
        this.isRunning = false;
        this.animationId = null;
        this.lastTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        this.fpsUpdateTime = 0;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * 调整 Canvas 尺寸
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.currentEffect && this.currentEffect.onResize) {
            this.currentEffect.onResize();
        }
    }

    /**
     * 注册特效
     */
    registerEffect(name, effectClass) {
        this.effects.set(name, effectClass);
        console.log(`[Engine] 注册特效：${name}`);
    }

    /**
     * 加载并运行动画
     */
    async loadEffect(name, params = {}) {
        // 停止当前特效
        if (this.currentEffect) {
            this.stopEffect();
        }

        const EffectClass = this.effects.get(name);
        if (!EffectClass) {
            console.error(`[Engine] 特效不存在：${name}`);
            return false;
        }

        // 创建新特效实例
        this.currentEffect = new EffectClass(this.canvas, params);
        await this.currentEffect.init();

        // 开始渲染循环
        this.startRendering();
        
        console.log(`[Engine] 加载特效：${name}`);
        return true;
    }

    /**
     * 停止当前特效
     */
    stopEffect() {
        if (this.currentEffect) {
            this.currentEffect.destroy();
            this.currentEffect = null;
        }
        this.stopRendering();
        this.clearCanvas();
    }

    /**
     * 开始渲染循环
     */
    startRendering() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.renderLoop();
    }

    /**
     * 停止渲染循环
     */
    stopRendering() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 渲染循环
     */
    renderLoop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 更新 FPS
        this.updateFPS(currentTime);

        // 清空画布
        this.clearCanvas();

        // 更新和渲染特效
        if (this.currentEffect) {
            this.currentEffect.update(deltaTime);
            this.currentEffect.render(this.ctx);
        }

        // 继续下一帧
        this.animationId = requestAnimationFrame(() => this.renderLoop());
    }

    /**
     * 更新 FPS 计数（优化版 - 平滑处理）
     */
    updateFPS(currentTime) {
        this.frameCount++;
        
        // 每 0.5 秒更新一次 FPS（更平滑）
        if (currentTime - this.fpsUpdateTime >= 500) {
            const instantaneousFPS = this.frameCount / ((currentTime - this.fpsUpdateTime) / 1000);
            
            // 移动平均平滑（5 帧窗口）
            if (!this.fpsHistory) {
                this.fpsHistory = [];
            }
            this.fpsHistory.push(instantaneousFPS);
            if (this.fpsHistory.length > 5) {
                this.fpsHistory.shift();
            }
            
            this.fps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
            
            this.frameCount = 0;
            this.fpsUpdateTime = currentTime;
            
            // 触发自定义事件
            this.canvas.dispatchEvent(new CustomEvent('fpsUpdate', { 
                detail: { fps: Math.round(this.fps) } 
            }));
        }
    }

    /**
     * 清空画布（优化版）
     * 根据特效需求智能选择清空方式
     */
    clearCanvas() {
        // 如果当前特效需要拖尾效果，使用半透明 fillRect
        if (this.currentEffect && this.currentEffect.needsTrail) {
            const trailAlpha = this.currentEffect.params.trailAlpha || 0.2;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // 否则使用更快的 clearRect
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // 填充纯黑背景
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * 获取当前 FPS
     */
    getFPS() {
        return this.fps;
    }

    /**
     * 获取所有已注册的特效
     */
    getAvailableEffects() {
        return Array.from(this.effects.keys());
    }

    /**
     * 获取当前特效名称
     */
    getCurrentEffect() {
        return this.currentEffect ? this.currentEffect.name : null;
    }

    /**
     * 暂停/继续渲染
     */
    togglePause() {
        if (this.isRunning) {
            this.stopRendering();
        } else {
            this.lastTime = performance.now();
            this.startRendering();
        }
    }
}

// 导出到全局
window.EffectEngine = EffectEngine;
