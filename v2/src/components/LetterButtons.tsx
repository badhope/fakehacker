import { useAppStore } from '../store';
import { letterCommands } from '../config/commands';
import { useSound } from '../hooks/useSound';

export function LetterButtons() {
  const { executeCommand, pressButton, highlightedButton, system } = useAppStore();
  const { playSound } = useSound();

  const handleButtonClick = async (key: string) => {
    const command = letterCommands[key];
    if (!command) return;

    if (system.audioEnabled) {
      playSound('key-press');
    }

    pressButton(key);
    await executeCommand(command);
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'system': return 'border-[#00ffff] hover:bg-[rgba(0,255,255,0.2)] active:bg-[rgba(0,255,255,0.3)]';
      case 'network': return 'border-[#0088ff] hover:bg-[rgba(0,136,255,0.2)] active:bg-[rgba(0,136,255,0.3)]';
      case 'security': return 'border-[#ff00ff] hover:bg-[rgba(255,0,255,0.2)] active:bg-[rgba(255,0,255,0.3)]';
      case 'utility': return 'border-[#00ff00] hover:bg-[rgba(0,255,0,0.2)] active:bg-[rgba(0,255,0,0.3)]';
      case 'destructive': return 'border-[#ff4466] hover:bg-[rgba(255,68,102,0.2)] active:bg-[rgba(255,68,102,0.3)]';
      default: return 'border-[#666666] hover:bg-[rgba(102,102,102,0.2)] active:bg-[rgba(102,102,102,0.3)]';
    }
  };

  return (
    <div className="p-2 md:p-4">
      <div className="text-xs text-[var(--text-muted)] mb-2 text-center md:text-left">
        点击按钮或按键盘 A-Z 执行命令
      </div>
      <div className="grid grid-cols-6 md:grid-cols-6 gap-1.5 md:gap-2">
        {letters.map(letter => {
          const command = letterCommands[letter];
          const isHighlighted = highlightedButton === letter;
          
          return (
            <button
              key={letter}
              onClick={() => handleButtonClick(letter)}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('scale-95');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('scale-95');
              }}
              className={`
                relative flex flex-col items-center justify-center
                p-2 md:p-3 rounded border-2 transition-all duration-150
                bg-[rgba(10,10,30,0.8)] backdrop-blur-sm
                ${getButtonColor(command?.type || 'default')}
                ${isHighlighted ? 'scale-110 shadow-[0_0_20px_rgba(0,255,255,0.5)]' : ''}
                active:scale-95
                cursor-pointer
                touch-manipulation
                select-none
              `}
              title={command?.description}
            >
              <span className="text-lg md:text-2xl font-bold text-[var(--primary-cyan)]">
                {letter}
              </span>
              <span className="text-[8px] md:text-[10px] text-[var(--text-secondary)] mt-0.5 md:mt-1 text-center leading-tight line-clamp-2">
                {command?.name || '???'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
