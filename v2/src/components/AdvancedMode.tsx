import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { numberCommands } from '../config/commands';
import { useSound } from '../hooks/useSound';

export function AdvancedMode() {
  const { executeCommand, addLog, system } = useAppStore();
  const { playSound } = useSound();
  const [input, setInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦
  useEffect(() => {
    if (system.isBooted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [system.isBooted]);

  // 点击页面保持聚焦
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('button') && 
        !target.closest('input') &&
        inputRef.current
      ) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSubmit = async () => {
    const code = input.trim();
    if (!code) return;

    // 查找数字命令
    const command = numberCommands.find(cmd => cmd.code === code);

    if (command) {
      if (system.audioEnabled) {
        playSound('key-press');
      }

      addLog(`ADVANCED MODE: Initiating ${command.name}`, 'system');

      // 执行序列
      for (const letter of command.sequence) {
        await new Promise(resolve => setTimeout(resolve, 800));
        // 这里需要导入 letterCommands
        const { letterCommands } = await import('../config/commands');
        const letterCommand = letterCommands[letter];
        if (letterCommand) {
          await executeCommand(letterCommand);
        }
      }

      // 最终消息
      setTimeout(() => {
        addLog(command.finalMessage, 'success');
        if (command.finalAction) {
          command.finalAction();
        }
      }, 500);
    } else {
      // 无效代码
      addLog(`ERROR: Invalid code sequence '${code}'`, 'error');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-[var(--text-muted)]">ADVANCED MODE</span>
        <span className="text-xs text-[var(--primary-cyan)]">[1-9]</span>
      </div>
      
      <div 
        className={`relative ${isShaking ? 'animate-shake' : ''}`}
        style={{
          animation: isShaking ? 'shake 0.5s' : 'none'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入代码序列 (1-9)..."
          className="w-full px-4 py-3 bg-[rgba(5,5,16,0.95)] border-2 border-[var(--primary-cyan)] rounded text-[var(--primary-cyan)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-green)] transition-colors font-mono"
          maxLength={1}
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          ENTER
        </div>
      </div>

      <div className="mt-2 text-[10px] text-[var(--text-muted)]">
        可用序列: 1=快速扫描, 2=网络入侵, 3=数据窃取, 4=系统接管, 5=全面攻击, 6=隐身模式, 7=矩阵觉醒, 8=量子突破, 9=自毁程序
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
