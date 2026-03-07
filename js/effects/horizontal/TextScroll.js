/**
 * TextScroll - Enhanced 横向滚动文字特效（增强版）
 * 增加了：多层文字、垂直位置、文字内容自定义、渐变方向、闪烁效果
 */

class TextScroll extends BaseEffect {
    get name() { return 'TextScroll'; }
    
    get defaultParams() {
        return {
            scrollSpeed: 50,
            fontSize: 24,
            text: 'VISUAL EFFECTS LAB',
            spacing: 300,
            baseHue: 180,
            glow: true,
            layers: 3,
            verticalPosition: 0.5,
            textGradient: true,
            gradientDirection: 'vertical',
            blink: false,
            blinkSpeed: 2,
            waveMotion: false,
            waveAmplitude: 10,
            waveSpeed: 2
        };
    }
    
    async init() {
        await super.init();
        this.texts = [];
        this.font = `bold ${this.params.fontSize}px 'Courier New', monospace`;
        this.time = 0;
        
        // 初始化多层文字
        for (let layer = 0; layer < this.params.layers; layer++) {
            const layerTexts = [];
            const textCount = Math.ceil(this.canvas.width / this.params.spacing) + 2;
            const yOffset = (layer - (this.params.layers - 1) / 2) * (this.params.fontSize * 1.5);
            
            for (let i = 0; i < textCount; i++) {
                layerTexts.push({
                    x: i * this.params.spacing,
                    y: this.canvas.height * this.params.verticalPosition + yOffset,
                    text: this.params.text,
                    hue: (this.params.baseHue + layer * 40 + i * 20) % 360,
                    alpha: 1 - (layer / this.params.layers) * 0.5
                });
            }
            this.texts.push(layerTexts);
        }
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        
        // 移动所有层文字
        for (const layerTexts of this.texts) {
            for (const text of layerTexts) {
                text.x -= this.params.scrollSpeed * deltaTime;
                
                // 波浪运动
                if (this.params.waveMotion) {
                    text.y += Math.sin(this.time * this.params.waveSpeed + text.x * 0.01) * 
                             this.params.waveAmplitude * deltaTime;
                }
            }
        }
        
        // 循环文字
        for (const layerTexts of this.texts) {
            const textWidth = this.ctx.measureText(this.params.text).width;
            for (let i = 0; i < layerTexts.length; i++) {
                if (layerTexts[i].x + textWidth < 0) {
                    const lastText = layerTexts[layerTexts.length - 1];
                    layerTexts[i].x = lastText.x + this.params.spacing;
                    layerTexts[i].hue = (lastText.hue + 20) % 360;
                }
            }
        }
    }
    
    render(ctx) {
        ctx.font = this.font;
        ctx.textBaseline = 'middle';
        
        for (let layerIndex = 0; layerIndex < this.texts.length; layerIndex++) {
            const layerTexts = this.texts[layerIndex];
            const layerAlpha = 1 - (layerIndex / this.params.layers) * 0.5;
            
            for (const text of layerTexts) {
                // 闪烁效果
                let currentAlpha = text.alpha * layerAlpha;
                if (this.params.blink) {
                    currentAlpha *= (0.5 + 0.5 * Math.sin(this.time * this.params.blinkSpeed * Math.PI));
                }
                
                if (this.params.glow) {
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = `hsla(${text.hue}, 80%, 60%, ${currentAlpha})`;
                }
                
                if (this.params.textGradient) {
                    let gradient;
                    if (this.params.gradientDirection === 'horizontal') {
                        gradient = ctx.createLinearGradient(
                            text.x, text.y,
                            text.x + ctx.measureText(text.text).width, text.y
                        );
                    } else {
                        gradient = ctx.createLinearGradient(
                            text.x, text.y - 20,
                            text.x, text.y + 20
                        );
                    }
                    
                    gradient.addColorStop(0, `hsla(${text.hue}, 80%, 70%, 0)`);
                    gradient.addColorStop(0.5, `hsla(${text.hue}, 80%, 60%, ${currentAlpha})`);
                    gradient.addColorStop(1, `hsla(${text.hue}, 80%, 70%, 0)`);
                    
                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = `hsla(${text.hue}, 80%, 60%, ${currentAlpha})`;
                }
                
                ctx.fillText(text.text, text.x, text.y);
            }
        }
        
        ctx.shadowBlur = 0;
    }
    
    onResize() {
        const textCount = Math.ceil(this.canvas.width / this.params.spacing) + 2;
        for (let layerIndex = 0; layerIndex < this.texts.length; layerIndex++) {
            const layerTexts = this.texts[layerIndex];
            const yOffset = (layerIndex - (this.params.layers - 1) / 2) * (this.params.fontSize * 1.5);
            
            if (layerTexts.length < textCount) {
                for (let i = layerTexts.length; i < textCount; i++) {
                    const lastText = layerTexts[layerTexts.length - 1];
                    layerTexts.push({
                        x: lastText.x + this.params.spacing,
                        y: this.canvas.height * this.params.verticalPosition + yOffset,
                        text: this.params.text,
                        hue: (lastText.hue + 20) % 360,
                        alpha: 1 - (layerIndex / this.params.layers) * 0.5
                    });
                }
            }
        }
    }
}

window.TextScroll = TextScroll;
