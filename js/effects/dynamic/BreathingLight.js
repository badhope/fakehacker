/**
 * BreathingLight - 呼吸灯光特效
 * 圆形光晕像呼吸一样缩放和明暗变化
 */

class BreathingLight extends BaseEffect {
    get name() { return 'BreathingLight'; }
    
    get defaultParams() {
        return {
            breathSpeed: 0.5,
            maxRadius: 150,
            minRadius: 50,
            baseHue: 180,
            circleCount: 5
        };
    }
    
    async init() {
        await super.init();
        this.circles = [];
        this.time = 0;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        for (let i = 0; i < this.params.circleCount; i++) {
            this.circles.push({
                baseRadius: this.params.minRadius + (i * 20),
                phase: i * 0.5,
                hue: (this.params.baseHue + i * 40) % 360
            });
        }
    }
    
    update(deltaTime) {
        this.time += deltaTime;
    }
    
    render(ctx) {
        // 呼吸函数：sin 波，值在 0-1 之间
        const breath = (Math.sin(this.time * this.params.breathSpeed * Math.PI) + 1) / 2;
        
        for (const circle of this.circles) {
            // 每个圆有不同的呼吸相位
            const phaseBreath = (Math.sin(this.time * this.params.breathSpeed * Math.PI + circle.phase) + 1) / 2;
            const currentRadius = this.params.minRadius + (this.params.maxRadius - this.params.minRadius) * phaseBreath;
            
            const gradient = ctx.createRadialGradient(
                this.centerX, this.centerY, 0,
                this.centerX, this.centerY, currentRadius
            );
            
            const alpha = 0.3 * (1 - phaseBreath * 0.5);
            gradient.addColorStop(0, `hsla(${circle.hue}, 80%, 60%, ${alpha})`);
            gradient.addColorStop(0.5, `hsla(${circle.hue}, 80%, 60%, ${alpha * 0.5})`);
            gradient.addColorStop(1, `hsla(${circle.hue}, 80%, 60%, 0)`);
            
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // 边缘光晕
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, currentRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${circle.hue}, 80%, 70%, ${0.5 * phaseBreath})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // 中心核心
        const coreBreath = (Math.sin(this.time * this.params.breathSpeed * Math.PI * 2) + 1) / 2;
        const coreRadius = 10 + coreBreath * 20;
        
        const coreGradient = ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, coreRadius
        );
        
        coreGradient.addColorStop(0, `hsla(${this.params.baseHue}, 80%, 90%, 1)`);
        coreGradient.addColorStop(0.5, `hsla(${this.params.baseHue}, 80%, 60%, 0.5)`);
        coreGradient.addColorStop(1, `hsla(${this.params.baseHue}, 80%, 60%, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
    }
    
    onResize() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
}

window.BreathingLight = BreathingLight;
