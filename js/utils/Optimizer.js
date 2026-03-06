/**
 * Optimizer.js - 性能优化工具函数库
 * 功能：防抖、节流、缓存、懒加载等性能优化函数
 * 版本：v4.0
 * 作者：QHT System
 */

const Optimizer = (function() {
    'use strict';
    
    /**
     * 防抖函数 - n 秒后只执行一次
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @param {boolean} immediate - 是否立即执行
     * @returns {Function} 防抖后的函数
     */
    function debounce(func, wait, immediate = false) {
        let timeout;
        
        return function executedFunction(...args) {
            const context = this;
            
            const later = () => {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
    
    /**
     * 节流函数 - n 秒内只执行一次
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制（毫秒）
     * @param {boolean} noTrailing - 是否执行最后一次
     * @returns {Function} 节流后的函数
     */
    function throttle(func, limit, noTrailing = false) {
        let lastFunc;
        let lastRan;
        
        return function(...args) {
            const context = this;
            
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    /**
     * 请求动画帧防抖 - 使用 RAF 优化性能
     * @param {Function} func - 要防抖的函数
     * @returns {Function} 优化后的函数
     */
    function rafDebounce(func) {
        let frame;
        
        return function(...args) {
            if (frame) {
                cancelAnimationFrame(frame);
            }
            
            frame = requestAnimationFrame(() => {
                func.apply(this, args);
                frame = null;
            });
        };
    }
    
    /**
     * 缓存函数结果 - 记忆化
     * @param {Function} func - 要缓存的函数
     * @param {Function} resolver - 自定义缓存键生成函数
     * @returns {Function} 带缓存的函数
     */
    function memoize(func, resolver) {
        const cache = new Map();
        
        return function(...args) {
            const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
            
            if (cache.has(key)) {
                return cache.get(key);
            }
            
            const result = func.apply(this, args);
            cache.set(key, result);
            
            return result;
        };
    }
    
    /**
     * LRU 缓存 - 最近最少使用缓存
     */
    class LRUCache {
        constructor(maxSize = 100) {
            this.maxSize = maxSize;
            this.cache = new Map();
        }
        
        get(key) {
            if (!this.cache.has(key)) {
                return undefined;
            }
            
            const value = this.cache.get(key);
            // 移到最新
            this.cache.delete(key);
            this.cache.set(key, value);
            
            return value;
        }
        
        set(key, value) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.maxSize) {
                // 删除最旧的
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            
            this.cache.set(key, value);
        }
        
        has(key) {
            return this.cache.has(key);
        }
        
        delete(key) {
            return this.cache.delete(key);
        }
        
        clear() {
            this.cache.clear();
        }
        
        size() {
            return this.cache.size;
        }
    }
    
    /**
     * 懒加载图片
     * @param {string} selector - 图片选择器
     * @param {Object} options - 选项
     */
    function lazyLoadImages(selector = 'img[data-src]', options = {}) {
        const {
            rootMargin = '0px',
            threshold = 0.01
        } = options;
        
        if (!('IntersectionObserver' in window)) {
            // 降级处理
            document.querySelectorAll(selector).forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
            return;
        }
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            });
        }, { rootMargin, threshold });
        
        document.querySelectorAll(selector).forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    /**
     * 懒加载组件
     * @param {string} selector - 组件选择器
     * @param {Function} loadFn - 加载函数
     */
    function lazyLoadComponent(selector, loadFn) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFn(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * 预加载资源
     * @param {Array<string>} resources - 资源 URL 列表
     * @param {string} type - 资源类型
     */
    function preloadResources(resources, type = 'fetch') {
        resources.forEach(url => {
            if (type === 'image') {
                const img = new Image();
                img.src = url;
            } else if (type === 'script') {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                document.head.appendChild(script);
            } else if (type === 'style') {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = url;
                document.head.appendChild(link);
            } else {
                fetch(url, { priority: 'high' });
            }
        });
    }
    
    /**
     * 批量处理 - 减少 DOM 操作
     * @param {Array} items - 数据项
     * @param {Function} processor - 处理函数
     * @param {number} batchSize - 批次大小
     */
    async function batchProcess(items, processor, batchSize = 10) {
        const results = [];
        
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(processor));
            results.push(...batchResults);
            
            // 让出主线程
            if (i + batchSize < items.length) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        return results;
    }
    
    /**
     * 时间切片 - 避免长时间阻塞主线程
     * @param {Array} tasks - 任务列表
     * @param {number} timeSlice - 时间切片（毫秒）
     */
    async function timeSlicing(tasks, timeSlice = 16) {
        const results = [];
        
        for (let i = 0; i < tasks.length; i++) {
            const startTime = performance.now();
            
            results.push(await tasks[i]());
            
            // 如果超过时间切片，让出主线程
            if (performance.now() - startTime > timeSlice) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        return results;
    }
    
    /**
     * 虚拟滚动 - 优化长列表渲染
     * @param {Object} options - 选项
     */
    function virtualScroll(options) {
        const {
            container,
            itemHeight,
            renderItem,
            totalItems
        } = options;
        
        const visibleCount = Math.ceil(container.clientHeight / itemHeight);
        const content = document.createElement('div');
        content.style.height = `${totalItems * itemHeight}px`;
        content.style.position = 'relative';
        
        container.appendChild(content);
        
        function render() {
            const scrollTop = container.scrollTop;
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleCount, totalItems);
            
            content.innerHTML = '';
            content.style.transform = `translateY(${startIndex * itemHeight}px)`;
            
            for (let i = startIndex; i < endIndex; i++) {
                const item = renderItem(i);
                item.style.position = 'absolute';
                item.style.top = '0';
                item.style.height = `${itemHeight}px`;
                content.appendChild(item);
            }
        }
        
        container.addEventListener('scroll', rafDebounce(render));
        render();
        
        return { render };
    }
    
    /**
     * 性能监控
     * @returns {Object} 监控 API
     */
    function performanceMonitor() {
        const metrics = {
            fps: 60,
            frameCount: 0,
            lastTime: performance.now()
        };
        
        function measureFPS() {
            const now = performance.now();
            metrics.frameCount++;
            
            if (now - metrics.lastTime >= 1000) {
                metrics.fps = metrics.frameCount;
                metrics.frameCount = 0;
                metrics.lastTime = now;
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        measureFPS();
        
        return {
            getFPS: () => metrics.fps,
            getMetrics: () => ({ ...metrics })
        };
    }
    
    /**
     * 内存监控
     * @returns {Object|null} 内存信息
     */
    function memoryMonitor() {
        if (!performance.memory) {
            return null;
        }
        
        return {
            getUsage: () => ({
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            }),
            getUsedMB: () => (performance.memory.usedJSHeapSize / 1048576).toFixed(2)
        };
    }
    
    /**
     * 资源加载监控
     * @returns {Object} 加载信息
     */
    function resourceMonitor() {
        return {
            getLoadTime: () => {
                if (performance.timing) {
                    const { navigationStart } = performance.timing;
                    const { loadEventEnd } = performance.timing;
                    return loadEventEnd - navigationStart;
                }
                return 0;
            },
            
            getResourceCount: () => {
                return performance.getEntriesByType('resource').length;
            },
            
            getResourceTypes: () => {
                const resources = performance.getEntriesByType('resource');
                const types = {};
                
                resources.forEach(resource => {
                    const type = resource.initiatorType;
                    types[type] = (types[type] || 0) + 1;
                });
                
                return types;
            }
        };
    }
    
    // 公开 API
    return {
        // 函数优化
        debounce,
        throttle,
        rafDebounce,
        memoize,
        
        // 缓存
        LRUCache,
        
        // 懒加载
        lazyLoadImages,
        lazyLoadComponent,
        
        // 预加载
        preloadResources,
        
        // 批量处理
        batchProcess,
        timeSlicing,
        
        // 虚拟滚动
        virtualScroll,
        
        // 监控
        performanceMonitor,
        memoryMonitor,
        resourceMonitor
    };
})();

// 导出到全局
if (typeof window !== 'undefined') {
    window.Optimizer = Optimizer;
}
