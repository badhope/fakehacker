/**
 * Particle Stream Effect
 * 横向粒子流特效
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
            trailAlpha: 0.1
        };
    }

    async init() {
        this.particles = [];
        this.spawnTimer = 0;
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
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= deltaTime * 0.5;
            p.size *= 0.99;

            if (p.life <= 0 || p.size < 0.5 || p.x > this.canvas.width) {
                this.particles.splice(i, 1);
            }
        }
    }

    spawnParticle() {
        const y = Utils.randomRange(0, this.canvas.height);
        const angle = Utils.randomRange(-this.params.spread, this.params.spread);
        const speed = this.params.particleSpeed;
        
        this.particles.push({
            x: 0,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: Utils.randomRange(this.params.particleSize * 0.5, this.params.particleSize * 1.5),
            hue: Utils.randomRange(this.params.baseHue - 30, this.params.baseHue + 30)
        });
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
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.life})`;
            ctx.fill();
        });

        ctx.restore();
    }

    onResize() {
        this.init();
    }
}

window.ParticleStream = ParticleStream;
