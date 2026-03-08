import { useAppStore } from '../store';
import { useSound } from '../hooks/useSound';
import { quickActions as defaultQuickActions } from '../config/commands';

export function QuickActions() {
  const { system, clearLogs, toggleAudio, addLog } = useAppStore();
  const { playSound } = useSound();

  const handleAction = (id: string) => {
    if (system.audioEnabled) {
      playSound('key-press');
    }

    switch (id) {
      case 'panic':
        addLog('⚠️ EMERGENCY STOP ACTIVATED', 'warning');
        break;
      case 'clear':
        clearLogs();
        addLog('Logs cleared', 'info');
        break;
      case 'fullscreen':
        document.body.classList.toggle('fullscreen');
        addLog('Toggled fullscreen mode', 'info');
        break;
      case 'audio':
        toggleAudio();
        addLog(`Audio ${system.audioEnabled ? 'disabled' : 'enabled'}`, 'info');
        break;
      case 'matrix':
        addLog('Matrix protocol initiated...', 'system');
        break;
      case 'network':
        addLog('Network mapping started...', 'system');
        break;
      case 'breach':
        addLog('Firewall breach attempt...', 'warning');
        break;
      case 'selfdestruct':
        addLog('☢️ SELF-DESTRUCT SEQUENCE ACTIVATED', 'error');
        break;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {defaultQuickActions.map(action => (
        <button
          key={action.id}
          onClick={() => handleAction(action.id)}
          className="flex flex-col items-center justify-center p-3 rounded border-2 transition-all duration-150 bg-[rgba(10,10,30,0.8)] backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
          style={{ borderColor: action.color }}
        >
          <span className="text-2xl mb-1">{action.icon}</span>
          <span className="text-[10px] text-[var(--text-secondary)] text-center leading-tight">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
