/**
 * Visual Effects Lab - TypeScript 类型定义
 */

// 特效参数类型
export interface EffectParams {
  [key: string]: number | string | boolean;
}

// 特效接口定义
export interface IEffect {
  name: string;
  category: 'horizontal' | 'vertical' | 'diagonal' | 'dynamic';
  params: EffectParams;
  initialized: boolean;
  needsTrail: boolean;
  
  init(): Promise<void>;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  onResize(): void;
  destroy(): void;
  updateParams(newParams: Partial<EffectParams>): void;
  reset(): void;
}

// 特效元数据
export interface EffectMeta {
  name: string;
  displayName: string;
  category: string;
  description?: string;
  thumbnail?: string;
  author?: string;
  version?: string;
}

// 特效配置
export interface EffectConfig {
  meta: EffectMeta;
  component: new (canvas: HTMLCanvasElement, params?: EffectParams) => IEffect;
  defaultParams: EffectParams;
}

// 特效注册表
export interface EffectRegistry {
  [key: string]: EffectConfig;
}

// FPS 统计
export interface FPSStats {
  current: number;
  average: number;
  min: number;
  max: number;
  history: number[];
}

// 性能指标
export interface PerformanceMetrics {
  fps: FPSStats;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
}

// 用户设置
export interface UserSettings {
  theme: 'dark' | 'light' | 'cyberpunk' | 'matrix' | 'solarized';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  showFPS: boolean;
  autoPause: boolean;
  soundEnabled: boolean;
  volume: number;
}

// 收藏的特效
export interface FavoriteEffect {
  effectName: string;
  addedAt: Date;
  customParams?: EffectParams;
  notes?: string;
}

// 播放列表项
export interface PlaylistItem {
  effectName: string;
  duration: number; // 毫秒
  transition?: 'fade' | 'cut' | 'slide';
  transitionDuration?: number;
}

// 事件类型
export interface EngineEvent {
  type: 'effect-loaded' | 'effect-unloaded' | 'paused' | 'resumed' | 'fps-update' | 'error';
  payload?: any;
  timestamp: number;
}

// Toast 通知
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
