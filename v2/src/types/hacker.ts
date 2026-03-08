/**
 * Visual Effects Lab v2.1 - 完整类型定义
 * 包含黑客终端的所有必要类型
 */

// 命令类型
export type CommandType = 'system' | 'network' | 'security' | 'utility' | 'destructive';

// 命令配置
export interface CommandConfig {
  key: string;
  name: string;
  type: CommandType;
  action: string;
  description: string;
  logMessages: string[];
  effect?: string;
  duration?: number;
}

// 数字命令配置
export interface NumberCommandConfig {
  code: string;
  name: string;
  sequence: string[];
  finalMessage: string;
  finalAction?: () => void;
}

// 系统状态
export interface SystemState {
  isBooted: boolean;
  currentMode: 'simple' | 'advanced';
  uptime: number;
  audioEnabled: boolean;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  packetCount: number;
}

// 日志条目
export interface LogEntry {
  id: string;
  text: string;
  type: 'system' | 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
}

// 特效配置
export interface EffectConfig {
  name: string;
  duration: number;
  params?: Record<string, number | string>;
}

// 快速行动
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color: string;
}

// 按钮状态
export interface ButtonState {
  key: string;
  isActive: boolean;
  isHighlighted: boolean;
  clickCount: number;
}
