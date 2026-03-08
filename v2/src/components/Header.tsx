/**
 * Header 组件
 */

export function Header() {
  return (
    <header className="absolute top-0 left-0 w-full p-5 z-[20] pointer-events-auto backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/70 to-transparent">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-cyan)] tracking-[4px] drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            VISUAL EFFECTS LAB
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-80">
            代码生成的视觉特效展示平台
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* TODO: 添加主题切换、设置等按钮 */}
        </div>
      </div>
    </header>
  );
}
