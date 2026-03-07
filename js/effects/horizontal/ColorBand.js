/**
 * ColorBand - Enhanced 彩色条带流动特效（增强版）
 * 增加了：波浪幅度、频率、相位、透明度、混合模式等参数
 */

class ColorBand extends BaseEffect {
    get name() { return 'ColorBand'; }
    
    get defaultParams() {
        return {
            bandCount: 8,
            bandSpeed: 30,
            bandHeight: 30,
            colorSpeed: 0.5,
            wave: true,
            waveAmplitude: 10,
            waveFrequency: 0.02,
            wavePhase: 0.5,
            transparency: 0.8,
            blendMode: 'lighter',
            gradientType: 'horizontal',
            glow: true,
            motionBlur: false
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
                offset: i * this.params.wavePhase,
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
        ctx.save();
        ctx.globalCompositeOperation = this.params.blendMode;
        
        for (let i = 0; i < this.bands.length; i++) {
            const band = this.bands[i];
            
            if (this.params.wave) {
                // 波浪效果
                const waveY = Math.sin(this.time + band.offset) * this.params.waveAmplitude;
                this.drawWaveBand(ctx, band, waveY);
            } else {
                // 直线条带
                this.drawStraightBand(ctx, band);
            }
        }
        
        ctx.restore();
    }
    
    drawWaveBand(ctx, band, waveY) {
        ctx.beginPath();
        
        const segments = 50;
        const segmentWidth = this.canvas.width / segments;
        
        for (let i = 0; i <= segments; i++) {
            const x = band.x + i * segmentWidth;
            const normalizedX = ((x % this.canvas.width) + this.canvas.width) % this.canvas.width;
            const y = band.y + waveY + Math.sin(i * this.params.waveFrequency + this.time) * this.params.waveAmplitude;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        const alpha = this.params.transparency * (0.5 + 0.5 * Math.sin(this.time + band.offset));
        ctx.strokeStyle = `hsla(${band.hue}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = this.params.bandHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // 光晕效果
        if (this.params.glow) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsla(${band.hue}, 80%, 60%, ${alpha})`;
        }
    }
    
    drawStraightBand(ctx, band) {
        let gradient;
        
        if (this.params.gradientType === 'vertical') {
            gradient = ctx.createLinearGradient(
                0, band.y,
                0, band.y + this.params.bandHeight
            );
        } else {
            gradient = ctx.createLinearGradient(
                band.x, band.y,
                band.x + this.canvas.width, band.y
            );
        }
        
        const alpha = this.params.transparency;
        gradient.addColorStop(0, `hsla(${band.hue}, 80%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${band.hue}, 80%, 60%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${band.hue}, 80%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(band.x, band.y, this.canvas.width, this.params.bandHeight);
    }
}

window.ColorBand = ColorBand;
