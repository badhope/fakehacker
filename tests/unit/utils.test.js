/**
 * 单元测试 - Utils 工具函数
 */

(function() {
    console.log('🧪 开始运行 Utils 单元测试...');
    
    let passed = 0;
    let failed = 0;
    
    function assert(condition, testName) {
        if (condition) {
            console.log(`✅ ${testName}`);
            passed++;
        } else {
            console.error(`❌ ${testName}`);
            failed++;
        }
    }
    
    // 测试 randomRange
    assert(
        Utils.randomRange(0, 10) >= 0 && Utils.randomRange(0, 10) <= 10,
        'randomRange 返回正确范围的值'
    );
    
    // 测试 clamp
    assert(Utils.clamp(-5, 0, 10) === 0, 'clamp 限制最小值');
    assert(Utils.clamp(15, 0, 10) === 10, 'clamp 限制最大值');
    assert(Utils.clamp(5, 0, 10) === 5, 'clamp 保持中间值');
    
    // 测试 lerp
    assert(Utils.lerp(0, 100, 0.5) === 50, 'lerp 计算中点');
    assert(Utils.lerp(0, 100, 0) === 0, 'lerp 返回起点');
    assert(Utils.lerp(0, 100, 1) === 100, 'lerp 返回终点');
    
    // 测试 degToRad
    assert(Math.abs(Utils.degToRad(180) - Math.PI) < 0.0001, 'degToRad 180 度等于π');
    assert(Math.abs(Utils.degToRad(90) - Math.PI / 2) < 0.0001, 'degToRad 90 度等于π/2');
    
    // 测试 radToDeg
    assert(Utils.radToDeg(Math.PI) === 180, 'radToDeg π等于 180 度');
    assert(Utils.radToDeg(Math.PI / 2) === 90, 'radToDeg π/2 等于 90 度');
    
    // 测试 hsl
    assert(Utils.hsl(180, 80, 60) === 'hsla(180, 80%, 60%, 1)', 'hsl 生成正确格式');
    assert(Utils.hsl(180, 80, 60, 0.5) === 'hsla(180, 80%, 60%, 0.5)', 'hsl 支持透明度');
    
    // 测试 rgb
    assert(Utils.rgb(255, 128, 64) === 'rgba(255, 128, 64, 1)', 'rgb 生成正确格式');
    assert(Utils.rgb(255, 128, 64, 0.8) === 'rgba(255, 128, 64, 0.8)', 'rgb 支持透明度');
    
    // 测试 distance
    assert(Utils.distance(0, 0, 3, 4) === 5, 'distance 计算 3-4-5 三角形');
    assert(Utils.distance(0, 0, 0, 0) === 0, 'distance 同一点为 0');
    
    // 测试 sine
    assert(Math.abs(Utils.sine(0.25, 1, 1, 0) - 1) < 0.0001, 'sine 四分之一周期为 1');
    assert(Math.abs(Utils.sine(0, 1, 1, 0)) < 0.0001, 'sine 零点为 0');
    
    // 测试 map
    assert(Utils.map(5, 0, 10, 0, 100) === 50, 'map 映射到一半位置');
    assert(Utils.map(0, 0, 10, 0, 100) === 0, 'map 映射到起点');
    assert(Utils.map(10, 0, 10, 0, 100) === 100, 'map 映射到终点');
    
    console.log('\n=================================');
    console.log(`测试结果：${passed} 通过，${failed} 失败`);
    console.log('=================================\n');
    
    if (failed > 0) {
        throw new Error(`有 ${failed} 个测试失败`);
    }
})();
