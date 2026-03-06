/**
 * CascadeFlow - 级联流动特效
 * 多层瀑布般的效果从上向下流动
 */

class CascadeFlow extends BaseEffect {
    get name() { return 'CascadeFlow'; }
    
    get defaultParams() {
        return {
            layerCount: 5,
            flowSpeed: 80,
            particlePerLayer: 50,
            spread: 0.3,
            baseHue: 240
        };
    }
    
    async init() {
        await super.init();
        this.layers = [];
        
        for (let i = 0; i < this.params.layerCount; i++) {
            const layer = {
                y: -i * 100,
                hue: (this.params.baseHue + i * 30) % 360,
                particles: [],
                speed: this.params.flowSpeed * (1 + i * 0.2)
            };
            
            for (let j = 0; j < this.params.particlePerLayer; j++) {
                layer.particles.push(this.createParticle(j, i));
            }
            
            this.layers.push(layer);
        }
    }
    
    createParticle(index, layerIndex) {
        return {
            x: (index / this.params.particlePerLayer) * this.canvas.width,
            y: Math.random() * 50,
            vx: (Math.random() - 0.5) * this.params.spread * 100,
            vy: 0,
            size: Math.random() * 3 + 2,
            alpha: Math.random() * 0.5 + 0.5
        };
    }
    
    update(deltaTime) {
        for (const layer of this.layers) {
            layer.y += layer.speed * deltaTime;
            
            for (const particle of layer.particles) {
                particle.y += layer.speed * deltaTime;
                particle.x += particle.vx * deltaTime;
                
                // 边界检查
                if (particle.y > this.canvas.height) {
                    particle.y = -10;
                    particle.x = Math.random() * this.canvas.width;
                }
                
                if (particle.x < 0 || particle.x > this.canvas.width) {
                    particle.vx *= -1;
                }
            }
            
            // 循环层
            if (layer.y > this.canvas.height) {
                layer.y = -100;
            }
        }
    }
    
    render(ctx) {
        for (const layer of this.layers) {
            for (const particle of layer.particles) {
                const x = particle.x;
                const y = (particle.y + layer.y) % this.canvas.height;
                
                if (y < 0) continue;
                
                ctx.beginPath();
                ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${layer.hue}, 80%, 60%, ${particle.alpha})`;
                ctx.fill();
                
                // 拖尾
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y - particle.size * 3);
                ctx.strokeStyle = `hsla(${layer.hue}, 80%, 60%, ${particle.alpha * 0.5})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    
    onResize() {
        // 重新初始化粒子
        this.init();
    }
}

window.CascadeFlow = CascadeFlow;
