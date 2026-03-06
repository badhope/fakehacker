# QUANTUM HACK TERMINAL v2.0 - 模块化架构说明

## 📁 项目结构

```
fakehacker/
├── index.html                    # 主 HTML 文件
├── css/
│   ├── main.css                  # 核心样式、主题变量、基础布局
│   ├── components.css            # 按钮、卡片、进度条等组件样式
│   ├── animations.css            # 动画关键帧和过渡效果
│   ├── enhanced.css              # 新增增强样式（视觉反馈、主题支持）
│   └── themes/
│       └── dark.css              # 暗色主题（默认）
├── js/
│   ├── config/
│   │   └── CONFIG.js             # 全局配置、命令映射、文案库
│   ├── core/
│   │   └── Application.js        # 核心应用控制器（单例模式）
│   ├── commands/
│   │   ├── CommandSystem.js      # 指令系统中枢（统一调度）
│   │   └── LetterCommands.js     # 26 个字母按钮的具体功能实现
│   ├── effects/
│   │   └── EffectsEngine.js      # 视觉特效引擎（Canvas 动画、覆盖层）
│   ├── ui/
│   │   ├── UIModule.js           # UI 组件管理（日志、按钮生成）
│   │   └── QuickActions.js       # 快速行动按钮功能
│   ├── systems/
│   │   ├── AudioManager.js       # 音效管理系统
│   │   ├── StorageManager.js     # 本地存储管理（设置、进度）
│   │   └── ThemeManager.js       # 主题管理系统
│   └── utils.js                  # 通用工具函数（保留兼容）
└── README.md                     # 项目说明文档
```

## 🏗️ 模块化架构设计

### 分层架构（自底向上）

#### 1. **配置层** - `js/config/CONFIG.js`
- 全局唯一配置源
- 命令映射定义
- 随机数据生成器

#### 2. **核心系统层** - `js/core/Application.js`
- 应用主控制器（单例模式）
- 模块注册与初始化
- 状态管理与事件调度
- 统一 API 出口

#### 3. **功能模块层**
- **UIModule** - UI 组件管理
  - 按钮生成与高亮
  - 日志输出与管理
  - 进度条更新
  
- **EffectsEngine** - 视觉特效引擎
  - Canvas 动画（矩阵雨、网络拓扑）
  - 屏幕效果（闪烁、故障）
  - 覆盖层管理
  
- **CommandSystem** - 指令系统中枢
  - 指令执行调度
  - 指令队列管理
  - 动态注册指令
  
- **LetterCommands** - 字母指令实现
  - A-Z 具体功能函数
  - 可独立扩展

#### 4. **系统服务层**
- **AudioManager** - 音效管理
  - Web Audio API 封装
  - 音效缓存与预加载
  - 音量控制
  
- **StorageManager** - 本地存储
  - 设置持久化
  - 玩家数据管理
  - 成就系统支持
  
- **ThemeManager** - 主题管理
  - 多主题切换
  - 自定义颜色
  - 主题注册

#### 5. **工具层** - `utils.js`
- 通用工具函数
- 保留向后兼容

## 🎯 核心特性

### ✨ 新增功能

1. **多主题系统**
   - 暗色主题（默认）
   - 亮色主题
   - 赛博朋克
   - 矩阵主题
   - 太阳能主题

2. **音效系统**
   - 按键音效
   - 事件音效（成功、错误、故障）
   - 音量控制
   - 音效开关

3. **存储系统**
   - 设置持久化
   - 玩家数据统计
   - 成就解锁追踪
   - 经验值与等级

4. **增强视觉体验**
   - 霓虹灯按钮效果
   - 日志滑入动画
   - 进度条渐变
   - 状态栏呼吸灯
   - CRT 屏幕效果

5. **快速行动**
   - 紧急恐慌按钮
   - 故障模式
   - 系统重启
   - 全屏切换
   - 日志清除
   - 矩阵模式
   - 主题切换
   - 音效开关

## 🔧 使用指南

### 基本用法

```javascript
// 1. 执行字母指令
Application.executeLetterCommand('A');  // 密码破解

// 2. 执行数字指令（高级玩法）
Application.executeNumberCommand('1');  // 攻击序列 Alpha

// 3. 添加日志
Application.addLog('系统消息', 'info');
Application.addLog('成功消息', 'success');
Application.addLog('错误消息', 'error');

// 4. 播放音效
AudioManager.play('key-press');
AudioManager.play('success');
AudioManager.play('error');

// 5. 触发特效
EffectsEngine.triggerMatrix();      // 矩阵雨
EffectsEngine.triggerGlitch(1000);  // 故障效果
EffectsEngine.flashScreen('#fff');  // 屏幕闪烁

// 6. 切换主题
ThemeManager.nextTheme();
ThemeManager.applyTheme('cyberpunk');

// 7. 存储数据
StorageManager.addExperience(50);   // 增加经验
StorageManager.unlockAchievement('first_hack');
```

### 扩展指令

```javascript
// 注册自定义指令
CommandSystem.registerCommand('myCommand', function(config) {
    Application.addLog('执行自定义命令', 'success');
    // 具体实现...
});

// 在 CONFIG.letterCommands 中映射
CONFIG.letterCommands['A'].action = 'myCommand';
```

### 自定义主题

```javascript
// 注册新主题
ThemeManager.registerTheme('custom', {
    name: '自定义主题',
    file: null,
    colors: {
        primary: '#ff6600',
        bg: '#1a1a1a',
        accent: '#00ccff'
    }
});

// 应用主题
ThemeManager.applyTheme('custom');
```

## 🎮 游戏玩法

### 简单模式
- 按任意字母键（A-Z）
- 点击左侧按钮面板
- 每个字母对应不同功能

### 高级模式
- 在右侧输入框输入数字（1-9）
- 触发组合指令序列
- 观看自动执行的攻击链

### 快速行动
- **PANIC** - 紧急锁定，红色警报
- **GLITCH** - 视觉故障效果
- **REBOOT** - 重启系统
- **CHANGE THEME** - 切换主题
- **TOGGLE AUDIO** - 开关音效
- **FULLSCREEN** - 全屏模式
- **CLEAR LOGS** - 清除日志
- **MATRIX MODE** - 矩阵雨特效

## 📊 数据统计

系统自动追踪：
- 总命令执行次数
- 成功/失败黑客次数
- 游戏等级与经验值
- 成就解锁进度
- 总游戏时间

## 🎨 主题定制

### CSS 变量系统

```css
:root {
    --main-color: #00ff00;        /* 主色调 */
    --bg-color: #050505;          /* 背景色 */
    --accent-color: #00ffff;      /* 强调色 */
    --alert-color: #ff0044;       /* 警告色 */
}
```

### 自定义颜色

```javascript
ThemeManager.customizeTheme('dark', {
    primary: '#00ff88',
    accent: '#ff00ff'
});
```

## 🔌 模块依赖关系

```
Application.js (核心)
├── UIModule (UI 组件)
├── EffectsEngine (特效)
├── CommandSystem (指令)
│   └── LetterCommands (指令实现)
├── AudioManager (音效)
├── StorageManager (存储)
└── ThemeManager (主题)
```

## 🚀 性能优化

1. **模块懒加载** - 按需初始化
2. **事件委托** - 减少事件监听器
3. **Canvas 优化** - 动画停止时清空定时器
4. **音效缓存** - 预加载常用音效
5. **存储缓存** - 内存缓存 + localStorage

## 📱 响应式设计

- 桌面端：完整三栏布局
- 平板端：优化按钮尺寸
- 移动端：简化布局，隐藏描述文字

## 🛠️ 开发指南

### 添加新指令

1. 在 `LetterCommands.js` 中实现函数
```javascript
const LetterCommands = {
    myNewCommand: function(config) {
        // 实现逻辑
    }
};
```

2. 在 `CONFIG.js` 中注册映射
```javascript
letterCommands: {
    'A': {
        name: "新指令",
        action: "myNewCommand",
        // ...其他配置
    }
}
```

### 添加新主题

```javascript
ThemeManager.registerTheme('new', {
    name: '新主题',
    colors: {
        primary: '#颜色',
        bg: '#背景',
        accent: '#强调色'
    }
});
```

### 添加新特效

```javascript
EffectsEngine.registerEffect('myEffect', function() {
    // Canvas 绘制逻辑
});
```

## 📝 版本历史

### v2.0 (模块化重构版)
- ✅ 完全重构为模块化架构
- ✅ 新增音效系统
- ✅ 新增存储系统
- ✅ 新增主题系统
- ✅ 增强视觉反馈
- ✅ 优化代码可维护性

### v1.0 (初始版)
- 基础终端模拟
- 26 个字母指令
- 数字组合指令
- 基础特效

## 📄 许可证

MIT License - 开源免费使用

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

---

**开发者**: BADHOPE  
**版本**: 2.0.0  
**更新日期**: 2026-03-06
