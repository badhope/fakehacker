import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';

export function LogConsole() {
  const { logs, clearLogs } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-[#00ffff]';
      case 'info': return 'text-[#0088ff]';
      case 'warning': return 'text-[#ffcc00]';
      case 'error': return 'text-[#ff4466]';
      case 'success': return 'text-[#00ff88]';
      default: return 'text-[var(--text-secondary)]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[rgba(5,5,16,0.95)] border border-[rgba(0,255,255,0.3)] rounded">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(0,255,255,0.3)]">
        <h3 className="text-sm font-bold text-[var(--primary-cyan)]">
          📋 SYSTEM LOG
        </h3>
        <button
          onClick={clearLogs}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--primary-cyan)] transition-colors"
        >
          清除
        </button>
      </div>

      {/* 日志内容 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1"
        style={{ maxHeight: '300px' }}
      >
        {logs.map(log => (
          <div
            key={log.id}
            className={`${getLogColor(log.type)} animate-fade-in`}
          >
            <span className="text-[var(--text-muted)] mr-2">
              [{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}]
            </span>
            <span>&gt; {log.text}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-[var(--text-muted)] text-center py-8">
            等待系统启动...
          </div>
        )}
      </div>
    </div>
  );
}
