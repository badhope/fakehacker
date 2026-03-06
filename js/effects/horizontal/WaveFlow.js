/**
 * Horizontal Wave Flow Effect
 * 横向正弦波流动特效
 */

class HorizontalWaveFlow extends BaseEffect {
    constructor(canvas, params = {}) {
        super(canvas, params);
        this.name = 'HorizontalWaveFlow';
        this.waves = [];
        this.time = 0;
    }

    get defaultParams() {
        return {
            waveCount: 5,
            waveSpeed: 0.5,
            waveAmplitude: 50,
            waveFrequency: 0.02,
            baseColor: 180,
            colorSpeed: 0.2,
            lineWidth: 2
        };
    }

    async init() {
        this.waves = [];
        for (let i = 0; i < this.params.waveCount; i++) {
            this.waves.push({
                offset: i * 100,
                phase: i * Math.PI / 4,
                amplitude: this.params.waveAmplitude * (1 - i / this.params.waveCount)
            });
        }
        this.initialized = true;
    }

    update(deltaTime) {
        this.time += deltaTime * this.params.waveSpeed;
        this.params.baseColor += deltaTime * this.params.colorSpeed;
        if (this.params.baseColor > 360) {
            this.params.baseColor = 0;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.lineWidth = this.params.lineWidth;
        
        this.waves.forEach((wave, index) => {
            const hue = (this.params.baseColor + index * 20) % 360;
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
            ctx.beginPath();
            
            for (let x = 0; x < this.canvas.width; x += 5) {
                const y = this.canvas.height / 2 + 
                         Math.sin(x * this.params.waveFrequency + wave.phase + this.time) * wave.amplitude +
                         wave.offset;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
        
        ctx.restore();
    }

    onResize() {
        this.init();
    }
}

window.HorizontalWaveFlow = HorizontalWaveFlow;
