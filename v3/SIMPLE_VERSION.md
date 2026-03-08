# v3.0 简单版说明

## 为什么要创建 v3.0？

之前的 v2.0 使用了 React + TypeScript + Vite + TailwindCSS，虽然功能强大但：
- ❌ 配置复杂，需要 Node.js 和 npm
- ❌ 需要构建步骤才能运行
- ❌ GitHub Pages 部署路径配置容易出错
- ❌ 移动端适配问题多

**v3.0 回归最简单的方式**：
- ✅ 只有一个 HTML 文件
- ✅ 不需要任何构建工具
- ✅ 双击即可运行
- ✅ 部署超级简单

## 📁 项目结构

```
fakehacker/
├── v3/                    # 简单版（推荐使用）
│   └── index.html        # 唯一的文件
├── v2/                   # React 版（复杂，不推荐）
│   └── src/...
├── .github/
│   └── workflows/
│       ├── deploy-v3.yml # v3 自动部署
│       └── deploy.yml    # v2 自动部署
└── README.md
```

## 🚀 使用 v3.0

### 本地运行
```bash
# 方法 1：直接打开
双击 v3/index.html

# 方法 2：本地服务器
cd v3
python -m http.server 8000
# 访问 http://localhost:8000
```

### GitHub Pages
访问：https://badhope.github.io/fakehacker/v3/

## 🎮 功能

### 4 种特效
1. **粒子流动** - 彩色粒子随机移动
2. **波浪效果** - 5 条彩色正弦波
3. **星空闪烁** - 200 颗闪烁的星星
4. **矩阵雨** - 黑客帝国风格字符雨

### 控制选项
- 特效选择器
- 速度滑块 (1-100%)
- 数量滑块 (10-500)
- 暂停/继续按钮
- 重置按钮
- 全屏按钮

### 快捷键
- 空格：暂停/继续
- F：全屏
- 双击 Canvas：切换特效

## 📊 对比

| 特性 | v1.0 (原生) | v2.0 (React) | v3.0 (简单) |
|------|------------|--------------|-------------|
| 文件大小 | ~500KB | ~2MB | ~15KB |
| 依赖 | 无 | React+TS+Vite | 无 |
| 构建 | 不需要 | 需要 | 不需要 |
| 启动速度 | 快 | 慢 | 极快 |
| 易用性 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 移动端 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 推荐使用场景

### 使用 v3.0（简单版）
- ✅ 快速展示特效
- ✅ 教学演示
- ✅ 移动端使用
- ✅ 不想安装任何依赖

### 使用 v2.0（React 版）
- ✅ 需要复杂功能
- ✅ 需要 TypeScript 类型检查
- ✅ 大型项目开发
- ✅ 需要组件化开发

## 🔧 部署

### 自动部署
v3 目录的更改会自动触发 GitHub Actions 部署到：
```
https://badhope.github.io/fakehacker/v3/
```

### 手动部署
```bash
# 1. 提交更改
git add v3/
git commit -m "update v3"
git push origin main

# 2. 等待 GitHub Actions 自动部署（约 1 分钟）
```

## 📝 代码说明

### HTML 结构
```html
<canvas id="canvas"></canvas>          <!-- 画布 -->
<div class="controls">...</div>        <!-- 控制面板 -->
<div class="fps-counter">...</div>     <!-- FPS 计数器 -->
<div class="info">...</div>            <!-- 信息面板 -->
```

### JavaScript 结构
```javascript
// 1. 基础设置
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 2. 状态管理
const state = { currentEffect, speed, count, paused, fps };

// 3. 特效类
class Particle { ... }  // 粒子
class Wave { ... }      // 波浪
class Star { ... }      // 星星
class MatrixChar { ... }// 矩阵字符

// 4. 动画循环
function animate() {
    requestAnimationFrame(animate);
}
```

## 🎨 自定义

### 添加新特效
1. 创建新类：
```javascript
class MyEffect {
    constructor() { ... }
    update() { ... }
    draw() { ... }
}
```

2. 添加到 `drawEffects` 函数：
```javascript
case 'myeffect':
    myEffects.forEach(e => e.draw());
    break;
```

3. 添加到 HTML 选择器：
```html
<option value="myeffect">我的特效</option>
```

### 修改颜色
在 CSS 中修改：
```css
.controls {
    border-color: #ff0000;  /* 红色边框 */
    color: #ff0000;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}
```

## 🐛 已知问题

暂无

## 💡 提示

1. **性能优化**：减少粒子数量可以提高 FPS
2. **移动端**：建议使用竖屏模式
3. **全屏**：按 ESC 可以退出全屏
4. **截图**：按 F12 打开开发者工具，使用截图功能

## 📞 反馈

有问题请提交 Issue：https://github.com/badhope/fakehacker/issues

---

**版本**: v3.0.0  
**日期**: 2026-03-08  
**状态**: ✅ 完成
