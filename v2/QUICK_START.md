# 🚀 Visual Effects Lab v2.0 - 快速启动指南

## ⚡ 5 分钟快速开始

### 前置要求

确保你的系统已安装：
- ✅ Node.js 18+ ([下载地址](https://nodejs.org/))
- ✅ npm 或 yarn
- ✅ Git（可选，用于版本管理）

### 步骤 1：安装依赖

打开终端，进入 v2 目录：

```bash
cd c:\Users\X1882\Desktop\ppp\fakehacker\v2
```

安装所有依赖：

```bash
npm install
```

**预计时间**: 1-3 分钟（取决于网络速度）

> 💡 **提示**: 如果下载速度慢，可以使用国内镜像：
> ```bash
> npm config set registry https://registry.npmmirror.com
> npm install
> ```

### 步骤 2：启动开发服务器

```bash
npm run dev
```

你会看到类似输出：

```
  VITE v7.3.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 步骤 3：访问应用

打开浏览器，访问：**http://localhost:5173/**

🎉 **恭喜！你已经成功启动项目！**

---

## 📝 常用命令

### 开发

```bash
# 启动开发服务器（热更新）
npm run dev

# 启动并指定端口
npm run dev -- --port 3000
```

### 构建

```bash
# 生产环境构建
npm run build

# 预览生产构建
npm run preview
```

### 测试

```bash
# 运行所有测试
npm run test

# 监听模式（实时测试）
npm run test -- --watch

# 生成覆盖率报告
npm run test:coverage
```

### 代码质量

```bash
# ESLint 检查
npm run lint

# 格式化代码
npm run format
```

---

## 🎯 下一步做什么？

### 1. 查看项目结构

```
v2/
├── src/
│   ├── components/      # React 组件
│   │   ├── Header.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── StatusBar.tsx
│   │   └── Toast.tsx
│   ├── core/           # 核心引擎
│   │   └── EffectEngine.ts
│   ├── store/          # 状态管理
│   │   └── index.ts
│   ├── types/          # 类型定义
│   │   └── index.ts
│   └── App.tsx         # 主应用
└── ...
```

### 2. 修改代码试试

打开 `src/components/Header.tsx`，修改标题：

```tsx
<h1 className="...">
  我的特效实验室  // 改成你喜欢的名字
</h1>
```

保存后，浏览器会自动刷新，看到变化！

### 3. 查看特效

点击左侧控制面板的特效列表，切换不同的特效。

### 4. 查看控制台

打开浏览器开发者工具（F12），查看：
- 日志输出
- 性能指标
- 错误信息

---

## 🔧 常见问题

### Q1: 安装依赖失败

**错误**: `npm ERR! network timeout`

**解决**:
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install
```

### Q2: 端口被占用

**错误**: `Port 5173 is in use`

**解决**:
```bash
# 使用其他端口
npm run dev -- --port 3000
```

### Q3: TypeScript 报错

**错误**: `Cannot find module 'react'`

**解决**:
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### Q4: 浏览器兼容性

确保使用现代浏览器：
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📚 学习资源

### 快速上手

- [React 30 分钟教程](https://react.dev/learn/tutorial-tic-tac-toe)
- [TypeScript 5 分钟入门](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Vite 指南](https://cn.vitejs.dev/guide/)

### 深入理解

- [React 官方文档](https://zh-hans.react.dev/)
- [TypeScript 深度指南](https://basarat.gitbook.io/typescript/)
- [TailwindCSS 实战](https://tailwindcss.com/docs)

---

## 🎨 自定义配置

### 修改主题颜色

编辑 `src/index.css`：

```css
:root {
  --primary-cyan: #00ffff;      /* 改成你喜欢的颜色 */
  --primary-green: #00ff00;
  /* ... */
}
```

### 添加新特效

1. 在 `src/effects/` 创建新文件：

```typescript
// src/effects/MyEffect.ts
import type { IEffect, EffectParams } from '../types';

export class MyEffect implements IEffect {
  name = 'MyEffect';
  // ... 实现接口方法
}
```

2. 在 `App.tsx` 注册：

```typescript
import { MyEffect } from './effects/MyEffect';

engineRef.current.registerEffect('MyEffect', MyEffect);
```

### 修改组件样式

使用 TailwindCSS 类名：

```tsx
<div className="text-red-500 bg-blue-100 p-4 rounded">
  我的内容
</div>
```

[TailwindCSS 完整文档](https://tailwindcss.com/docs)

---

## 🐛 调试技巧

### 1. 查看性能

打开 Chrome DevTools -> Performance，录制分析性能。

### 2. 调试 TypeScript

在 VS Code 中：
- F9: 切换断点
- F5: 开始调试
- F10: 单步执行

### 3. 查看状态

在浏览器控制台：

```javascript
// 查看当前状态
window.__ZUSTAND_STORE__ = useAppStore.getState();
console.log(window.__ZUSTAND_STORE__);
```

---

## 📞 获取帮助

### 遇到问题？

1. **查看文档**: [README.md](README.md)
2. **查看示例**: `src/core/EffectEngine.test.ts`
3. **提 Issue**: GitHub Issues
4. **发邮件**: x18825407105@outlook.com

### 有用的链接

- 📖 [完整文档](README.md)
- 🎨 [特效示例](../js/effects/)
- 🔧 [配置指南](https://vitejs.dev/config/)
- 📊 [性能优化](https://web.dev/vitals/)

---

## ✅ 检查清单

完成以下任务，确保你理解了项目：

- [ ] 成功安装依赖
- [ ] 成功启动开发服务器
- [ ] 能够访问应用
- [ ] 能够切换特效
- [ ] 查看控制台输出
- [ ] 修改代码并看到效果
- [ ] 运行测试
- [ ] 查看项目结构

全部完成后，你就可以开始开发自己的特效了！🎉

---

**最后更新**: 2026-03-08  
**版本**: v2.0.0  
**状态**: ✅ 可以运行

🎊 **祝你开发愉快！** 🎊
