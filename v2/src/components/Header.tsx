interface HeaderProps {
  onToggleSidebar?: () => void;
  showSidebar?: boolean;
}

export function Header({ onToggleSidebar, showSidebar }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full p-3 md:p-5 z-[20] pointer-events-auto backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/70 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 移动端菜单按钮 */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded border border-[var(--primary-cyan)] text-[var(--primary-cyan)] hover:bg-[rgba(0,255,255,0.1)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {showSidebar ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[var(--primary-cyan)] tracking-[2px] md:tracking-[4px] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              VISUAL EFFECTS LAB
            </h1>
            <p className="text-[10px] md:text-xs text-[var(--text-secondary)] mt-1 opacity-80 hidden sm:block">
              代码生成的视觉特效展示平台 v2.1
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* 移动端提示 */}
          <div className="md:hidden text-xs text-[var(--text-muted)]">
            按 Tab 切换面板
          </div>
          
          {/* 桌面端提示 */}
          <div className="hidden md:flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>按 <kbd className="px-1.5 py-0.5 rounded bg-[rgba(0,255,255,0.2)] text-[var(--primary-cyan)] border border-[rgba(0,255,255,0.3)]">A-Z</kbd> 执行命令</span>
            <span>按 <kbd className="px-1.5 py-0.5 rounded bg-[rgba(0,255,255,0.2)] text-[var(--primary-cyan)] border border-[rgba(0,255,255,0.3)]">F</kbd> 全屏</span>
          </div>
        </div>
      </div>
    </header>
  );
}
