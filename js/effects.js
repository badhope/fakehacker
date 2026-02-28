/* ==========================================
   文件名：js/effects.js
   功能：视觉特效引擎
   ========================================== */

const Effects = {
    // 动画状态管理
    animState: {
        matrixInterval: null,
        networkInterval: null,
        glitchTimeout: null
    },

    // --- 1. 全局覆盖层控制 ---
    showOverlay: function(content) {
        const overlay = document.getElementById('global-overlay');
        const overlayContent = overlay.querySelector('.overlay-content');
        
        overlayContent.innerHTML = content;
        overlay.style.display = 'flex';
        
        // 添加渐入动画
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 10);
    },

    hideOverlay: function() {
        const overlay = document.getElementById('global-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
    },

    // --- 2. 屏幕闪烁 ---
    flashScreen: function(color = '#ffffff') {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: ${color}; opacity: 0.6; z-index: 9998;
            pointer-events: none; transition: opacity 0.2s;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 200);
        }, 50);
    },

    // --- 3. 故障效果 ---
    triggerGlitch: function(duration = 500) {
        const terminal = document.getElementById('display-area');
        terminal.classList.add('glitch-hard');
        
        // 随机偏移模拟故障
        const shiftX = Math.random() * 10 - 5;
        terminal.style.transform = `translate(${shiftX}px, ${shiftX}px)`;
        
        setTimeout(() => {
            terminal.classList.remove('glitch-hard');
            terminal.style.transform = 'none';
        }, duration);
    },

    // --- 4. 矩阵雨 ---
    triggerMatrix: function() {
        const canvas = document.getElementById('effect-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
        
        App.addLog("Initializing Matrix protocol...", 'info');
        
        const draw = () => {
            // 半透明黑色背景实现拖尾效果
            ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0'; // 绿色文字
            ctx.font = '20px monospace';
            
            for(let i=0; i<drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i*20, drops[i]*20);
                
                // 随机重置
                if(drops[i]*20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        // 清除之前的动画防止叠加
        if (this.animState.matrixInterval) clearInterval(this.animState.matrixInterval);
        
        this.animState.matrixInterval = setInterval(draw, 33);
        
        // 5秒后自动停止
        setTimeout(() => {
            clearInterval(this.animState.matrixInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
            App.addLog("Matrix protocol terminated.", 'info');
        }, 5000);
    },

    // --- 5. 网络拓扑地图 ---
    triggerNetworkMap: function() {
        const canvas = document.getElementById('effect-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 生成随机节点
        const nodes = [];
        for(let i=0; i<15; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                ip: CONFIG.getRandomIP()
            });
        }
        
        App.addLog("Mapping network topology...", 'info');
        
        const drawNetwork = () => {
            ctx.fillStyle = "rgba(5, 5, 5, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 绘制连线
            ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            
            nodes.forEach((node, i) => {
                // 随机连接到其他节点
                const target = nodes[Math.floor(Math.random() * nodes.length)];
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();
                
                // 绘制数据包移动效果（小球）
                if (Math.random() > 0.8) {
                    const progress = Math.random();
                    const px = node.x + (target.x - node.x) * progress;
                    const py = node.y + (target.y - node.y) * progress;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI*2);
                    ctx.fillStyle = "#00ffff";
                    ctx.fill();
                }
            });
            
            // 绘制节点
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI*2);
                ctx.fillStyle = "#00ffff";
                ctx.fill();
                
                // 绘制标签
                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.font = "10px monospace";
                ctx.fillText(node.ip, node.x + 8, node.y + 3);
            });
        };
        
        if (this.animState.networkInterval) clearInterval(this.animState.networkInterval);
        this.animState.networkInterval = setInterval(drawNetwork, 500);
        
        setTimeout(() => {
            clearInterval(this.animState.networkInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
            App.addLog("Network mapping complete.", 'success');
        }, 6000);
    },

    // --- 6. 自毁倒计时 ---
    triggerDestruct: function() {
        let count = 5;
        
        this.showOverlay(`
            <div style="text-align: center;">
                <div style="font-size: 100px; font-weight: bold; color: #ff0044; text-shadow: 0 0 20px red;" id="destruct-count">${count}</div>
                <div style="font-size: 20px; margin-top: 10px; color: white;">SYSTEM PURGE INITIATED</div>
                <div style="font-size: 12px; color: #888; margin-top: 20px;">DELETING ALL EVIDENCE...</div>
            </div>
        `);
        
        const interval = setInterval(() => {
            count--;
            const countEl = document.getElementById('destruct-count');
            if (countEl) countEl.innerText = count;
            
            this.flashScreen('#ff0000');
            this.triggerGlitch(200);
            
            if (count <= 0) {
                clearInterval(interval);
                // 模拟关机效果
                document.body.style.filter = 'brightness(0)';
                setTimeout(() => {
                    location.reload(); // 重新加载页面
                }, 1000);
            }
        }, 1000);
    },

    // --- 7. 勒索病毒界面 ---
    triggerRansomware: function() {
        this.showOverlay(`
            <div style="background: rgba(255,0,0,0.8); padding: 40px; border: 2px solid white; text-align: center; max-width: 600px;">
                <h1 style="color: white; font-size: 30px; margin-bottom: 20px;">! YOUR FILES ARE ENCRYPTED !</h1>
                <p style="color: white; font-size: 14px; margin-bottom: 30px;">Your important files are encrypted. To decrypt, send 1.5 BTC to the following address:</p>
                <div style="background: black; padding: 10px; color: #00ff00; font-family: monospace; word-break: break-all; margin-bottom: 20px;">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                </div>
                <p style="color: white; font-size: 12px;">Time remaining: <span id="ransom-timer">23:59:59</span></p>
                <button onclick="Effects.hideOverlay()" style="margin-top: 20px; padding: 10px 20px; background: transparent; border: 1px solid white; color: white; cursor: pointer;">
                    CLOSE (JUST A JOKE)
                </button>
            </div>
        `);
    },
    
    // --- 8. 扫描线动画 (动态添加) ---
    addScanline: function() {
        const line = document.createElement('div');
        line.className = 'scanline-moving';
        document.body.appendChild(line);
        
        setTimeout(() => line.remove(), 4000);
    }
};
