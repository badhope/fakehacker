/**
 * ColorBand - 彩色条带流动特效
 * 多层彩色条带从左向右流动
 */

class ColorBand extends BaseEffect {
    get name() { return 'ColorBand'; }
    
    get defaultParams() {
        return {
            bandCount: 8,
            bandSpeed: 30,
            bandHeight: 30,
            colorSpeed: 0.5,
            wave: true
        };
    }
    
    async init() {
        await super.init();
        this.bands = [];
        this.time = 0;
        
        const totalHeight = this.params.bandCount * this.params.bandHeight;
        const startY = (this.canvas.height - totalHeight) / 2;
        
        for (let i = 0; i < this.params.bandCount; i++) {
            this.bands.push({
                x: 0,
                y: startY + i * this.params.bandHeight,
                hue: (i * 40) % 360,
                offset: i * 0.5,
                speed: this.params.bandSpeed * (1 + i * 0.1)
            });
        }
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        for (const band of this.bands) {
            band.x += band.speed * deltaTime;
            if (band.x > this.canvas.width) {
                band.x = -this.canvas.width;
            }
            
            // 颜色循环
            band.hue = (band.hue + this.params.colorSpeed) % 360;
        }
    }
    
    render(ctx) {
        for (let i = 0; i < this.bands.length; i++) {
            const band = this.bands[i];
            
            if (this.params.wave) {
                // 波浪效果
                const waveY = Math.sin(this.time + band.offset) * 10;
                this.drawWaveBand(ctx, band, waveY);
            } else {
                // 直线条带
                this.drawStraightBand(ctx, band);
            }
        }
    }
    
    drawWaveBand(ctx, band, waveY) {
        ctx.beginPath();
        
        const segments = 50;
        const segmentWidth = this.canvas.width / segments;
        
        for (let i = 0; i <= segments; i++) {
            const x = band.x + i * segmentWidth;
            const normalizedX = ((x % this.canvas.width) + this.canvas.width) % this.canvas.width;
            const y = band.y + waveY + Math.sin(i * 0.2 + this.time) * 5;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.strokeStyle = `hsla(${band.hue}, 80%, 60%, 0.8)`;
        ctx.lineWidth = this.params.bandHeight;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
    
    drawStraightBand(ctx, band) {
        const gradient = ctx.createLinearGradient(
            band.x, band.y,
            band.x + this.canvas.width, band.y
        );
        
        gradient.addColorStop(0, `hsla(${band.hue}, 80%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${band.hue}, 80%, 60%, 1)`);
        gradient.addColorStop(1, `hsla(${band.hue}, 80%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(band.x, band.y, this.canvas.width, this.params.bandHeight);
    }
}

window.ColorBand = ColorBand;
