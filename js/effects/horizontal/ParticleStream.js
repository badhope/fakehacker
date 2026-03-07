/**
 * Particle Stream Effect - Enhanced
 * 横向粒子流特效（增强版）
 * 增加了：重力、风力、粒子大小变化、颜色循环、爆炸效果
 */

class ParticleStream extends BaseEffect {
    constructor(canvas, params = {}) {
        super(canvas, params);
        this.name = 'ParticleStream';
        this.particles = [];
        this.maxParticles = 500;
    }

    get defaultParams() {
        return {
            particleSize: 3,
            particleSpeed: 100,
            spawnRate: 10,
            spread: 0.5,
            baseHue: 200,
            trail: true,
            trailAlpha: 0.1,
            gravity: 0,
            wind: 0,
            sizeVariation: 0.5,
            colorCycle: true,
            colorSpeed: 10,
            explosion: false,
            particleShape: 'circle'
        };
    }

    async init() {
        this.particles = [];
        this.spawnTimer = 0;
        this.currentHue = this.params.baseHue;
        this.initialized = true;
    }

    update(deltaTime) {
        // 生成新粒子
        this.spawnTimer += deltaTime * this.params.spawnRate;
        while (this.spawnTimer >= 1 && this.particles.length < this.maxParticles) {
            this.spawnParticle();
            this.spawnTimer--;
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 应用物理效果
            p.vx += this.params.wind * deltaTime;
            p.vy += this.params.gravity * deltaTime;
            
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= deltaTime * 0.5;
            p.size *= 0.99;

            // 颜色循环
            if (this.params.colorCycle) {
                p.hue = (p.hue + this.params.colorSpeed * deltaTime) % 360;
            }

            if (p.life <= 0 || p.size < 0.5 || p.x > this.canvas.width) {
                this.particles.splice(i, 1);
            }
        }
    }

    spawnParticle() {
        const y = Utils.randomRange(0, this.canvas.height);
        const angle = Utils.randomRange(-this.params.spread, this.params.spread);
        const speed = this.params.particleSpeed;
        const sizeVariation = Utils.randomRange(1 - this.params.sizeVariation, 1 + this.params.sizeVariation);
        
        this.particles.push({
            x: 0,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: this.params.particleSize * sizeVariation,
            hue: this.params.colorCycle ? this.currentHue : Utils.randomRange(this.params.baseHue - 30, this.params.baseHue + 30),
            shape: this.params.particleShape
        });
        
        if (this.params.colorCycle) {
            this.currentHue = (this.currentHue + 5) % 360;
        }
    }

    render(ctx) {
        if (this.params.trail) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.params.trailAlpha})`;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        this.particles.forEach(p => {
            ctx.beginPath();
            
            if (p.shape === 'square') {
                ctx.rect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
            } else if (p.shape === 'triangle') {
                ctx.moveTo(p.x, p.y - p.size);
                ctx.lineTo(p.x + p.size, p.y + p.size);
                ctx.lineTo(p.x - p.size, p.y + p.size);
                ctx.closePath();
            } else {
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            }
            
            ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.life})`;
            ctx.fill();
            
            // 爆炸效果
            if (this.params.explosion && p.life < 0.3) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.life * 0.5})`;
                ctx.fill();
            }
        });

        ctx.restore();
    }

    onResize() {
        this.init();
    }
}

window.ParticleStream = ParticleStream;
