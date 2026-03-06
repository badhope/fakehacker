# Renderer.js 模块设计文档

## 1. 模块概述

**模块名称**: Renderer.js (渲染引擎)  
**模块类型**: 基础设施层 (Infrastructure)  
**版本**: 1.0.0  
**作者**: 重构团队  
**创建日期**: 2026-03-07

---

## 2. 需求分析

### 2.1 功能需求

#### 2.1.1 核心渲染功能
- **FR-001**: 支持 Canvas 渲染模式（矩阵雨、网络拓扑、粒子效果等）
- **FR-002**: 支持 DOM 渲染模式（终端日志、UI 元素）
- **FR-003**: 支持 WebGL 渲染模式（高级 3D 效果）
- **FR-004**: 自动检测硬件加速能力并选择最佳渲染模式

#### 2.1.2 渲染控制
- **FR-010**: 支持渲染层管理（前景层、背景层、特效层）
- **FR-011**: 支持渲染优先级控制
- **FR-012**: 支持渲染性能监控（FPS、渲染时间）
- **FR-013**: 支持渲染状态保存与恢复

#### 2.1.3 动画系统
- **FR-020**: 支持帧动画（requestAnimationFrame）
- **FR-021**: 支持时间轴动画（基于时间的插值）
- **FR-022**: 支持动画混合与过渡
- **FR-023**: 支持动画暂停、恢复、停止

#### 2.1.4 特效系统
- **FR-030**: 支持屏幕后处理效果（模糊、发光、色差）
- **FR-031**: 支持粒子系统
- **FR-032**: 支持屏幕空间效果（扫描线、暗角、CRT 效果）
- **FR-033**: 支持故障艺术效果（Glitch、RGB Split）

#### 2.1.5 文本渲染
- **FR-040**: 支持终端风格文本渲染（等宽字体、打字机效果）
- **FR-041**: 支持富文本渲染（颜色、大小、字体样式）
- **FR-042**: 支持文本滚动与分页
- **FR-043**: 支持文本选择与复制

### 2.2 非功能需求

#### 2.2.1 性能需求
- **NFR-001**: 渲染帧率 ≥ 60 FPS（普通效果）
- **NFR-002**: 渲染帧率 ≥ 30 FPS（复杂效果）
- **NFR-003**: 内存占用 ≤ 50MB（空闲状态）
- **NFR-004**: 内存占用 ≤ 200MB（高负载状态）
- **NFR-005**: 支持自动降级（低性能设备）

#### 2.2.2 兼容性需求
- **NFR-010**: 支持 Chrome 90+
- **NFR-011**: 支持 Firefox 88+
- **NFR-012**: 支持 Safari 14+
- **NFR-013**: 支持 Edge 90+

#### 2.2.3 可用性需求
- **NFR-020**: 提供简单易用的 API
- **NFR-021**: 支持热插拔渲染器
- **NFR-022**: 支持运行时切换渲染模式
- **NFR-023**: 提供详细的错误信息与日志

---

## 3. 架构设计

### 3.1 模块结构

```
Renderer.js
├── CoreRenderer (核心渲染器 - 抽象基类)
│   ├── CanvasRenderer (Canvas 渲染器)
│   ├── DOMRenderer (DOM 渲染器)
│   └── WebGLRenderer (WebGL 渲染器 - 可选)
├── RenderLayer (渲染层管理)
├── AnimationSystem (动画系统)
├── EffectSystem (特效系统)
├── TextRenderer (文本渲染器)
└── PerformanceMonitor (性能监控)
```

### 3.2 类设计

#### 3.2.1 CoreRenderer (抽象基类)
```javascript
class CoreRenderer {
    // 属性
    - canvas: HTMLCanvasElement
    - ctx: CanvasRenderingContext2D
    - width: number
    - height: number
    - fps: number
    - isRunning: boolean
    
    // 方法
    + init(): Promise<void>
    + resize(width: number, height: number): void
    + clear(): void
    + render(deltaTime: number): void
    + start(): void
    + stop(): void
    + dispose(): void
}
```

#### 3.2.2 CanvasRenderer
```javascript
class CanvasRenderer extends CoreRenderer {
    // 属性
    - layers: Map<string, RenderLayer>
    - particles: Particle[]
    - effects: Effect[]
    
    // 方法
    + createLayer(name: string, options: LayerOptions): RenderLayer
    + removeLayer(name: string): void
    + getLayer(name: string): RenderLayer
    + addParticle(particle: Particle): void
    + addEffect(effect: Effect): void
    + renderMatrixRain(): void
    + renderNetworkMap(): void
    + renderParticles(): void
}
```

#### 3.2.3 RenderLayer
```javascript
class RenderLayer {
    // 属性
    - name: string
    - canvas: HTMLCanvasElement
    - ctx: CanvasRenderingContext2D
    - zIndex: number
    - opacity: number
    - visible: boolean
    
    // 方法
    + clear(): void
    + setOpacity(opacity: number): void
    + show(): void
    + hide(): void
    + toFront(): void
    + toBack(): void
}
```

#### 3.2.4 AnimationSystem
```javascript
class AnimationSystem {
    // 属性
    - animations: Map<string, Animation>
    - time: number
    
    // 方法
    + createAnimation(name: string, config: AnimationConfig): Animation
    + play(name: string): void
    + pause(name: string): void
    + stop(name: string): void
    + update(deltaTime: number): void
}
```

#### 3.2.5 EffectSystem
```javascript
class EffectSystem {
    // 属性
    - effects: Map<string, Effect>
    - activeEffects: string[]
    
    // 方法
    + registerEffect(name: string, effect: Effect): void
    + enableEffect(name: string): void
    + disableEffect(name: string): void
    + applyEffects(): void
    + addGlitch(duration: number): void
    + addScanline(): void
    + addCRTEffect(): void
}
```

### 3.3 数据流

```
用户输入/系统事件
    ↓
EventBus (事件总线)
    ↓
Renderer (接收事件)
    ↓
AnimationSystem (更新动画状态)
    ↓
EffectSystem (应用特效)
    ↓
CoreRenderer.render() (渲染到 Canvas/DOM)
    ↓
PerformanceMonitor (监控性能)
    ↓
显示设备
```

---

## 4. 接口定义

### 4.1 公开 API

#### 4.1.1 初始化与配置
```javascript
/**
 * 初始化渲染器
 * @param {RendererOptions} options - 配置选项
 * @returns {Promise<Renderer>}
 */
function init(options = {});

/**
 * 配置渲染器
 * @param {RendererConfig} config - 配置对象
 */
function configure(config);

/**
 * 销毁渲染器
 */
function dispose();
```

#### 4.1.2 渲染控制
```javascript
/**
 * 开始渲染循环
 */
function start();

/**
 * 停止渲染循环
 */
function stop();

/**
 * 清除所有渲染内容
 * @param {boolean} allLayers - 是否清除所有层
 */
function clear(allLayers = false);

/**
 * 调整渲染尺寸
 * @param {number} width - 宽度
 * @param {number} height - 高度
 */
function resize(width, height);
```

#### 4.1.3 层管理
```javascript
/**
 * 创建渲染层
 * @param {string} name - 层名称
 * @param {LayerOptions} options - 层选项
 * @returns {RenderLayer}
 */
function createLayer(name, options);

/**
 * 获取渲染层
 * @param {string} name - 层名称
 * @returns {RenderLayer}
 */
function getLayer(name);

/**
 * 移除渲染层
 * @param {string} name - 层名称
 */
function removeLayer(name);
```

#### 4.1.4 特效控制
```javascript
/**
 * 启用特效
 * @param {string} effectName - 特效名称
 * @param {Object} options - 特效选项
 */
function enableEffect(effectName, options);

/**
 * 禁用特效
 * @param {string} effectName - 特效名称
 */
function disableEffect(effectName);

/**
 * 触发故障效果
 * @param {number} duration - 持续时间 (ms)
 */
function triggerGlitch(duration);

/**
 * 触发矩阵雨效果
 * @param {number} duration - 持续时间 (ms)
 */
function triggerMatrixRain(duration);
```

#### 4.1.5 文本渲染
```javascript
/**
 * 渲染文本到终端
 * @param {string} text - 文本内容
 * @param {TextOptions} options - 文本选项
 * @param {string} type - 日志类型
 */
function renderText(text, options, type);

/**
 * 清除终端日志
 */
function clearTerminal();

/**
 * 滚动到终端底部
 */
function scrollToBottom();
```

### 4.2 事件接口

```javascript
// 渲染器事件
renderer.on('renderer:initialized', callback);
renderer.on('renderer:started', callback);
renderer.on('renderer:stopped', callback);
renderer.on('renderer:resized', callback);

// 性能事件
renderer.on('performance:low', callback);
renderer.on('performance:critical', callback);

// 错误事件
renderer.on('renderer:error', callback);
```

---

## 5. 数据结构

### 5.1 配置对象

```javascript
/**
 * 渲染器配置
 * @typedef {Object} RendererOptions
 * @property {string} mode - 渲染模式 (canvas|dom|webgl)
 * @property {boolean} enableHardwareAcceleration - 启用硬件加速
 * @property {number} targetFPS - 目标帧率
 * @property {boolean} enableEffects - 启用特效
 * @property {boolean} enableParticles - 启用粒子系统
 * @property {Object} quality - 质量设置
 * @property {string} quality.level - 质量级别 (low|medium|high|ultra)
 * @property {boolean} performanceMonitor - 启用性能监控
 */

/**
 * 层配置
 * @typedef {Object} LayerOptions
 * @property {number} zIndex - Z 轴顺序
 * @property {number} opacity - 透明度 (0-1)
 * @property {boolean} visible - 是否可见
 * @property {string} blendMode - 混合模式
 */

/**
 * 文本配置
 * @typedef {Object} TextOptions
 * @property {string} color - 颜色
 * @property {string} fontFamily - 字体
 * @property {number} fontSize - 字号
 * @property {boolean} typewriter - 打字机效果
 * @property {number} typingSpeed - 打字速度 (ms/字符)
 */
```

### 5.2 常量定义

```javascript
const RenderMode = {
    CANVAS: 'canvas',
    DOM: 'dom',
    WEBGL: 'webgl'
};

const QualityLevel = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    ULTRA: 'ultra'
};

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
```

---

## 6. 异常处理

### 6.1 错误类型

```javascript
class RendererError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'RendererError';
        this.code = code;
    }
}

const ErrorCodes = {
    INIT_FAILED: 'RENDERER_001',
    CONTEXT_LOST: 'RENDERER_002',
    LAYER_NOT_FOUND: 'RENDERER_003',
    EFFECT_FAILED: 'RENDERER_004',
    PERFORMANCE_CRITICAL: 'RENDERER_005'
};
```

### 6.2 错误处理策略

1. **初始化失败**: 尝试降级渲染模式，记录错误日志
2. **上下文丢失**: 自动重新初始化，恢复渲染状态
3. **性能临界**: 自动降低质量级别，发送警告事件
4. **特效失败**: 禁用该特效，继续渲染其他内容

---

## 7. 测试策略

### 7.1 单元测试

- 测试渲染器初始化
- 测试层管理功能
- 测试动画系统
- 测试特效系统
- 测试文本渲染
- 测试性能监控

### 7.2 集成测试

- 测试与 EventBus 的集成
- 测试与 ConfigManager 的集成
- 测试与 StorageAdapter 的集成

### 7.3 性能测试

- 测试不同质量级别的 FPS
- 测试内存占用
- 测试加载时间
- 测试长时间运行稳定性

---

## 8. 依赖关系

### 8.1 内部依赖

- EventBus (核心层)
- ConfigManager (核心层)
- Container (核心层)

### 8.2 外部依赖

- 无（纯原生 JavaScript 实现）

---

## 9. 性能优化

### 9.1 渲染优化

1. **对象池**: 复用粒子、动画对象，减少 GC
2. **批处理**: 合并绘制调用，减少 Canvas API 调用次数
3. **脏矩形**: 只重绘变化区域
4. **LOD**: 根据距离和重要性调整细节级别

### 9.2 内存优化

1. **纹理压缩**: 使用压缩纹理格式
2. **资源卸载**: 自动卸载不可见资源
3. **弱引用**: 使用 WeakMap 管理临时对象

### 9.3 自适应降级

1. **性能检测**: 实时监控 FPS 和帧时间
2. **动态调整**: 自动降低粒子数量、特效质量
3. **设备分级**: 根据设备能力预设质量级别

---

## 10. 文档与示例

### 10.1 使用示例

```javascript
// 初始化渲染器
const renderer = await Renderer.init({
    mode: 'canvas',
    quality: { level: 'high' }
});

// 创建层
const bgLayer = renderer.createLayer('background', {
    zIndex: 0,
    opacity: 1.0
});

const fgLayer = renderer.createLayer('foreground', {
    zIndex: 10,
    opacity: 0.8
});

// 启用特效
renderer.enableEffect('matrixRain', { duration: 5000 });
renderer.enableEffect('scanlines', { intensity: 0.5 });

// 渲染文本
renderer.renderText('系统初始化...', {
    color: '#00ff00',
    typewriter: true
}, 'info');

// 开始渲染
renderer.start();
```

### 10.2 API 文档

完整的 API 文档将在实现完成后生成。

---

## 11. 版本历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0.0 | 2026-03-07 | 重构团队 | 初始版本 |

---

## 12. 审批记录

| 角色 | 姓名 | 日期 | 状态 |
|------|------|------|------|
| 架构师 | - | - | 待审批 |
| 开发负责人 | - | - | 待审批 |
| 测试负责人 | - | - | 待审批 |
