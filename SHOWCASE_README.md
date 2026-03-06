# 效果展示平台 (Effect Showcase Platform)

🎨 **一个专注于展示各类操作及其动态变化效果的交互式网站**

---

## 🌟 项目特性

### 核心特性

1. **直观的按钮交互系统**
   - 所有功能按钮直接展示在界面上
   - 点击按钮即可触发不同类型的视觉效果
   - 支持快捷键操作
   - 实时视觉反馈

2. **多样化的效果库**
   - **矩阵效果**：经典黑客字符雨
   - **网络拓扑**：动态节点连接动画
   - **粒子系统**：爆炸、扩散等粒子效果
   - **故障艺术**：屏幕抖动和色彩分离
   - **扫描线**：CRT 显示器效果
   - **波浪脉冲**：正弦波和脉冲扩散
   - **文本效果**：打字机动画
   - **代码雨**：编程语言代码下落

3. **强大的组合系统**
   - 支持多个效果组合播放
   - 预定义 8 个精美效果组合
   - 可视化组合编辑器
   - 支持循环播放和同步控制

4. **代码输入交互**
   - 支持直接输入代码指令
   - 实时执行并查看效果
   - 命令历史记录
   - 支持 Ctrl+Enter 快速执行

5. **硬核科幻视觉风格**
   - 动态网格背景
   - 扫描线动画
   - 霓虹发光效果
   - 渐变色彩系统
   - 流畅的交互动画

---

## 🚀 快速开始

### 方式一：直接打开

1. 在浏览器中打开 `index-showcase.html`
2. 等待页面加载完成
3. 点击按钮或组合卡片开始体验

### 方式二：使用本地服务器

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (需要安装 http-server)
npx http-server
```

然后访问 `http://localhost:8000/index-showcase.html`

---

## 📖 使用指南

### 单个效果播放

**方式 1：点击按钮**
- 在"单个效果"区域找到想要的效果
- 点击按钮即可播放

**方式 2：代码输入**
```javascript
play('matrix_rain')
play('particle_explosion', { particleCount: 200 })
```

### 效果组合播放

**方式 1：点击卡片**
- 在"效果组合"区域找到组合
- 点击卡片即可播放整个序列

**方式 2：代码输入**
```javascript
combo('cyber_attack')
combo('system_boot')
```

### 控制命令

```javascript
// 播放效果
play('effect_id')
play('effect_id', { param1: value1, param2: value2 })

// 播放组合
combo('combo_id')

// 停止单个效果
stop('effect_id')

// 停止所有效果
stopAll()
```

### 快捷键

- **ESC**: 停止所有效果
- **Ctrl+Enter**: 执行代码（在代码输入框中）

---

## 🎯 预定义效果组合

### 1. 赛博攻击 (cyber_attack)
模拟赛博攻击的视觉效果组合
- 红色闪屏 → 故障效果 → 红色矩阵雨 → 粒子爆炸 → 扫描线

### 2. 系统启动 (system_boot)
模拟系统启动的动画序列
- 白屏闪烁 → 打字机文本 → 代码雨 → 网络拓扑 → 脉冲扩散

### 3. 矩阵之舞 (matrix_dance)
矩阵效果的华丽组合（循环播放）
- 绿色矩阵 → 青色矩阵 → 蓝色矩阵 → 故障效果 → 波浪动画

### 4. 粒子交响曲 (particle_symphony)
粒子效果的华丽展示
- 红色爆炸 → 绿色爆炸 → 蓝色爆炸 → 黄色爆炸 → 涟漪效果

### 5. 故障风暴 (glitch_storm)
强烈的故障效果组合
- 连续故障效果 → 白屏闪烁 → 屏幕扭曲

### 6. 霓虹之夜 (neon_nights)
霓虹色彩的视觉盛宴（循环播放）
- 粉色波浪 → 青色波浪 → 粉色脉冲 → 青色脉冲 → 网络拓扑

### 7. 代码风暴 (code_storm)
代码相关的效果组合
- JavaScript 代码雨 → Python 代码雨 → C++ 代码雨 → 打字机文本 → 故障效果

---

## 🛠️ 技术架构

### 核心模块

```
js/showcase/
├── ShowcaseEngine.js      # 展示引擎核心
├── EffectRegistry.js      # 效果注册表
├── ComboGenerator.js      # 组合生成器
├── ButtonSystem.js        # 按钮交互系统
├── CodeInput.js           # 代码输入系统
└── ShowcaseApp.js         # 应用主控制器
```

### 架构图

```
┌─────────────────────────────────────┐
│         ShowcaseApp (主控制器)       │
├─────────────────────────────────────┤
│  ShowcaseEngine  │  ComboGenerator  │
│  (展示引擎)       │  (组合生成器)     │
├─────────────────────────────────────┤
│  EffectRegistry  │  ButtonSystem    │
│  (效果注册表)     │  (按钮系统)       │
├─────────────────────────────────────┤
│  CodeInput       │  ShowcaseUI      │
│  (代码输入)       │  (UI 管理器)       │
└─────────────────────────────────────┘
```

### 效果分类

- **matrix**: 矩阵类效果
- **network**: 网络拓扑效果
- **particle**: 粒子系统效果
- **glitch**: 故障艺术效果
- **overlay**: 覆盖层效果
- **flash**: 闪烁效果
- **text**: 文本效果
- **code**: 代码效果
- **wave**: 波浪效果
- **pulse**: 脉冲效果
- **ripple**: 涟漪效果
- **distortion**: 扭曲效果

---

## 💻 开发指南

### 添加新效果

1. 在 `EffectRegistry.js` 中注册效果：

```javascript
registerEffect('my_effect', {
    name: '我的效果',
    category: 'particle',
    description: '这是一个新效果',
    duration: 5000,
    tags: ['粒子', '爆炸'],
    defaultParams: {
        color: '#ff0000',
        count: 100
    },
    params: {
        color: { type: 'color', label: '颜色', default: '#ff0000' },
        count: { type: 'range', label: '数量', min: 10, max: 500, default: 100 }
    },
    play: async (params) => {
        // 实现效果逻辑
        return { /* 返回值 */ };
    },
    stop: () => {
        // 清理逻辑
    }
});
```

### 添加新组合

1. 在 `ComboGenerator.js` 中注册组合：

```javascript
registerCombo('my_combo', {
    name: '我的组合',
    description: '这是一个新组合',
    steps: [
        { id: 'matrix_rain', delay: 0, params: { color: '#ff0000' } },
        { id: 'particle_explosion', delay: 1000, params: { particleCount: 200 } },
        { id: 'glitch', delay: 2000, params: { intensity: 30 } }
    ],
    sync: false,
    loop: false
});
```

---

## 🎨 自定义主题

### 修改配色方案

在 CSS 中修改根变量：

```css
:root {
    --primary-color: #00ffff;      /* 主色调 */
    --secondary-color: #ff00ff;    /* 辅助色 */
    --accent-color: #00ff00;       /* 强调色 */
    --bg-color: #000000;           /* 背景色 */
}
```

---

## 📊 性能优化

### 自动优化特性

- **Canvas 自动清理**: 效果结束后自动清理 Canvas
- **对象池**: 粒子系统使用对象池减少 GC
- **批处理**: DOM 操作批量执行
- **事件委托**: 使用事件委托减少监听器数量
- **防抖节流**: 频繁操作使用防抖节流

### 性能监控

页面右下角实时显示 FPS，确保流畅体验。

---

## 🔧 故障排除

### 常见问题

**Q: 效果不显示？**
A: 检查浏览器控制台是否有错误，确保 JavaScript 已启用。

**Q: 动画卡顿？**
A: 减少同时播放的效果数量，或降低效果参数。

**Q: 代码执行报错？**
A: 检查代码语法，确保使用正确的命令格式。

---

## 📝 更新日志

### v1.0.0 (2026-03-07)

**新增功能**
- ✨ 展示平台核心架构
- ✨ 12 种基础视觉效果
- ✨ 8 个预定义效果组合
- ✨ 按钮交互系统
- ✨ 代码输入系统
- ✨ 硬核科幻视觉风格
- ✨ 动态背景动画
- ✨ 实时性能监控

**技术特性**
- 🔧 模块化架构设计
- 🔧 事件驱动通信
- 🔧 完全响应式布局
- 🔧 零外部依赖

---

## 🎯 未来计划

- [ ] 更多视觉效果（30+）
- [ ] 可视化组合编辑器
- [ ] 效果参数实时调节
- [ ] 效果录制与回放
- [ ] 自定义效果上传分享
- [ ] 移动端优化
- [ ] VR/AR 支持

---

## 📄 许可证

MIT License

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**🎮 享受视觉效果带来的震撼体验！**
