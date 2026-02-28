const NetworkMap = {
    nodes: [],
    animationId: null,

    openWindow: function() {
        const content = `
            <canvas id="network-canvas" style="width:100%; height:100%; background:#000;"></canvas>
        `;
        const win = windowManager.createWindow('win-network', 'GLOBAL NETWORK TOPOLOGY', content, {width: 600, height: 400});
        
        // 窗口关闭时停止动画
        win.querySelector('.btn-close').addEventListener('click', this.stop.bind(this));
        
        this.initCanvas();
    },

    initCanvas: function() {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;
        
        // 调整画布大小以匹配容器
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        
        const ctx = canvas.getContext('2d');
        
        // 生成随机节点
        this.nodes = [];
        for (let i = 0; i < 15; i++) {
            this.nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 3 + 2,
                ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
            });
        }

        this.startAnimation(ctx, canvas);
    },

    startAnimation: function(ctx, canvas) {
        const draw = () => {
            // 绘制背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "10px Courier New";
            
            // 更新并绘制节点
            this.nodes.forEach((node, i) => {
                // 移动节点
                node.x += node.vx;
                node.y += node.vy;

                // 边界反弹
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // 绘制连线
                this.nodes.forEach((other, j) => {
                    if (i === j) return;
                    const dist = Math.hypot(node.x - other.x, node.y - other.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist/120})`; // 距离越近越亮
                        ctx.stroke();
                    }
                });

                // 绘制节点
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#00ffff";
                ctx.fill();

                // 绘制标签 (随机显示IP)
                if (Math.random() > 0.95) {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                    ctx.fillText(node.ip, node.x + 5, node.y - 5);
                }
            });

            this.animationId = requestAnimationFrame(draw);
        };

        draw();
    },

    stop: function() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
};
