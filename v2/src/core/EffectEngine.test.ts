import { describe, it, expect } from 'vitest';
import { EffectEngine } from '../core/EffectEngine';

describe('EffectEngine', () => {
  it('should create engine instance', () => {
    const canvas = document.createElement('canvas');
    const engine = new EffectEngine(canvas);
    expect(engine).toBeDefined();
  });

  it('should initialize with correct canvas size', () => {
    const canvas = document.createElement('canvas');
    const engine = new EffectEngine(canvas);
    
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });

  it('should return empty effects list initially', () => {
    const canvas = document.createElement('canvas');
    const engine = new EffectEngine(canvas);
    
    const effects = engine.getAvailableEffects();
    expect(effects).toEqual([]);
  });

  it('should register effect successfully', () => {
    const canvas = document.createElement('canvas');
    const engine = new EffectEngine(canvas);
    
    class TestEffect {
      name = 'TestEffect';
      params = {};
      initialized = false;
      needsTrail = false;
      
      async init() { this.initialized = true; }
      update() {}
      render() {}
      onResize() {}
      destroy() {}
      updateParams() {}
      reset() {}
    }
    
    engine.registerEffect('TestEffect', TestEffect as any);
    const effects = engine.getAvailableEffects();
    
    expect(effects).toContain('TestEffect');
  });
});
