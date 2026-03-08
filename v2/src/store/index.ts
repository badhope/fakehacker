/**
 * Visual Effects Lab v2.1 - 完整黑客终端状态管理
 */

import { create } from 'zustand';
import type { IEffect, EffectParams } from '../types';
import type { 
  SystemState, 
  LogEntry, 
  CommandConfig, 
  ButtonState,
  QuickAction
} from '../types/hacker';

interface AppState {
  // 黑客终端状态
  system: SystemState;
  
  // 日志系统
  logs: LogEntry[];
  maxLogs: number;
  
  // 按钮状态
  buttons: Map<string, ButtonState>;
  highlightedButton: string | null;
  
  // 当前命令
  currentCommand: CommandConfig | null;
  isExecuting: boolean;
  
  // 快速行动
  quickActions: QuickAction[];
  
  // 原有特效相关
  currentEffect: string | null;
  currentEffectInstance: IEffect | null;
  availableEffects: string[];
  fps: number;
  isPaused: boolean;
  
  // Actions - 系统
  boot: () => Promise<void>;
  shutdown: () => void;
  updateSystemStats: () => void;
  toggleAudio: () => void;
  
  // Actions - 日志
  addLog: (text: string, type: LogEntry['type']) => void;
  clearLogs: () => void;
  
  // Actions - 按钮
  pressButton: (key: string) => void;
  highlightButton: (key: string) => void;
  clearHighlight: () => void;
  
  // Actions - 命令
  executeCommand: (command: CommandConfig) => Promise<void>;
  executeNumberCommand: (code: string) => Promise<void>;
  
  // Actions - 快速行动
  registerQuickAction: (action: QuickAction) => void;
  triggerQuickAction: (id: string) => void;
  
  // 原有特效 Actions
  setCurrentEffect: (name: string | null, instance?: IEffect | null) => void;
  setAvailableEffects: (effects: string[]) => void;
  setFPS: (fps: number) => void;
  togglePause: () => void;
}

const defaultSystem: SystemState = {
  isBooted: false,
  currentMode: 'simple',
  uptime: 0,
  audioEnabled: true,
  cpuUsage: 15,
  memoryUsage: 2.5,
  networkLatency: 25,
  packetCount: 0
};

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  system: { ...defaultSystem },
  logs: [],
  maxLogs: 100,
  buttons: new Map(),
  highlightedButton: null,
  currentCommand: null,
  isExecuting: false,
  quickActions: [],
  currentEffect: null,
  currentEffectInstance: null,
  availableEffects: [],
  fps: 60,
  isPaused: false,

  // ===== 系统 Actions =====
  
  boot: async () => {
    const { addLog } = get();
    
    // 启动序列日志
    const bootLogs = [
      'Initializing system...',
      'Loading core modules...',
      'Starting network services...',
      'Activating security protocols...',
      'SYSTEM READY.'
    ];
    
    for (const log of bootLogs) {
      addLog(log, 'system');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    set(state => ({
      system: { ...state.system, isBooted: true, uptime: 0 }
    }));
    
    // 启动运行时间计数器
    setInterval(() => {
      set(state => ({
        system: { ...state.system, uptime: state.system.uptime + 1 }
      }));
    }, 1000);
  },

  shutdown: () => {
    set(state => ({
      system: { ...state.system, isBooted: false }
    }));
  },

  updateSystemStats: () => {
    set(state => ({
      system: {
        ...state.system,
        cpuUsage: Math.floor(Math.random() * 30 + 10),
        memoryUsage: Number((Math.random() * 2 + 2.5).toFixed(1)),
        networkLatency: Math.floor(Math.random() * 50 + 10),
        packetCount: Math.floor(Math.random() * 1000)
      }
    }));
  },

  toggleAudio: () => {
    set(state => ({
      system: { ...state.system, audioEnabled: !state.system.audioEnabled }
    }));
  },

  // ===== 日志 Actions =====
  
  addLog: (text, type) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp: Date.now()
    };
    
    set(state => {
      const newLogs = [...state.logs, newLog];
      // 限制日志数量
      if (newLogs.length > state.maxLogs) {
        newLogs.shift();
      }
      return { logs: newLogs };
    });
  },

  clearLogs: () => {
    set({ logs: [] });
  },

  // ===== 按钮 Actions =====
  
  pressButton: (key) => {
    set(state => {
      const buttons = new Map(state.buttons);
      const current = buttons.get(key) || { key, isActive: false, isHighlighted: false, clickCount: 0 };
      buttons.set(key, {
        ...current,
        isActive: true,
        clickCount: current.clickCount + 1
      });
      
      // 0.1 秒后恢复
      setTimeout(() => {
        set(state2 => {
          const buttons2 = new Map(state2.buttons);
          const current2 = buttons2.get(key);
          if (current2) {
            buttons2.set(key, { ...current2, isActive: false });
          }
          return { buttons: buttons2 };
        });
      }, 100);
      
      return { buttons };
    });
  },

  highlightButton: (key) => {
    set({ highlightedButton: key });
  },

  clearHighlight: () => {
    set({ highlightedButton: null });
  },

  // ===== 命令 Actions =====
  
  executeCommand: async (command) => {
    const { addLog, pressButton } = get();
    
    set({ currentCommand: command, isExecuting: true });
    
    addLog(`Executing command: ${command.name} [${command.key}]`, 'info');
    
    // 显示随机日志消息
    for (const msg of command.logMessages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      addLog(msg, command.type === 'destructive' ? 'warning' : 'info');
    }
    
    // 播放音效
    if (get().system.audioEnabled) {
      // TODO: 实现音效
    }
    
    set({ currentCommand: null, isExecuting: false });
  },

  executeNumberCommand: async (code) => {
    const { addLog, executeCommand } = get();
    
    // 这里应该查找数字命令配置并执行序列
    addLog(`Advanced mode: Code ${code}`, 'system');
    // TODO: 实现数字命令序列执行
  },

  // ===== 快速行动 Actions =====
  
  registerQuickAction: (action) => {
    set(state => ({
      quickActions: [...state.quickActions, action]
    }));
  },

  triggerQuickAction: (id) => {
    const action = get().quickActions.find(a => a.id === id);
    if (action) {
      action.action();
    }
  },

  // ===== 原有特效 Actions =====
  
  setCurrentEffect: (name, instance = null) => {
    set({ 
      currentEffect: name, 
      currentEffectInstance: instance 
    });
  },

  setAvailableEffects: (effects) => {
    set({ availableEffects: effects });
  },

  setFPS: (fps) => {
    set({ fps });
  },

  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  }
}));
