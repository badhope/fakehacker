interface StatusBarProps {
  fps: number;
  currentEffect: string | null;
  isPaused: boolean;
}

export function StatusBar({ fps, currentEffect, isPaused }: StatusBarProps) {
  const getFPSClass = (fps: number) => {
    if (fps >= 50) return 'fps-good';
    if (fps >= 30) return 'fps-warning';
    return 'fps-bad';
  };

  return (
    <div className="absolute bottom-5 left-5 px-5 py-2.5 bg-[rgba(10,10,30,0.9)] border border-[var(--primary-cyan)] rounded text-xs backdrop-blur-sm z-[20]">
      <div className="flex items-center gap-5">
        <div className="text-[var(--primary-green)]">
          FPS: <span className={`font-bold ${getFPSClass(fps)}`}>{fps}</span>
        </div>
        <div className="text-[var(--primary-green)]">
          特效：<span className="font-bold">{currentEffect || '无'}</span>
        </div>
        <div className="text-[var(--primary-green)]">
          {isPaused && <span className="text-[var(--warning)]">⏸ 已暂停</span>}
          {!isPaused && <span>按 <kbd className="bg-[rgba(0,255,255,0.2)] px-1.5 py-0.5 rounded text-[var(--primary-cyan)] border border-[rgba(0,255,255,0.3)] font-mono">H</kbd> 查看帮助</span>}
        </div>
      </div>
    </div>
  );
}
