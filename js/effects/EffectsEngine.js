/* ==========================================
   模块名称：effects/EffectsEngine.js
   功能：视觉特效引擎，管理 Canvas 动画、覆盖层、屏幕效果
   版本：2.0 - 模块化、性能优化
   ========================================== */

/**
 * 特效引擎 - 统一管理所有视觉特效
 */
const EffectsEngine = (function() {
    // 动画状态管理
    const animState = {
        matrixInterval: null,
        networkInterval: null,
        glitchTimeout: null,
        currentEffect: null
    };
    
    // Canvas 引用
    let canvas = null;
    let ctx = null;

    /**
     * 初始化特效引擎
     */
    function init() {
        canvas = document.getElementById('effect-canvas');
        if (canvas) {
            ctx = canvas.getContext('2d');
            resizeCanvas();
        }
        console.log("EffectsEngine initialized");
    }

    /**
     * 调整 Canvas 尺寸
     */
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /**
     * 停止当前所有动画
     */
    function stopAllEffects() {
        if (animState.matrixInterval) clearInterval(animState.matrixInterval);
        if (animState.networkInterval) clearInterval(animState.networkInterval);
        if (animState.glitchTimeout) clearTimeout(animState.glitchTimeout);
        animState.currentEffect = null;
        
        // 清空 Canvas
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (canvas) canvas.style.display = 'none';
    }

    // ==================== 全局覆盖层控制 ====================
    
    /**
     * 显示全局覆盖层
     */
    function showOverlay(content) {
        const overlay = document.getElementById('global-overlay');
        const overlayContent = overlay.querySelector('.overlay-content');
        
        if (!overlay || !overlayContent) return;
        
        overlayContent.innerHTML = content;
        overlay.style.display = 'flex';
        
        // 添加渐入动画
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.opacity = '1', 10);
    }

    /**
     * 隐藏全局覆盖层
     */
    function hideOverlay() {
        const overlay = document.getElementById('global-overlay');
        if (!overlay) return;
        
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
    }

    // ==================== 屏幕特效 ====================
    
    /**
     * 屏幕闪烁效果
     */
    function flashScreen(color = '#ffffff') {
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
    }

    /**
     * 故障效果
     */
    function triggerGlitch(duration = 500) {
        const terminal = document.getElementById('display-area');
        if (!terminal) return;
        
        terminal.classList.add('glitch-hard');
        
        // 随机偏移模拟故障
        const shiftX = Math.random() * 10 - 5;
        terminal.style.transform = `translate(${shiftX}px, ${shiftX}px)`;
        
        animState.glitchTimeout = setTimeout(() => {
            terminal.classList.remove('glitch-hard');
            terminal.style.transform = 'none';
        }, duration);
    }

    // ==================== Canvas 动画特效 ====================
    
    /**
     * 矩阵雨特效
     */
    function triggerMatrix() {
        if (!canvas || !ctx) return;
        
        stopAllEffects();
        
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const columns = Math.floor(canvas.width / 20);
        const drops = Array(columns).fill(1);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
        
        if (Application) Application.addLog("Initializing Matrix protocol...", 'info');
        
        const draw = () => {
            // 半透明黑色背景实现拖尾效果
            ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0'; // 绿色文字
            ctx.font = '20px monospace';
            
            for(let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i*20, drops[i]*20);
                
                // 随机重置
                if(drops[i]*20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        animState.matrixInterval = setInterval(draw, 33);
        
        // 5 秒后自动停止
        setTimeout(() => {
            stopAllEffects();
            if (Application) Application.addLog("Matrix protocol terminated.", 'info');
        }, 5000);
    }

    /**
     * 网络拓扑地图特效
     */
    function triggerNetworkMap() {
        if (!canvas || !ctx) return;
        
        stopAllEffects();
        
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 生成随机节点
        const nodes = [];
        for(let i = 0; i < 15; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                ip: CONFIG.getRandomIP()
            });
        }
        
        if (Application) Application.addLog("Mapping network topology...", 'info');
        
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
        
        animState.networkInterval = setInterval(drawNetwork, 500);
        
        setTimeout(() => {
            stopAllEffects();
            if (Application) Application.addLog("Network mapping complete.", 'success');
        }, 6000);
    }

    /**
     * 自毁倒计时特效
     */
    function triggerDestruct() {
        let count = 5;
        
        showOverlay(`
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
            
            flashScreen('#ff0000');
            triggerGlitch(200);
            
            if (count <= 0) {
                clearInterval(interval);
                // 模拟关机效果
                document.body.style.filter = 'brightness(0)';
                setTimeout(() => {
                    location.reload(); // 重新加载页面
                }, 1000);
            }
        }, 1000);
    }

    /**
     * 勒索病毒界面特效
     */
    function triggerRansomware() {
        showOverlay(`
            <div style="background: rgba(255,0,0,0.8); padding: 40px; border: 2px solid white; text-align: center; max-width: 600px;">
                <h1 style="color: white; font-size: 30px; margin-bottom: 20px;">! YOUR FILES ARE ENCRYPTED !</h1>
                <p style="color: white; font-size: 14px; margin-bottom: 30px;">Your important files are encrypted. To decrypt, send 1.5 BTC to the following address:</p>
                <div style="background: black; padding: 10px; color: #00ff00; font-family: monospace; word-break: break-all; margin-bottom: 20px;">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                </div>
                <p style="color: white; font-size: 12px;">Time remaining: <span id="ransom-timer">23:59:59</span></p>
                <button onclick="EffectsEngine.hideOverlay()" style="margin-top: 20px; padding: 10px 20px; background: transparent; border: 1px solid white; color: white; cursor: pointer;">
                    CLOSE (JUST A JOKE)
                </button>
            </div>
        `);
    }

    /**
     * 扫描线动画
     */
    function addScanline() {
        const line = document.createElement('div');
        line.className = 'scanline-moving';
        document.body.appendChild(line);
        
        setTimeout(() => line.remove(), 4000);
    }

    /**
     * 粒子爆炸效果
     */
    function triggerExplosion(x, y) {
        if (!canvas || !ctx) return;
        
        canvas.style.display = 'block';
        
        const particles = [];
        for(let i = 0; i < 50; i++) {
            particles.push({
                x: x || canvas.width / 2,
                y: y || canvas.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // 重力
                p.life -= 0.02;
                
                if (p.life > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fill();
                } else {
                    particles.splice(i, 1);
                }
            });
            
            ctx.globalAlpha = 1;
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                canvas.style.display = 'none';
            }
        };
        
        animate();
    }

    // 公开 API
    return {
        init,
        resizeCanvas,
        stopAllEffects,
        showOverlay,
        hideOverlay,
        flashScreen,
        triggerGlitch,
        triggerMatrix,
        triggerNetworkMap,
        triggerDestruct,
        triggerRansomware,
        addScanline,
        triggerExplosion
    };
})();

// 导出到全局作用域
window.EffectsEngine = EffectsEngine;
