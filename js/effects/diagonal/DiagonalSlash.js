/**
 * Diagonal Slash Effect
 * 斜向切割线特效
 */

class DiagonalSlash extends BaseEffect {
    constructor(canvas, params = {}) {
        super(canvas, params);
        this.name = 'DiagonalSlash';
        this.lines = [];
        this.timer = 0;
    }

    get defaultParams() {
        return {
            lineCount: 20,
            lineSpeed: 150,
            lineSpacing: 100,
            lineAngle: 45,
            lineWidth: 3,
            baseHue: 280,
            hueShift: 2,
            glow: true
        };
    }

    async init() {
        this.lines = [];
        const angle = Utils.degToRad(this.params.lineAngle);
        
        for (let i = 0; i < this.params.lineCount; i++) {
            this.lines.push({
                offset: i * this.params.lineSpacing,
                speed: this.params.lineSpeed,
                angle: angle,
                hue: this.params.baseHue + i * this.params.hueShift
            });
        }
        
        this.initialized = true;
    }

    update(deltaTime) {
        this.timer += deltaTime;
        
        for (const line of this.lines) {
            line.offset += line.speed * deltaTime;
            if (line.offset > this.params.lineSpacing * this.params.lineCount) {
                line.offset = 0;
            }
        }
    }

    render(ctx) {
        ctx.save();
        
        if (this.params.glow) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsla(${this.params.baseHue}, 80%, 60%, 0.5)`;
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.lines.forEach((line, index) => {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${line.hue}, 80%, 60%, 0.8)`;
            ctx.lineWidth = this.params.lineWidth;
            
            const x = centerX + Math.cos(line.angle) * (line.offset - this.params.lineSpacing * this.params.lineCount / 2);
            const y = centerY + Math.sin(line.angle) * (line.offset - this.params.lineSpacing * this.params.lineCount / 2);
            
            ctx.moveTo(
                x - Math.sin(line.angle) * 1000,
                y + Math.cos(line.angle) * 1000
            );
            ctx.lineTo(
                x + Math.sin(line.angle) * 1000,
                y - Math.cos(line.angle) * 1000
            );
            
            ctx.stroke();
        });

        ctx.restore();
    }
}

window.DiagonalSlash = DiagonalSlash;
