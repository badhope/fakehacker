import { useCallback } from 'react';

export function useSound() {
  const playSound = useCallback((type: 'key-press' | 'success' | 'error' | 'warning') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // 不同类型音效的频率
      const frequencies: Record<string, number> = {
        'key-press': 440,   // A4
        'success': 523.25,  // C5
        'error': 311.13,    // Eb4
        'warning': 392.00   // G4
      };

      oscillator.type = 'square';
      oscillator.frequency.value = frequencies[type] || 440;
      gainNode.gain.value = 0.05;

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // 忽略音频错误
    }
  }, []);

  return { playSound };
}
