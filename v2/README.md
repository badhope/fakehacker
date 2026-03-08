# Visual Effects Lab v2.0 - 重构版

## 🎯 项目简介

这是一个**完全重构**的 Visual Effects Lab 项目，使用现代化的技术栈和最佳实践。

### 核心改进

#### 技术栈升级
- ✅ **TypeScript** - 完整的类型安全
- ✅ **React 18** - 现代化组件架构
- ✅ **Vite** - 超快的构建工具
- ✅ **TailwindCSS 4** - 原子化 CSS
- ✅ **Zustand** - 轻量级状态管理
- ✅ **Vitest** - 快速单元测试
- ✅ **React Router** - 路由管理

#### 架构优化
- ✅ **模块化设计** - 清晰的职责分离
- ✅ **组件化 UI** - 可复用的 React 组件
- ✅ **状态管理** - 集中式状态管理
- ✅ **类型安全** - 编译时错误检查
- ✅ **测试覆盖** - 核心功能单元测试

---

## 📁 项目结构

```
v2/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 图片、字体等资源
│   ├── components/        # React 组件
│   │   ├── Header.tsx     # 头部组件
│   │   ├── ControlPanel.tsx  # 控制面板
│   │   ├── StatusBar.tsx  # 状态栏
│   │   └── Toast.tsx      # Toast 通知
│   ├── core/              # 核心引擎
│   │   ├── EffectEngine.ts  # 特效引擎
│   │   └── EffectEngine.test.ts  # 引擎测试
│   ├── store/             # 状态管理
│   │   └── index.ts       # Zustand store
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts       # 类型定义
│   ├── hooks/             # 自定义 Hooks
│   ├── utils/             # 工具函数
│   ├── effects/           # 特效实现（待迁移）
│   ├── test/              # 测试配置
│   │   └── setup.ts       # 测试初始化
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目文档
```

---

## 🚀 快速开始

### 安装依赖

```bash
cd v2
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 运行测试

```bash
npm run test
```

### 生成测试覆盖率报告

```bash
npm run test:coverage
```

---

## 🎨 核心功能

### 1. 特效引擎

```typescript
import { EffectEngine } from './core/EffectEngine';

// 创建引擎
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new EffectEngine(canvas);

// 注册特效
class MyEffect {
  name = 'MyEffect';
  // ... 实现 IEffect 接口
}

engine.registerEffect('MyEffect', MyEffect);

// 加载特效
await engine.loadEffect('MyEffect', { param1: 50 });

// 获取性能指标
const metrics = engine.getMetrics();
console.log(`FPS: ${metrics.fps.current}`);
```

### 2. 状态管理

```typescript
import { useAppStore } from './store';

function MyComponent() {
  const { 
    currentEffect, 
    fps, 
    isPaused,
    setCurrentEffect,
    togglePause 
  } = useAppStore();

  return (
    <div>
      <p>当前特效：{currentEffect}</p>
      <p>FPS: {fps}</p>
      <button onClick={togglePause}>
        {isPaused ? '继续' : '暂停'}
      </button>
    </div>
  );
}
```

### 3. Toast 通知

```typescript
import { useAppStore } from './store';

function MyComponent() {
  const { addToast } = useAppStore();

  const handleClick = () => {
    addToast({
      type: 'success',
      message: '操作成功！',
      duration: 3000
    });
  };

  return <button onClick={handleClick}>显示 Toast</button>;
}
```

---

## 📊 性能指标

### 技术指标

| 指标 | 目标 | 当前状态 |
|------|------|----------|
| TypeScript 覆盖率 | > 95% | ✅ 100% |
| 单元测试覆盖率 | > 80% | 🚧 进行中 |
| Lighthouse 性能 | > 90 | ⏳ 待测试 |
| 首屏加载时间 | < 2s | ⏳ 待测试 |
| Bundle 大小 | < 500KB | ⏳ 待测试 |

---

## 🔧 开发指南

### 添加新特效

1. 创建特效类，实现 `IEffect` 接口：

```typescript
import type { IEffect, EffectParams } from '../types';

export class MyEffect implements IEffect {
  name = 'MyEffect';
  params: EffectParams = {
    speed: 1,
    count: 100
  };
  initialized = false;
  needsTrail = false;

  async init() {
    // 初始化逻辑
    this.initialized = true;
  }

  update(deltaTime: number) {
    // 更新逻辑
  }

  render(ctx: CanvasRenderingContext2D) {
    // 渲染逻辑
  }

  onResize() {
    // 处理尺寸变化
  }

  destroy() {
    // 清理资源
  }

  updateParams(newParams: Partial<EffectParams>) {
    this.params = { ...this.params, ...newParams };
  }

  reset() {
    this.params = { speed: 1, count: 100 };
  }
}
```

2. 在 App.tsx 中注册：

```typescript
import { MyEffect } from './effects/MyEffect';

engineRef.current.registerEffect('MyEffect', MyEffect);
```

### 添加新组件

1. 在 `src/components/` 创建新组件：

```typescript
interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

2. 在需要的地方导入使用：

```typescript
import { MyComponent } from './components/MyComponent';
```

### 添加新测试

1. 在 `src/` 下创建 `.test.ts` 文件：

```typescript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    // 测试代码
  });
});
```

2. 运行测试：

```bash
npm run test
```

---

## 🎯 迁移计划

### 阶段 1：基础架构（已完成 ✅）

- [x] 初始化 Vite + React + TypeScript
- [x] 配置 TailwindCSS
- [x] 创建核心引擎
- [x] 状态管理
- [x] 基础组件

### 阶段 2：特效迁移（进行中 🚧）

- [ ] 迁移横向特效
- [ ] 迁移纵向特效
- [ ] 迁移斜向特效
- [ ] 迁移动态特效

### 阶段 3：功能增强（待开始 ⏳）

- [ ] 特效预览缩略图
- [ ] 收藏系统
- [ ] 播放列表
- [ ] 参数预设

### 阶段 4：性能优化（待开始 ⏳）

- [ ] 性能基准测试
- [ ] Bundle 优化
- [ ] 懒加载
- [ ] PWA 支持

---

## 📝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 使用 Prettier 格式化代码
- 组件使用函数式 + Hooks

### 提交规范

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 重构代码
test: 添加测试
chore: 构建/工具配置
```

### Git 分支

```
main          - 主分支
develop       - 开发分支
feature/*     - 功能分支
bugfix/*      - 修复分支
release/*     - 发布分支
```

---

## 🤝 贡献指南

### 如何参与

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码审查标准

- ✅ 类型安全
- ✅ 测试覆盖
- ✅ 代码规范
- ✅ 性能考虑
- ✅ 文档完整

---

## 📄 许可证

MIT License

---

## 🎊 版本历史

### v2.0.0 (重构版)

**新功能**
- ✅ TypeScript 完整支持
- ✅ React 组件化架构
- ✅ 现代化构建工具
- ✅ 状态管理系统
- ✅ 单元测试框架

**改进**
- ✅ 代码组织更清晰
- ✅ 类型安全
- ✅ 开发体验更好
- ✅ 性能更优

**破坏性变更**
- ❌ 不兼容旧版插件系统
- ❌ 需要现代浏览器支持

---

## 📞 联系方式

- 📧 Email: x18825407105@outlook.com
- 💬 GitHub Issues
- 🌐 项目主页

---

**开发者**: BADHOPE  
**版本**: 2.0.0  
**最后更新**: 2026-03-08

🎉 **感谢使用 Visual Effects Lab v2.0!** 🎉
