/**
 * Visual Effects Lab - Core Engine (TypeScript Version)
 * 特效引擎核心，负责管理所有特效的加载、运行和渲染
 */

import type { IEffect, EffectParams, PerformanceMetrics, FPSStats } from '../types';

export class EffectEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private effects: Map<string, new (canvas: HTMLCanvasElement, params?: EffectParams) => IEffect>;
  private currentEffect: IEffect | null = null;
  private isRunning: boolean = false;
  private animationId: number | null = null;
  private lastTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;
  private fpsHistory: number[] = [];
  private metrics: PerformanceMetrics;
  private resizeHandler: () => void;
  private destroyed: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法获取 Canvas 上下文');
    }
    this.ctx = context;
    this.effects = new Map();
    this.metrics = this.createInitialMetrics();
    this.destroyed = false;
    
    // 绑定 resize 处理器
    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    
    this.resize();
  }

  private createInitialMetrics(): PerformanceMetrics {
    return {
      fps: {
        current: 60,
        average: 60,
        min: 60,
        max: 60,
        history: []
      },
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0
    };
  }

  /**
   * 调整 Canvas 尺寸
   */
  resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    if (this.currentEffect && this.currentEffect.onResize) {
      this.currentEffect.onResize();
    }
  }

  /**
   * 注册特效
   */
  registerEffect(
    name: string, 
    effectClass: new (canvas: HTMLCanvasElement, params?: EffectParams) => IEffect
  ): void {
    this.effects.set(name, effectClass);
    console.log(`[Engine] 注册特效：${name}`);
  }

  /**
   * 加载并运行动画
   */
  async loadEffect(name: string, params: EffectParams = {}): Promise<boolean> {
    // 停止当前特效
    if (this.currentEffect) {
      this.stopEffect();
    }

    const EffectClass = this.effects.get(name);
    if (!EffectClass) {
      console.error(`[Engine] 特效不存在：${name}`);
      return false;
    }

    try {
      // 创建新特效实例
      this.currentEffect = new EffectClass(this.canvas, params);
      await this.currentEffect.init();

      // 开始渲染循环
      this.startRendering();
      
      console.log(`[Engine] 加载特效：${name}`);
      this.dispatchCustomEvent('effect-loaded', { name });
      return true;
    } catch (error) {
      console.error(`[Engine] 加载特效失败：${name}`, error);
      this.dispatchCustomEvent('error', { name, error });
      return false;
    }
  }

  /**
   * 停止当前特效
   */
  stopEffect(): void {
    if (this.currentEffect) {
      this.currentEffect.destroy();
      this.currentEffect = null;
    }
    this.stopRendering();
    this.clearCanvas();
    this.dispatchCustomEvent('effect-unloaded', {});
  }

  /**
   * 开始渲染循环
   */
  private startRendering(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.renderLoop();
  }

  /**
   * 停止渲染循环
   */
  private stopRendering(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 渲染循环
   */
  private renderLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 更新性能指标
    this.updateMetrics(deltaTime);

    // 清空画布
    this.clearCanvas();

    // 更新和渲染特效
    if (this.currentEffect) {
      const renderStart = performance.now();
      this.currentEffect.update(deltaTime);
      this.currentEffect.render(this.ctx);
      this.metrics.renderTime = performance.now() - renderStart;
    }

    // 继续下一帧
    this.animationId = requestAnimationFrame(() => this.renderLoop());
  }

  /**
   * 更新性能指标
   */
  private updateMetrics(deltaTime: number): void {
    this.frameCount++;
    const currentTime = performance.now();
    
    // 每 0.5 秒更新一次 FPS（更平滑）
    if (currentTime - this.fpsUpdateTime >= 500) {
      const instantaneousFPS = this.frameCount / ((currentTime - this.fpsUpdateTime) / 1000);
      
      // 移动平均平滑（5 帧窗口）
      this.fpsHistory.push(instantaneousFPS);
      if (this.fpsHistory.length > 5) {
        this.fpsHistory.shift();
      }
      
      const averageFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      
      this.metrics.fps = {
        current: Math.round(instantaneousFPS),
        average: Math.round(averageFPS),
        min: Math.min(...this.fpsHistory),
        max: Math.max(...this.fpsHistory),
        history: [...this.fpsHistory]
      };
      
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
      
      // 触发自定义事件
      this.dispatchCustomEvent('fps-update', { fps: Math.round(averageFPS) });
    }
    
    this.metrics.frameTime = deltaTime;
    
    // 内存使用（如果浏览器支持）
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory ? memory.usedJSHeapSize : 0;
    }
  }

  /**
   * 清空画布（优化版）
   */
  private clearCanvas(): void {
    // 如果当前特效需要拖尾效果，使用半透明 fillRect
    if (this.currentEffect && this.currentEffect.needsTrail) {
      const trailAlpha = (this.currentEffect.params as any).trailAlpha || 0.2;
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
  getFPS(): number {
    return this.metrics.fps.current;
  }

  /**
   * 获取性能指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 获取所有已注册的特效
   */
  getAvailableEffects(): string[] {
    return Array.from(this.effects.keys());
  }

  /**
   * 获取当前特效名称
   */
  getCurrentEffect(): string | null {
    return this.currentEffect ? this.currentEffect.name : null;
  }

  /**
   * 获取当前特效实例
   */
  getCurrentEffectInstance(): IEffect | null {
    return this.currentEffect;
  }

  /**
   * 暂停/继续渲染
   */
  togglePause(): void {
    if (this.isRunning) {
      this.stopRendering();
      this.dispatchCustomEvent('paused', {});
    } else {
      this.lastTime = performance.now();
      this.startRendering();
      this.dispatchCustomEvent('resumed', {});
    }
  }

  /**
   * 判断是否正在运行
   */
  isPaused(): boolean {
    return !this.isRunning;
  }

  /**
   * 触发自定义事件
   */
  private dispatchCustomEvent(type: string, detail: any): void {
    const event = new CustomEvent(type, { detail });
    this.canvas.dispatchEvent(event);
  }

  /**
   * 清理资源
   */
  destroy(): void {
    if (this.destroyed) return;
    
    this.stopEffect();
    this.effects.clear();
    
    // 移除事件监听器
    window.removeEventListener('resize', this.resizeHandler);
    
    this.destroyed = true;
  }
}
