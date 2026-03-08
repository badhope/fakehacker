import { useEffect, useRef, useState, useCallback } from 'react';
import { EffectEngine } from './core/EffectEngine';
import { useAppStore } from './store';
import { BootSequence } from './components/BootSequence';
import { Header } from './components/Header';
import { LetterButtons } from './components/LetterButtons';
import { LogConsole } from './components/LogConsole';
import { StatusBar } from './components/StatusBar';
import { QuickActions } from './components/QuickActions';
import { AdvancedMode } from './components/AdvancedMode';
import { ToastContainer } from './components/Toast';
import { letterCommands } from './config/commands';
import { useSound } from './hooks/useSound';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EffectEngine | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    system,
    currentEffect, 
    fps, 
    isPaused, 
    setCurrentEffect, 
    setAvailableEffects, 
    setFPS,
    executeCommand,
    highlightButton,
    clearHighlight,
    addLog,
    addToast
  } = useAppStore();

  const { playSound } = useSound();

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(isMobileDevice);
      if (isMobileDevice) {
        setShowSidebar(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 模拟加载完成
    const timer = setTimeout(() => setIsLoading(false), 500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // 初始化引擎
  useEffect(() => {
    if (!canvasRef.current || !system.isBooted) return;

    let isMounted = true;
    let engine: EffectEngine | null = null;

    const initEngine = async () => {
      try {
        engine = new EffectEngine(canvasRef.current!);
        engineRef.current = engine;
        
        const handleFPSUpdate = (e: Event) => {
          const customEvent = e as CustomEvent<{ fps: number }>;
          if (isMounted) {
            setFPS(customEvent.detail.fps);
          }
        };
        
        const handleEffectLoaded = (e: Event) => {
          const customEvent = e as CustomEvent<{ name: string }>;
          if (isMounted && engine) {
            setCurrentEffect(customEvent.detail.name, engine.getCurrentEffectInstance());
            addLog(`Effect loaded: ${customEvent.detail.name}`, 'success');
          }
        };
        
        const handleEffectUnloaded = () => {
          if (isMounted) {
            setCurrentEffect(null, null);
          }
        };
        
        canvasRef.current!.addEventListener('fps-update', handleFPSUpdate);
        canvasRef.current!.addEventListener('effect-loaded', handleEffectLoaded);
        canvasRef.current!.addEventListener('effect-unloaded', handleEffectUnloaded);
        
        const effects = engine.getAvailableEffects();
        setAvailableEffects(effects);

        return () => {
          canvasRef.current?.removeEventListener('fps-update', handleFPSUpdate);
          canvasRef.current?.removeEventListener('effect-loaded', handleEffectLoaded);
          canvasRef.current?.removeEventListener('effect-unloaded', handleEffectUnloaded);
        };
      } catch (error) {
        console.error('Engine initialization failed:', error);
        if (isMounted) {
          addLog(`Engine initialization failed: ${error}`, 'error');
          addToast({ type: 'error', message: 'Failed to initialize graphics engine' });
        }
      }
    };

    const cleanup = initEngine();

    return () => {
      isMounted = false;
      cleanup?.then?.((cleanupFn) => cleanupFn?.());
      engine?.destroy();
      engineRef.current = null;
    };
  }, [system.isBooted, setFPS, setCurrentEffect, setAvailableEffects, addLog, addToast]);

  // 键盘快捷键处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    
    // 忽略输入框中的空格
    if (e.key === ' ' && (e.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    // A-Z 字母键处理
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      if ((e.target as HTMLElement).id === 'advanced-input') return;
      
      const command = letterCommands[key];
      if (command) {
        if (system.audioEnabled) {
          playSound('key-press');
        }
        
        highlightButton(key);
        executeCommand(command);
        
        setTimeout(() => clearHighlight(), 200);
      }
    }

    // 其他快捷键
    switch (e.key) {
      case ' ':
        e.preventDefault();
        engineRef.current?.togglePause();
        break;
      case 'f':
      case 'F':
        if (!e.ctrlKey && !e.metaKey) {
          document.body.classList.toggle('fullscreen');
        }
        break;
      case 'Escape':
        document.body.classList.remove('fullscreen');
        if (isMobile) {
          setShowSidebar(false);
        }
        break;
      case 'Tab':
        if (isMobile) {
          e.preventDefault();
          setShowSidebar(!showSidebar);
        }
        break;
      case 'm':
      case 'M':
        if (!e.ctrlKey && !e.metaKey && (e.target as HTMLElement).tagName !== 'INPUT') {
          setShowSidebar(!showSidebar);
        }
        break;
    }
  }, [system.audioEnabled, playSound, executeCommand, highlightButton, clearHighlight, isMobile]);

  useEffect(() => {
    if (!system.isBooted) return;
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [system.isBooted, handleKeyDown]);

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[var(--primary-cyan)] animate-pulse mb-4">
            LOADING...
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded overflow-hidden">
            <div className="h-full bg-[var(--primary-cyan)] animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app w-full h-full overflow-hidden">
      <BootSequence />
      
      <canvas 
        ref={canvasRef} 
        id="canvas"
        className="fixed inset-0 w-full h-full bg-black"
      />
      
      {system.isBooted && (
        <div className="ui-overlay relative w-full h-full pointer-events-none">
          <Header 
            onToggleSidebar={() => setShowSidebar(!showSidebar)} 
            showSidebar={showSidebar}
            isMobile={isMobile}
          />
          
          {/* 移动端侧边栏遮罩 */}
          {isMobile && showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-[25] pointer-events-auto backdrop-blur-sm"
              onClick={() => setShowSidebar(false)}
            />
          )}
          
          <div className="flex h-[calc(100%-120px)] mt-[80px]">
            {/* 左侧面板 */}
            <div 
              className={`
                ${isMobile ? 'fixed left-0 top-[80px] bottom-[40px] z-[30]' : ''}
                ${isMobile && !showSidebar ? '-translate-x-full' : 'translate-x-0'}
                w-[350px] md:w-[350px] h-full pointer-events-auto overflow-y-auto 
                bg-[rgba(5,5,16,0.95)] backdrop-blur-md border-r border-[rgba(0,255,255,0.3)]
                transition-transform duration-300 ease-out
                scrollbar-thin scrollbar-thumb-[var(--primary-cyan)] scrollbar-track-transparent
              `}
            >
              <div className="border-b border-[rgba(0,255,255,0.3)]">
                <LetterButtons />
              </div>
              
              <div className="border-b border-[rgba(0,255,255,0.3)]">
                <QuickActions />
              </div>
              
              <AdvancedMode />
            </div>
            
            {/* 右侧日志区域 */}
            <div className="flex-1 p-2 md:p-4 pointer-events-auto h-full overflow-hidden">
              <LogConsole />
            </div>
          </div>
          
          <StatusBar />
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default App;
