import { useEffect, useRef, useCallback } from 'react';
import { EffectEngine } from './core/EffectEngine';
import { useAppStore } from './store';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { StatusBar } from './components/StatusBar';
import { ToastContainer } from './components/Toast';
import type { IEffect } from './types';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EffectEngine | null>(null);
  
  const { 
    currentEffect, 
    fps, 
    isPaused, 
    settings,
    setCurrentEffect, 
    setAvailableEffects, 
    setFPS,
    addToast 
  } = useAppStore();

  // 初始化引擎
  useEffect(() => {
    if (!canvasRef.current) return;

    let isMounted = true;
    let engine: EffectEngine | null = null;

    try {
      engine = new EffectEngine(canvasRef.current);
      engineRef.current = engine;
      
      // FPS 更新监听
      const handleFPSUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<{ fps: number }>;
        if (isMounted) {
          setFPS(customEvent.detail.fps);
        }
      };
      
      canvasRef.current.addEventListener('fps-update', handleFPSUpdate);
      
      // 特效加载事件
      const handleEffectLoaded = (e: Event) => {
        const customEvent = e as CustomEvent<{ name: string }>;
        if (isMounted && engine) {
          setCurrentEffect(customEvent.detail.name, engine.getCurrentEffectInstance());
          addToast({
            type: 'success',
            message: `已加载：${customEvent.detail.name}`
          });
        }
      };
      
      canvasRef.current.addEventListener('effect-loaded', handleEffectLoaded);
      
      // 特效卸载事件
      const handleEffectUnloaded = () => {
        if (isMounted) {
          setCurrentEffect(null, null);
        }
      };
      
      canvasRef.current.addEventListener('effect-unloaded', handleEffectUnloaded);
      
      // 更新可用特效列表
      const effects = engine.getAvailableEffects();
      setAvailableEffects(effects);
      
      // 加载第一个特效
      if (effects.length > 0 && isMounted) {
        engine.loadEffect(effects[0]);
      }

      return () => {
        isMounted = false;
        canvasRef.current?.removeEventListener('fps-update', handleFPSUpdate);
        canvasRef.current?.removeEventListener('effect-loaded', handleEffectLoaded);
        canvasRef.current?.removeEventListener('effect-unloaded', handleEffectUnloaded);
        engine?.destroy();
        engineRef.current = null;
      };
    } catch (error) {
      console.error('初始化引擎失败:', error);
      if (isMounted) {
        addToast({
          type: 'error',
          message: `初始化引擎失败：${error}`
        });
      }
    }
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      // 如果按下的是空格键且焦点在输入框，不处理
      if (e.key === ' ' && (e.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft': {
          e.preventDefault();
          const current = engineRef.current.getCurrentEffect();
          const effects = engineRef.current.getAvailableEffects();
          if (current && effects.length > 0) {
            const currentIndex = effects.indexOf(current);
            const prevIndex = (currentIndex - 1 + effects.length) % effects.length;
            engineRef.current.loadEffect(effects[prevIndex]);
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          const current = engineRef.current.getCurrentEffect();
          const effects = engineRef.current.getAvailableEffects();
          if (current && effects.length > 0) {
            const currentIndex = effects.indexOf(current);
            const nextIndex = (currentIndex + 1) % effects.length;
            engineRef.current.loadEffect(effects[nextIndex]);
          }
          break;
        }
        case ' ':
          e.preventDefault();
          engineRef.current.togglePause();
          break;
        case 'f':
        case 'F':
          if (!e.ctrlKey && !e.metaKey) {
            document.body.classList.toggle('fullscreen');
          }
          break;
        case 'h':
        case 'H':
          if (!e.ctrlKey && !e.metaKey) {
            // TODO: 显示帮助
            addToast({
              type: 'info',
              message: '帮助功能开发中...'
            });
          }
          break;
        case 'Escape':
          document.body.classList.remove('fullscreen');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToast]);

  // 加载特效
  const loadEffect = useCallback(async (effectName: string) => {
    if (!engineRef.current) return;
    
    try {
      await engineRef.current.loadEffect(effectName);
    } catch (error) {
      console.error('加载特效失败:', error);
      addToast({
        type: 'error',
        message: `加载特效失败：${error}`
      });
    }
  }, []);

  return (
    <div className="app">
      <canvas 
        ref={canvasRef} 
        id="canvas"
        className="fixed inset-0 w-full h-full"
      />
      
      <div className="ui-overlay relative w-full h-full pointer-events-none">
        <Header />
        <ControlPanel 
          onLoadEffect={loadEffect}
        />
        <StatusBar 
          fps={fps}
          currentEffect={currentEffect}
          isPaused={isPaused}
        />
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default App;
