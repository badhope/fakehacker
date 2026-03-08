import { useAppStore } from '../store';

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-[var(--success)] bg-[rgba(0,255,136,0.1)] text-[var(--success)]';
      case 'error':
        return 'border-[var(--error)] bg-[rgba(255,68,102,0.1)] text-[var(--error)]';
      case 'warning':
        return 'border-[var(--warning)] bg-[rgba(255,204,0,0.1)] text-[var(--warning)]';
      case 'info':
        return 'border-[var(--info)] bg-[rgba(0,255,255,0.1)] text-[var(--info)]';
      default:
        return 'border-gray-500 bg-gray-900 text-white';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[1000] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`min-w-[300px] p-4 rounded border backdrop-blur-md shadow-lg pointer-events-auto animate-slide-in-right ${getToastStyles(toast.type)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-lg leading-none hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
