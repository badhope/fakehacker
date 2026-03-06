/**
 * Pulse Wave Effect
 * 脉冲波动特效
 */

class PulseWave extends BaseEffect {
    constructor(canvas, params = {}) {
        super(canvas, params);
        this.name = 'PulseWave';
        this.pulses = [];
        this.timer = 0;
    }

    get defaultParams() {
        return {
            pulseInterval: 0.5,
            pulseSpeed: 200,
            pulseWidth: 50,
            baseHue: 0,
            hueShift: 30,
            maxPulses: 20,
            glow: true
        };
    }

    async init() {
        this.pulses = [];
        this.timer = 0;
        this.initialized = true;
    }

    update(deltaTime) {
        this.timer += deltaTime;

        // 生成新脉冲
        if (this.timer >= this.params.pulseInterval && this.pulses.length < this.params.maxPulses) {
            this.pulses.push({
                radius: 0,
                hue: this.params.baseHue
            });
            this.params.baseHue = (this.params.baseHue + this.params.hueShift) % 360;
            this.timer = 0;
        }

        // 更新脉冲
        for (let i = this.pulses.length - 1; i >= 0; i--) {
            const pulse = this.pulses[i];
            pulse.radius += this.params.pulseSpeed * deltaTime;
            
            const maxRadius = Math.max(this.canvas.width, this.canvas.height);
            if (pulse.radius > maxRadius) {
                this.pulses.splice(i, 1);
            }
        }
    }

    render(ctx) {
        ctx.save();
        
        if (this.params.glow) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.shadowBlur = 30;
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.pulses.forEach(pulse => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulse.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${pulse.hue}, 80%, 60%, 0.8)`;
            ctx.lineWidth = this.params.pulseWidth;
            ctx.stroke();
        });

        ctx.restore();
    }
}

window.PulseWave = PulseWave;
