import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

export function StatusBar() {
  const { system, fps, currentEffect, isPaused, updateSystemStats } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 定期更新系统统计
  useEffect(() => {
    const interval = setInterval(updateSystemStats, 2000);
    return () => clearInterval(interval);
  }, [updateSystemStats]);

  // 更新时间
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 格式化运行时间
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getFPSClass = (fps: number) => {
    if (fps >= 50) return 'text-[#00ff88]';
    if (fps >= 30) return 'text-[#ffcc00]';
    return 'text-[#ff4466]';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[rgba(5,5,16,0.95)] border-t border-[rgba(0,255,255,0.3)] px-2 md:px-4 py-1.5 md:py-2 z-[20] backdrop-blur-sm">
      {/* 桌面端完整状态栏 */}
      <div className="hidden md:flex items-center justify-between text-xs">
        {/* 左侧：系统状态 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">CPU:</span>
            <span className="text-[var(--primary-green)]">{system.cpuUsage}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">MEM:</span>
            <span className="text-[var(--primary-green)]">{system.memoryUsage}GB</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">LATENCY:</span>
            <span className="text-[var(--primary-green)]">{system.networkLatency}ms</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">PACKETS:</span>
            <span className="text-[var(--primary-green)]">{system.packetCount}</span>
          </div>
        </div>

        {/* 中间：运行时间和状态 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">UPTIME:</span>
            <span className="text-[var(--primary-cyan)] font-bold">{formatUptime(system.uptime)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">FPS:</span>
            <span className={`font-bold ${getFPSClass(fps)}`}>{fps}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">EFFECT:</span>
            <span className="text-[var(--primary-green)]">{currentEffect || 'NONE'}</span>
          </div>
          
          {isPaused && (
            <div className="text-[#ffcc00] animate-pulse">
              ⏸ PAUSED
            </div>
          )}
        </div>

        {/* 右侧：时间和模式 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">MODE:</span>
            <span className="text-[var(--primary-cyan)] uppercase">{system.currentMode}</span>
          </div>
          
          <div className="text-[var(--primary-green)]">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* 移动端简化状态栏 */}
      <div className="md:hidden flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-3">
          <span className="text-[var(--primary-green)]">CPU {system.cpuUsage}%</span>
          <span className="text-[var(--primary-green)]">MEM {system.memoryUsage}GB</span>
          <span className={`font-bold ${getFPSClass(fps)}`}>FPS {fps}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[var(--primary-cyan)]">{formatUptime(system.uptime)}</span>
          {isPaused && <span className="text-[#ffcc00]">⏸</span>}
          <span className="text-[var(--primary-green)]">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>
    </div>
  );
}
