
<div align="center">
# QUANTUM HACK TERMINAL v2.0
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=00FF00&center=true&vCenter=true&random=false&width=600&height=50&lines=SYSTEM+INITIALIZED;WELCOME+TO+THE+MATRIX;PRESS+START+TO+HACK" alt="Typing SVG" />
<!-- 炫酷的徽章标签 -->
<img src="https://img.shields.io/badge/Version-2.0.0-00ff00?style=for-the-badge&logo=semver&logoColor=white" alt="Version">
<img src="https://img.shields.io/badge/License-MIT-red?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License">
<img src="https://img.shields.io/badge/Platform-Web-informational?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Platform">
<img src="https://img.shields.io/badge/Status-ONLINE-brightgreen?style=for-the-badge&logo=serverfault&logoColor=white" alt="Status">
<!-- 重点强调的 Star 标签 -->
<a href="https://github.com/badhope/fakehacker/stargazers">
    <img src="https://img.shields.io/github/stars/badhope/fakehacker?style=for-the-badge&logo=starship&logoColor=white&color=yellow" alt="Stars">
</a>
<a href="https://github.com/badhope/fakehacker/network/members">
    <img src="https://img.shields.io/github/forks/badhope/fakehacker?style=for-the-badge&logo=git&logoColor=white&color=blue" alt="Forks">
</a>
**⚡ 纯前端静态模拟 · 沉浸式黑客体验 · 零门槛装逼神器 ⚡**
</div>
---
### 📡 项目简介
你是否曾幻想过像电影里的黑客一样，指尖敲击键盘，屏幕上代码飞速滚动，瞬间攻破防火墙？  
**QUANTUM HACK TERMINAL** 是一个基于纯前端技术构建的**极客风格黑客模拟器**。无需后端，无需数据库，只需一个浏览器，即可体验最炫酷的“网络攻击”视觉盛宴。
这不是真实的黑客工具，但它的**视觉欺骗性**足以让你的朋友瞠目结舌。专为程序员、极客、技术博主打造，适合用于：
*   🎬 **视频拍摄/直播背景**：专业的终端界面，科技感拉满。
*   🎮 **恶搞娱乐**：一键模拟入侵，让小白以为你是顶级黑客。
*   🧪 **前端技术展示**：模块化架构，Canvas 动画，CSS 特效的完美练手项目。
---
### 💻 操作模式
我们将复杂的“黑客指令”封装为两种极致简单的交互方式：
#### 🔰 简单模式
点击左侧面板的 **26 个字母按钮 (A-Z)**，每个字母对应一个独特的攻击或工具功能。
*   **A** - 密码暴力破解
*   **C** - DDoS 流量攻击
*   **E** - 端口扫描
*   **M** - 邮件伪造
*   ... 更多功能等你探索
#### 💎 高级模式
在右侧输入框输入 **数字代码**，触发组合技：
*   输入 **1** ➔ 启动“阿尔法攻击序列”
*   输入 **9** ➔ 触发“系统自毁程序”
*   输入 **3** ➔ 执行“数据劫持”
> **提示**：即使你是小白，乱按键盘也会有惊喜反馈！
---
### ✨ 核心特性
*   **🚀 零依赖纯静态**：HTML + CSS + 原生 JS，无需安装 Node.js 或任何框架，双击 `index.html` 即可运行。
*   **🎨 赛博朋克 UI**：精心设计的暗黑主题，配合霓虹色彩、扫描线滤镜、故障艺术效果。
*   **⚡ 动态视觉引擎**：
    *   真实的代码雨效果
    *   动态网络拓扑图
    *   进度条模拟与数据包传输动画
*   **🔊 沉浸式音效**：使用 Web Audio API 生成的实时按键音，氛围感拉满。
*   **📱 响应式设计**：适配桌面端与移动端，随时随地开启你的黑客之旅。
---
### 📸 界面预览
<div align="center">
    <!-- 如果你有截图，可以放在这里 -->
    <img src="https://via.placeholder.com/800x450/050505/00ff00?text=TERMINAL+INTERFACE" alt="Terminal Preview" width="80%">
    <p><i>界面正在运行中...</i></p>
</div>
---
### 🚀 快速开始
你有三种方式启动这个项目：
1.  **直接下载**：
    ```bash
    git clone https://github.com/badhope/fakehacker.git
    cd fakehacker
    # 双击打开 index.html
    ```
2.  **在线体验**：
    点击 GitHub Pages 链接直接体验（推荐手机端演示）。
3.  **本地服务器 (可选)**：
    如果你需要音效或更严格的 MIME 类型支持：
    ```bash
    # 使用 Python
    python -m http.server 8080
    
    # 或使用 Node.js http-server
    npx http-server
    ```
    然后访问 `http://localhost:8080`
---
### 🛠️ 技术架构
项目采用模块化设计，代码结构清晰，易于二次开发：
```
fakehacker/
├── index.html          # 入口文件
├── css/
│   ├── main.css        # 核心布局与主题变量
│   ├── components.css  # 按钮与组件样式
│   └── animations.css  # 动画关键帧定义
└── js/
    ├── app.js          # 主控制器 (初始化、事件绑定)
    ├── config.js       # 配置中心 (功能映射、文案库)
    ├── effects.js      # 特效引擎
    └── simple-commands.js # 具体功能逻辑实现
```
---
### 🤝 参与贡献
这是一个开源的极客玩具，欢迎各路大神提交 PR 来让它变得更酷！
1.  Fork 本仓库
2.  新建分支 (`git checkout -b feature/AmazingFeature`)
3.  提交更改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request
---
### ⚖️ 免责声明
本项目仅供**娱乐、教育及演示目的**。所有显示的“黑客攻击”、“数据窃取”、“病毒传播”均为**视觉模拟**，不具备任何真实的破坏性功能。请勿将其用于任何非法用途或误导他人进行违法活动。
**使用者需自行承担使用本项目的所有风险。**
---
<div align="center">
### 👇 支持作者
如果这个项目让你感到眼前一亮，或者成功忽悠到了你的朋友，请给一个 **Star ⭐** 支持一下！
**Made with ❤️ and a little bit of Chaos**
</div>
```
