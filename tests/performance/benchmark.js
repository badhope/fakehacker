/**
 * 性能基准测试
 * 测试 FPS、内存和特效切换延迟
 */

const PerformanceTest = {
    results: {},
    
    /**
     * 运行所有测试
     */
    async runAll() {
        console.log('🚀 开始性能基准测试...\n');
        
        await this.testFPS();
        await this.testEffectSwitch();
        this.testMemory();
        
        this.printResults();
    },
    
    /**
     * FPS 基准测试
     */
    async testFPS() {
        console.log('📊 测试 FPS 性能...');
        
        const fpsSamples = [];
        const duration = 5000; // 5 秒
        const startTime = performance.now();
        
        while (performance.now() - startTime < duration) {
            fpsSamples.push(engine.getFPS());
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const avgFPS = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
        const minFPS = Math.min(...fpsSamples);
        const maxFPS = Math.max(...fpsSamples);
        
        this.results.fps = {
            average: avgFPS.toFixed(2),
            min: minFPS,
            max: maxFPS,
            samples: fpsSamples.length
        };
        
        console.log(`✅ FPS: 平均=${avgFPS.toFixed(2)}, 最小=${minFPS}, 最大=${maxFPS}\n`);
    },
    
    /**
     * 特效切换延迟测试
     */
    async testEffectSwitch() {
        console.log('⏱️  测试特效切换延迟...');
        
        const switchTimes = [];
        const effectNames = engine.getAvailableEffects();
        
        for (let i = 0; i < 5; i++) {
            for (const effectName of effectNames) {
                const start = performance.now();
                await engine.loadEffect(effectName);
                const end = performance.now();
                
                switchTimes.push(end - start);
            }
        }
        
        const avgTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
        const minTime = Math.min(...switchTimes);
        const maxTime = Math.max(...switchTimes);
        
        this.results.switchDelay = {
            average: avgTime.toFixed(2),
            min: minTime.toFixed(2),
            max: maxTime.toFixed(2),
            totalSwitches: switchTimes.length
        };
        
        console.log(`✅ 切换延迟：平均=${avgTime.toFixed(2)}ms, 最小=${minTime.toFixed(2)}ms, 最大=${maxTime.toFixed(2)}ms\n`);
    },
    
    /**
     * 内存使用测试
     */
    testMemory() {
        console.log('💾 测试内存使用...');
        
        if (performance.memory) {
            const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            const totalMB = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
            const limitMB = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2);
            
            this.results.memory = {
                used: usedMB,
                total: totalMB,
                limit: limitMB,
                usage: ((usedMB / totalMB) * 100).toFixed(2) + '%'
            };
            
            console.log(`✅ 内存：使用=${usedMB}MB / ${totalMB}MB (${((usedMB / totalMB) * 100).toFixed(2)}%)\n`);
        } else {
            console.log('⚠️  浏览器不支持内存 API，跳过测试\n');
            this.results.memory = { note: '浏览器不支持内存 API' };
        }
    },
    
    /**
     * 打印测试结果
     */
    printResults() {
        console.log('\n==========================================');
        console.log('📈 性能基准测试结果');
        console.log('==========================================\n');
        
        console.log('【FPS 性能】');
        console.log(`  平均 FPS: ${this.results.fps.average}`);
        console.log(`  最小 FPS: ${this.results.fps.min}`);
        console.log(`  最大 FPS: ${this.results.fps.max}`);
        console.log(`  采样次数：${this.results.fps.samples}\n`);
        
        console.log('【切换延迟】');
        console.log(`  平均延迟：${this.results.switchDelay.average}ms`);
        console.log(`  最小延迟：${this.results.switchDelay.min}ms`);
        console.log(`  最大延迟：${this.results.switchDelay.max}ms`);
        console.log(`  总切换次数：${this.results.switchDelay.totalSwitches}\n`);
        
        console.log('【内存使用】');
        if (this.results.memory.used) {
            console.log(`  已使用：${this.results.memory.used}MB`);
            console.log(`  总量：${this.results.memory.total}MB`);
            console.log(`  使用率：${this.results.memory.usage}\n`);
        } else {
            console.log(`  ${this.results.memory.note}\n`);
        }
        
        console.log('==========================================');
        console.log('✅ 所有性能测试完成！\n');
    }
};

// 导出到全局
window.PerformanceTest = PerformanceTest;
