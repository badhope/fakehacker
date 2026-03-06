/* ==========================================
   模块名称：ui/UIModule.js
   功能：UI 组件管理、日志输出、按钮生成与交互
   版本：2.0 (模块化重构版)
   ========================================== */

/**
 * UI 模块 - 负责所有用户界面相关的操作
 */
const UIModule = (function() {
    // 私有变量
    const logContainer = null;
    const buttonsGrid = null;
    const MAX_LOG_LINES = 100;

    /**
     * 初始化 UI 模块
     */
    function init() {
        console.log("UIModule initialized");
    }

    /**
     * 生成 26 个字母按钮
     */
    function generateButtons() {
        const grid = document.getElementById('buttons-grid');
        if (!grid) return;
        
        grid.innerHTML = ''; // 清空现有内容

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        for (let letter of letters) {
            const cmdConfig = CONFIG.letterCommands[letter];
            if (!cmdConfig) continue;
            
            // 创建按钮元素
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.dataset.key = letter;
            btn.dataset.type = cmdConfig.type;
            
            // 按钮内容
            btn.innerHTML = `
                <span class="key">${letter}</span>
                <span class="desc">${cmdConfig.desc || cmdConfig.name}</span>
            `;

            // 绑定点击事件
            btn.addEventListener('click', () => {
                if (Application) {
                    Application.executeLetterCommand(letter);
                }
                addButtonEffect(btn);
            });

            grid.appendChild(btn);
        }
    }

    /**
     * 添加日志到终端
     */
    function addLog(text, type = 'info') {
        const container = document.getElementById('log-container');
        if (!container) return;
        
        const line = document.createElement('div');
        line.className = `log-entry ${type}`;
        line.innerText = `> ${text}`;
        
        container.appendChild(line);
        
        // 自动滚动到底部
        container.scrollTop = container.scrollHeight;
        
        // 限制行数
        while (container.childNodes.length > MAX_LOG_LINES) {
            container.removeChild(container.childNodes[0]);
        }
    }

    /**
     * 高亮对应按钮
     */
    function highlightButton(key) {
        const btn = document.querySelector(`.letter-btn[data-key="${key}"]`);
        if (btn) {
            addButtonEffect(btn);
        }
    }

    /**
     * 添加按钮点击效果
     */
    function addButtonEffect(btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * 更新进度条
     */
    function updateProgress(percent, text = '') {
        const progress = document.getElementById('main-progress');
        const progressText = document.querySelector('.progress-text');
        
        if (progress) {
            progress.style.width = `${percent}%`;
        }
        
        if (progressText && text) {
            progressText.innerText = text;
        }
    }

    /**
     * 更新状态栏信息
     */
    function updateStatusBar(key, value) {
        const el = document.getElementById(key);
        if (el) {
            el.innerText = value;
        }
    }

    /**
     * 显示提示信息
     */
    function showTip(text, duration = 3000) {
        const tipEl = document.getElementById('tip-text');
        if (!tipEl) return;
        
        const originalText = tipEl.innerText;
        tipEl.innerText = text;
        tipEl.style.animation = 'none';
        tipEl.offsetHeight; // 触发重绘
        tipEl.style.animation = 'fadeIn 0.3s ease';
        
        setTimeout(() => {
            tipEl.innerText = originalText;
        }, duration);
    }

    /**
     * 切换全屏模式
     */
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * 复制文本到剪贴板
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showTip('已复制到剪贴板', 2000);
        }).catch(err => {
            // 降级方案
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            showTip('已复制到剪贴板', 2000);
        });
    }

    /**
     * 清空日志
     */
    function clearLogs() {
        const container = document.getElementById('log-container');
        if (container) {
            container.innerHTML = '';
            addLog('System logs cleared.', 'success');
        }
    }

    /**
     * 滚动日志到顶部/底部
     */
    function scrollLogs(toBottom = true) {
        const container = document.getElementById('log-container');
        if (container) {
            container.scrollTop = toBottom ? container.scrollHeight : 0;
        }
    }

    /**
     * 获取日志容器引用
     */
    function getLogContainer() {
        return document.getElementById('log-container');
    }

    // 公开 API
    return {
        init,
        generateButtons,
        addLog,
        highlightButton,
        addButtonEffect,
        updateProgress,
        updateStatusBar,
        showTip,
        toggleFullscreen,
        copyToClipboard,
        clearLogs,
        scrollLogs,
        getLogContainer
    };
})();

// 导出到全局作用域
window.UIModule = UIModule;
