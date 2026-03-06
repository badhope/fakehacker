# Visual Effects Lab - 特效实验室

🎨 **纯粹、极简、模块化的代码生成视觉特效展示平台**

---

## 🌟 项目特性

- ✨ **零依赖** - 纯原生 JavaScript，无任何第三方库
- 🎨 **极简主义** - 去除所有装饰性元素，专注特效本身
- 🔧 **模块化架构** - 每个特效都是独立的可插拔模块
- 📐 **数学美学** - 基于数学公式和算法生成视觉效果

---

## 🎯 特效分类

### ⟷ 横向排列特效
- **Wave Flow** - 正弦波流动
- **Particle Stream** - 粒子流

### ⟳ 纵向排列特效
- **Rain Drop** - 雨滴下落

### ⤡ 斜向排列特效
- **Diagonal Slash** - 斜线切割

### ⟳ 动态变化特效
- **Pulse Wave** - 脉冲波

---

## 🚀 快速开始

### 方式一：直接打开
```
双击打开 index.html
```

### 方式二：本地服务器
```bash
python -m http.server 8080
# 访问 http://localhost:8080/
```

---

## 🎮 操作指南

| 按键 | 功能 |
|------|------|
| `←` / `→` | 切换上一个/下一个特效 |
| `Space` | 暂停/继续 |
| `F` | 全屏切换 |
| `R` | 重置参数 |
| `H` | 显示/隐藏帮助 |
| `ESC` | 关闭帮助/退出全屏 |
| 双击 Canvas | 全屏切换 |
| 点击特效列表 | 选择特效 |

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────┐
│     Presentation Layer (展示层)      │
│   - index.html                      │
│   - UI 控制面板                      │
├─────────────────────────────────────┤
│     Core Engine Layer (引擎层)       │
│   - Engine.js (特效引擎)            │
│   - Utils.js (工具函数)             │
│   - BaseEffect.js (基类)            │
├─────────────────────────────────────┤
│     Effects Layer (特效层)           │
│   - horizontal/ (横向)              │
│   - vertical/ (纵向)                │
│   - diagonal/ (斜向)                │
│   - dynamic/ (动态)                 │
└─────────────────────────────────────┘
```

---

## � 目录结构

```
visualeffects/
├── index.html              # 主界面
├── js/
│   ├── core/
│   │   ├── Engine.js      # 特效引擎核心
│   │   ├── Utils.js       # 工具函数
│   │   └── BaseEffect.js  # 特效基类
│   └── effects/
│       ├── horizontal/    # 横向排列特效
│       ├── vertical/      # 纵向排列特效
│       ├── diagonal/      # 斜向排列特效
│       └── dynamic/       # 动态变化特效
└── README.md              # 项目文档
```

---

## 💡 开发指南

### 添加新特效

1. 继承 `BaseEffect` 类
2. 实现 `init()`, `update()`, `render()` 方法
3. 在 HTML 中引入脚本
4. 在引擎中注册

```javascript
class MyEffect extends BaseEffect {
    get defaultParams() {
        return {
            speed: 100,
            color: 200
        };
    }

    async init() {
        // 初始化逻辑
    }

    update(deltaTime) {
        // 更新逻辑
    }

    render(ctx) {
        // 渲染逻辑
    }
}
```

---

## 🔧 技术特性

### 核心引擎
- **EffectEngine**: 统一管理所有特效
- **Renderer**: Canvas 2D 渲染
- **AnimationSystem**: requestAnimationFrame 驱动，60fps

### 性能优化
- 对象池模式 - 减少 GC
- 离屏渲染 - 提升性能
- 层级裁剪 - 只渲染可见区域

### 特效接口
```javascript
class BaseEffect {
    init()           // 初始化
    update(deltaTime) // 更新状态
    render(ctx)      // 渲染到 Canvas
    destroy()        // 清理资源
}
```

---

## 📊 项目统计

| 项目 | 数量 |
|------|------|
| 特效总数 | 5 |
| 特效分类 | 4 |
| 代码行数 | ~1,500 |
| 文件大小 | ~50KB |
| 依赖库 | 0 |

---

## � 设计原则

1. **纯粹性** - 不依赖任何外部库
2. **极简性** - 界面简洁，专注内容
3. **模块化** - 易于扩展和维护
4. **数学美** - 基于算法生成

---

## 🔮 未来计划

- [ ] 添加更多横向特效（TextScroll, ColorBand）
- [ ] 添加更多纵向特效（CascadeFlow, FallingStars）
- [ ] 添加更多斜向特效（AngularMotion, RotationalFlow）
- [ ] 添加更多动态特效（BreathingLight, MorphingShape）
- [ ] 实现特效组合功能
- [ ] 添加参数预设保存
- [ ] 实现特效录制和回放

---

## � 许可证

MIT License

---

## � 致谢

感谢所有为这个项目做出贡献的开发者！

---

**� 享受代码生成的视觉特效！**
