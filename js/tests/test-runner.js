/**
 * tests/test-runner.js - 测试框架
 * 功能：运行单元测试、集成测试、性能测试
 * 版本：v4.0
 */

const TestRunner = (function() {
    'use strict';
    
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        tests: [],
        startTime: null,
        endTime: null
    };
    
    let currentSuite = '';
    
    /**
     * 断言函数
     */
    function assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    /**
     * 断言相等
     */
    function assertEquals(actual, expected, message) {
        assert(actual === expected, message || `Expected ${expected}, got ${actual}`);
    }
    
    /**
     * 断言对象相等
     */
    function assertDeepEqual(actual, expected, message) {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        assert(actualStr === expectedStr, message || `Objects not equal`);
    }
    
    /**
     * 断言抛出错误
     */
    function assertThrows(fn, message) {
        let threw = false;
        try {
            fn();
        } catch (e) {
            threw = true;
        }
        assert(threw, message || 'Expected function to throw');
    }
    
    /**
     * 测试套件
     */
    function describe(name, fn) {
        currentSuite = name;
        console.group(`\n📋 ${name}`);
        fn();
        console.groupEnd();
    }
    
    /**
     * 单个测试
     */
    function it(name, fn) {
        results.total++;
        
        try {
            fn();
            results.passed++;
            results.tests.push({
                suite: currentSuite,
                name,
                status: 'passed',
                time: 0
            });
            console.log(`  ✅ ${name}`);
        } catch (error) {
            results.failed++;
            results.tests.push({
                suite: currentSuite,
                name,
                status: 'failed',
                error: error.message,
                stack: error.stack
            });
            console.error(`  ❌ ${name}`);
            console.error(`     ${error.message}`);
        }
    }
    
    /**
     * 跳过的测试
     */
    function itSkip(name, fn) {
        results.skipped++;
        results.tests.push({
            suite: currentSuite,
            name,
            status: 'skipped'
        });
        console.log(`  ⏭️  ${name}`);
    }
    
    /**
     * 异步测试
     */
    async function itAsync(name, fn) {
        results.total++;
        const startTime = performance.now();
        
        try {
            await fn();
            const endTime = performance.now();
            results.passed++;
            results.tests.push({
                suite: currentSuite,
                name,
                status: 'passed',
                time: endTime - startTime
            });
            console.log(`  ✅ ${name} (${(endTime - startTime).toFixed(2)}ms)`);
        } catch (error) {
            results.failed++;
            results.tests.push({
                suite: currentSuite,
                name,
                status: 'failed',
                error: error.message,
                stack: error.stack
            });
            console.error(`  ❌ ${name}`);
            console.error(`     ${error.message}`);
        }
    }
    
    /**
     * 测试前钩子
     */
    function beforeEach(fn) {
        // 存储钩子，在实际运行时调用
        if (!window.__testHooks__) window.__testHooks__ = {};
        window.__testHooks__.beforeEach = fn;
    }
    
    /**
     * 测试后钩子
     */
    function afterEach(fn) {
        if (!window.__testHooks__) window.__testHooks__ = {};
        window.__testHooks__.afterEach = fn;
    }
    
    /**
     * 运行测试报告
     */
    function report() {
        results.endTime = Date.now();
        const duration = results.endTime - results.startTime;
        
        console.group('\n📊 Test Report');
        console.log(`Total Tests: ${results.total}`);
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`⏭️  Skipped: ${results.skipped}`);
        console.log(`⏱️  Duration: ${duration.toFixed(2)}ms`);
        
        const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(2) : 0;
        console.log(`📈 Pass Rate: ${passRate}%`);
        
        if (results.failed > 0) {
            console.error('\n❌ Failed Tests:');
            results.tests.filter(t => t.status === 'failed').forEach(t => {
                console.error(`  - ${t.suite}: ${t.name}`);
                console.error(`    ${t.error}`);
            });
        }
        
        console.groupEnd();
        
        return {
            ...results,
            duration,
            passRate: parseFloat(passRate)
        };
    }
    
    /**
     * 运行所有测试
     */
    async function run(testSuite) {
        results.startTime = Date.now();
        console.log('\n🚀 Starting Tests...\n');
        
        if (testSuite && typeof testSuite === 'function') {
            await testSuite();
        } else if (window.__testSuite__) {
            await window.__testSuite__();
        }
        
        return report();
    }
    
    /**
     * 导出测试结果到 HTML
     */
    function exportToHTML() {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: #e0e0e0; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat { background: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 36px; font-weight: bold; margin-bottom: 10px; }
        .stat-label { font-size: 14px; color: #888; }
        .passed { color: #00ff00; }
        .failed { color: #ff0044; }
        .test { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #444; }
        .test.passed { border-left-color: #00ff00; }
        .test.failed { border-left-color: #ff0044; }
        .test-name { font-weight: bold; margin-bottom: 5px; }
        .test-error { color: #ff0044; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🧪 Test Report</h1>
    <div class="summary">
        <div class="stat">
            <div class="stat-value">${results.total}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="stat">
            <div class="stat-value passed">${results.passed}</div>
            <div class="stat-label">Passed</div>
        </div>
        <div class="stat">
            <div class="stat-value failed">${results.failed}</div>
            <div class="stat-label">Failed</div>
        </div>
        <div class="stat">
            <div class="stat-value">${((results.passed / results.total) * 100).toFixed(2)}%</div>
            <div class="stat-label">Pass Rate</div>
        </div>
    </div>
    <h2>Test Details</h2>
    ${results.tests.map(t => `
        <div class="test ${t.status}">
            <div class="test-name">${t.status === 'passed' ? '✅' : '❌'} ${t.suite}: ${t.name}</div>
            ${t.error ? `<div class="test-error">${t.error}</div>` : ''}
        </div>
    `).join('')}
</body>
</html>
        `;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        return url;
    }
    
    return {
        assert,
        assertEquals,
        assertDeepEqual,
        assertThrows,
        describe,
        it,
        itSkip,
        itAsync,
        beforeEach,
        afterEach,
        run,
        report,
        exportToHTML
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
}
