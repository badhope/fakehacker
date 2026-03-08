import { useState, useEffect } from 'react';
import { useAppStore } from '../store';

export function BootSequence() {
  const { system, boot, addLog } = useAppStore();
  const [showBoot, setShowBoot] = useState(!system.isBooted);
  const [bootProgress, setBootProgress] = useState(0);

  const bootMessages = [
    'INITIALIZING SYSTEM...',
    'LOADING CORE MODULES...',
    'STARTING NETWORK SERVICES...',
    'ACTIVATING SECURITY PROTOCOLS...',
    'ESTABLISHING SECURE CONNECTION...',
    'SYSTEM READY.'
  ];

  const handleBoot = async () => {
    // 逐步显示启动消息
    for (let i = 0; i < bootMessages.length; i++) {
      setBootProgress((i + 1) / bootMessages.length * 100);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 执行启动
    await boot();
    
    // 隐藏启动画面
    setTimeout(() => {
      setShowBoot(false);
    }, 500);
  };

  if (!showBoot) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] bg-[#050510] flex flex-col items-center justify-center cursor-pointer"
      onClick={handleBoot}
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-6xl font-bold text-[var(--primary-cyan)] tracking-[8px] mb-2 animate-pulse">
          VISUAL EFFECTS LAB
        </h1>
        <p className="text-lg text-[var(--text-muted)] tracking-[4px]">
          QUANTUM HACK TERMINAL v2.1
        </p>
      </div>

      {/* 进度条 */}
      {bootProgress > 0 && (
        <div className="w-[400px] mb-8">
          <div className="h-2 bg-[rgba(0,255,255,0.2)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--primary-cyan)] transition-all duration-300"
              style={{ width: `${bootProgress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-xs text-[var(--text-muted)]">
            {bootMessages[Math.floor(bootProgress / 100 * (bootMessages.length - 1))]}
          </div>
        </div>
      )}

      {/* 点击提示 */}
      {bootProgress === 0 && (
        <div className="text-center">
          <div className="text-[var(--primary-cyan)] text-sm mb-4 animate-pulse">
            [ CLICK TO START ]
          </div>
          <div className="text-[var(--text-muted)] text-xs">
            Press any key or click to initialize system
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="absolute bottom-8 text-center text-xs text-[var(--text-muted)]">
        <div>BADHOPE © 2026</div>
        <div className="mt-1">All systems nominal. Ready for deployment.</div>
      </div>
    </div>
  );
}
