# 🚀 快速启动指南

## 立即体验

### 方式一：直接打开（推荐）

1. 找到文件 `index-showcase.html`
2. 双击打开（使用 Chrome、Edge 或 Firefox 浏览器）
3. 开始体验！

### 方式二：本地服务器

**使用 Python:**
```bash
# 进入项目目录
cd c:\Users\X1882\Desktop\ppp\fakehacker

# 启动服务器
python -m http.server 8080

# 浏览器访问
http://localhost:8080/index-showcase.html
```

**使用 Node.js:**
```bash
# 安装 http-server (首次需要)
npm install -g http-server

# 启动服务器
npx http-server -p 8080

# 浏览器访问
http://localhost:8080/index-showcase.html
```

---

## � 快速上手

### 第一次使用

1. **打开页面** - 访问 `index-showcase.html`
2. **查看统计** - 顶部显示效果数量、组合数量等信息
3. **点击按钮** - 在"单个效果"区域点击任意按钮
4. **观看效果** - 享受视觉特效！

### 播放效果

**方法 1: 点击按钮**
```
点击任意效果按钮 → 效果立即播放
```

**方法 2: 代码输入**
```
1. 在右下角代码框输入：play('matrix_rain')
2. 按 Ctrl+Enter 或点击"执行"按钮
3. 效果开始播放
```

**方法 3: 播放组合**
```
点击"效果组合"卡片 或 输入：combo('cyber_attack')
```

### 停止效果

- **按 ESC 键** - 停止所有效果（推荐）
- **代码输入**: `stopAll()`

---

## � 推荐体验路径

### 新手路径

1. ✅ 点击 `矩阵雨` 按钮 - 体验经典黑客效果
2. ✅ 点击 `粒子爆炸` 按钮 - 观看粒子特效
3. ✅ 点击 `赛博攻击` 卡片 - 体验效果组合
4. ✅ 按 ESC 停止 - 学习如何停止

### 进阶路径

1. 🔥 尝试不同效果组合
2. 🔥 使用代码输入播放效果
3. 🔥 调整效果参数
4. 🔥 创建自己的组合序列

### 专家路径

1. 💻 编写代码序列
2. 💻 组合多个效果
3. 💻 自定义参数
4. 💻 创建复杂动画

---

## 💡 常用命令

```javascript
// 播放单个效果
play('matrix_rain')
play('particle_explosion', { particleCount: 200, colors: ['#ff0000', '#ffff00'] })

// 播放组合
combo('cyber_attack')
combo('system_boot')

// 停止效果
stop('matrix_rain')
stopAll()

// 更多效果
play('network_topology', { nodeCount: 100, color: '#00ffff' })
play('glitch', { intensity: 30, duration: 2000 })
play('wave', { color: '#ff00ff', amplitude: 80 })
```

---

## 🎨 效果分类

### 矩阵类 (Matrix)
- `matrix_rain` - 经典字符雨

### 网络类 (Network)
- `network_topology` - 动态节点连接

### 粒子类 (Particle)
- `particle_explosion` - 爆炸效果

### 故障类 (Glitch)
- `glitch` - 屏幕抖动
- `scanlines` - 扫描线

### 文本类 (Text)
- `typewriter` - 打字机效果
- `code_rain` - 代码雨

### 动画类 (Animation)
- `wave` - 波浪
- `pulse` - 脉冲
- `ripple` - 涟漪

---

## ⚡ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `ESC` | 停止所有效果 |
| `Ctrl+Enter` | 执行代码（在代码框中） |
| `点击按钮` | 播放对应效果 |

---

## 🐛 遇到问题？

### 效果不显示
- ✅ 检查浏览器控制台（F12）是否有错误
- ✅ 确保 JavaScript 已启用
- ✅ 刷新页面重试

### 动画卡顿
- ✅ 减少同时播放的效果数量
- ✅ 降低效果参数（如粒子数量）
- ✅ 关闭其他浏览器标签页

### 代码执行报错
- ✅ 检查命令格式是否正确
- ✅ 确保效果 ID 存在
- ✅ 查看参数格式是否符合要求

---

## � 更多资源

- **完整文档**: 查看 `SHOWCASE_README.md`
- **重构总结**: 查看 `REFACTOR_SUMMARY.md`
- **快速测试**: 打开 `test-showcase.html`

---

## 🎉 开始体验吧！

**现在，打开 `index-showcase.html` 开始你的视觉效果之旅！**

有任何问题或建议，欢迎反馈！
