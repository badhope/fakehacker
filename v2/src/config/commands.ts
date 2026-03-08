/**
 * Visual Effects Lab v2.1 - 黑客终端命令配置
 * 包含所有 26 个字母命令和数字命令
 */

import type { CommandConfig, NumberCommandConfig } from '../types/hacker';

export const letterCommands: Record<string, CommandConfig> = {
  A: {
    key: 'A',
    name: '系统分析',
    type: 'system',
    action: 'analyze',
    description: '启动系统分析程序',
    logMessages: [
      'Initializing system analyzer...',
      'Scanning system resources...',
      'Analysis complete. System operating at optimal capacity.'
    ],
    duration: 3000
  },
  B: {
    key: 'B',
    name: '突破防火墙',
    type: 'security',
    action: 'breach',
    description: '尝试突破目标防火墙',
    logMessages: [
      'Targeting firewall...',
      'Bypassing security protocols...',
      'Firewall breached successfully!'
    ],
    duration: 4000
  },
  C: {
    key: 'C',
    name: '代码破解',
    type: 'security',
    action: 'crack',
    description: '破解加密代码',
    logMessages: [
      'Decrypting encrypted data...',
      'Brute force attack initiated...',
      'Encryption broken!'
    ],
    duration: 3500
  },
  D: {
    key: 'D',
    name: '数据下载',
    type: 'network',
    action: 'download',
    description: '下载目标数据',
    logMessages: [
      'Establishing secure connection...',
      'Downloading data packets...',
      'Download complete.'
    ],
    duration: 5000
  },
  E: {
    key: 'E',
    name: '电子邮件拦截',
    type: 'network',
    action: 'email',
    description: '拦截电子邮件',
    logMessages: [
      'Accessing mail server...',
      'Intercepting messages...',
      'Emails captured.'
    ],
    duration: 3000
  },
  F: {
    key: 'F',
    name: '文件上传',
    type: 'network',
    action: 'upload',
    description: '上传文件到远程服务器',
    logMessages: [
      'Connecting to remote server...',
      'Uploading files...',
      'Upload successful.'
    ],
    duration: 4000
  },
  G: {
    key: 'G',
    name: 'GPU 加速',
    type: 'utility',
    action: 'gpu',
    description: '启用 GPU 加速',
    logMessages: [
      'Activating GPU cores...',
      'Parallel processing enabled.',
      'Performance increased by 300%.'
    ],
    duration: 2000
  },
  H: {
    key: 'H',
    name: '黑客网络',
    type: 'network',
    action: 'hackernet',
    description: '连接到黑客网络',
    logMessages: [
      'Connecting to hacker network...',
      'Anonymous proxy active.',
      'Connection established.'
    ],
    duration: 3000
  },
  I: {
    key: 'I',
    name: '入侵检测',
    type: 'security',
    action: 'intrusion',
    description: '检测入侵者',
    logMessages: [
      'Scanning for intruders...',
      'Analyzing network traffic...',
      'No threats detected.'
    ],
    duration: 3000
  },
  J: {
    key: 'J',
    name: '日志注入',
    type: 'security',
    action: 'inject',
    description: '注入虚假日志',
    logMessages: [
      'Preparing log injection...',
      'Injecting false entries...',
      'Logs modified successfully.'
    ],
    duration: 2500
  },
  K: {
    key: 'K',
    name: '内核攻击',
    type: 'destructive',
    action: 'kernel',
    description: '发动内核级攻击',
    logMessages: [
      'Loading kernel exploit...',
      'Targeting kernel vulnerability...',
      'Kernel compromised!'
    ],
    duration: 5000
  },
  L: {
    key: 'L',
    name: '位置追踪',
    type: 'utility',
    action: 'locate',
    description: '追踪目标位置',
    logMessages: [
      'Triangulating signal...',
      'Accessing GPS satellites...',
      'Location acquired.'
    ],
    duration: 3000
  },
  M: {
    key: 'M',
    name: '矩阵协议',
    type: 'system',
    action: 'matrix',
    description: '启动矩阵协议',
    logMessages: [
      'Initializing Matrix protocol...',
      'Entering the Matrix...',
      'Welcome to the real world.'
    ],
    duration: 5000,
    effect: 'matrix'
  },
  N: {
    key: 'N',
    name: '网络映射',
    type: 'network',
    action: 'network',
    description: '绘制网络拓扑图',
    logMessages: [
      'Scanning network...',
      'Mapping nodes...',
      'Network topology complete.'
    ],
    duration: 4000,
    effect: 'network'
  },
  O: {
    key: 'O',
    name: '覆盖模式',
    type: 'utility',
    action: 'overlay',
    description: '启用覆盖模式',
    logMessages: [
      'Activating overlay mode...',
      'Stealth protocols engaged.',
      'You are now invisible.'
    ],
    duration: 2000
  },
  P: {
    key: 'P',
    name: '数据包嗅探',
    type: 'network',
    action: 'packet',
    description: '嗅探网络数据包',
    logMessages: [
      'Starting packet sniffer...',
      'Capturing network traffic...',
      'Packets analyzed.'
    ],
    duration: 3500
  },
  Q: {
    key: 'Q',
    name: '量子加密',
    type: 'security',
    action: 'quantum',
    description: '启用量子加密',
    logMessages: [
      'Activating quantum encryption...',
      'Entangling particles...',
      'Communication secured.'
    ],
    duration: 3000
  },
  R: {
    key: 'R',
    name: '远程桌面',
    type: 'utility',
    action: 'remote',
    description: '建立远程桌面连接',
    logMessages: [
      'Initiating remote desktop...',
      'Bypassing authentication...',
      'Connection established.'
    ],
    duration: 3000
  },
  S: {
    key: 'S',
    name: '系统扫描',
    type: 'system',
    action: 'scan',
    description: '全面系统扫描',
    logMessages: [
      'Starting full system scan...',
      'Checking all processes...',
      'Scan complete. No anomalies found.'
    ],
    duration: 4000
  },
  T: {
    key: 'T',
    name: '木马植入',
    type: 'destructive',
    action: 'trojan',
    description: '植入木马程序',
    logMessages: [
      'Preparing trojan...',
      'Injecting into target system...',
      'Trojan installed successfully.'
    ],
    duration: 4000
  },
  U: {
    key: 'U',
    name: '升级系统',
    type: 'utility',
    action: 'upgrade',
    description: '升级系统组件',
    logMessages: [
      'Checking for updates...',
      'Downloading patches...',
      'System upgraded.'
    ],
    duration: 5000
  },
  V: {
    key: 'V',
    name: '病毒扫描',
    type: 'security',
    action: 'virus',
    description: '病毒扫描和清除',
    logMessages: [
      'Running virus scan...',
      'Quarantining threats...',
      'System clean.'
    ],
    duration: 4000
  },
  W: {
    key: 'W',
    name: 'WiFi 破解',
    type: 'security',
    action: 'wifi',
    description: '破解 WiFi 密码',
    logMessages: [
      'Scanning for networks...',
      'Cracking WPA2...',
      'Password found!'
    ],
    duration: 6000
  },
  X: {
    key: 'X',
    name: 'X 射线视觉',
    type: 'utility',
    action: 'xray',
    description: '启用 X 射线视觉模式',
    logMessages: [
      'Activating X-ray vision...',
      'Penetrating solid objects...',
      'Vision enhanced.'
    ],
    duration: 2000
  },
  Y: {
    key: 'Y',
    name: '系统同步',
    type: 'system',
    action: 'sync',
    description: '同步所有系统',
    logMessages: [
      'Initiating system sync...',
      'Synchronizing databases...',
      'Sync complete.'
    ],
    duration: 3000
  },
  Z: {
    key: 'Z',
    name: '零点协议',
    type: 'destructive',
    action: 'zero',
    description: '启动零点协议（自毁）',
    logMessages: [
      'WARNING: Initiating Zero Protocol...',
      'Self-destruct sequence started...',
      'System will terminate in T-minus 10 seconds...'
    ],
    duration: 10000,
    effect: 'selfdestruct'
  }
};

export const numberCommands: NumberCommandConfig[] = [
  {
    code: '1',
    name: '快速扫描',
    sequence: ['S', 'A', 'N'],
    finalMessage: 'Quick scan complete.'
  },
  {
    code: '2',
    name: '网络入侵',
    sequence: ['N', 'I', 'H', 'B'],
    finalMessage: 'Network intrusion successful.'
  },
  {
    code: '3',
    name: '数据窃取',
    sequence: ['D', 'O', 'F', 'U'],
    finalMessage: 'Data exfiltration complete.'
  },
  {
    code: '4',
    name: '系统接管',
    sequence: ['S', 'Y', 'C', 'R'],
    finalMessage: 'System takeover complete. You are now in control.'
  },
  {
    code: '5',
    name: '全面攻击',
    sequence: ['K', 'T', 'B', 'C'],
    finalMessage: 'Full-scale attack initiated. Target compromised.'
  },
  {
    code: '6',
    name: '隐身模式',
    sequence: ['O', 'Q', 'H'],
    finalMessage: 'Stealth mode activated. You are invisible.'
  },
  {
    code: '7',
    name: '矩阵觉醒',
    sequence: ['M', 'X', 'Q'],
    finalMessage: 'You have seen the Matrix. Welcome to the real world.'
  },
  {
    code: '8',
    name: '量子突破',
    sequence: ['Q', 'C', 'W', 'D'],
    finalMessage: 'Quantum breach successful. All systems compromised.'
  },
  {
    code: '9',
    name: '零点协议（自毁）',
    sequence: ['Z', 'K', 'T', 'B'],
    finalMessage: 'CRITICAL: System self-destruct initiated!',
    finalAction: () => {
      console.log('SELF DESTRUCT SEQUENCE ACTIVATED');
      // 实际自毁逻辑
    }
  }
];

export const quickActions = [
  { id: 'panic', label: '紧急停止', icon: '⚠️', color: '#ff4466' },
  { id: 'clear', label: '清除日志', icon: '🗑️', color: '#00ffff' },
  { id: 'fullscreen', label: '全屏模式', icon: '⛶', color: '#00ff00' },
  { id: 'audio', label: '音效开关', icon: '🔊', color: '#ff8800' },
  { id: 'matrix', label: '矩阵协议', icon: 'M', color: '#00ff00' },
  { id: 'network', label: '网络映射', icon: 'N', color: '#0088ff' },
  { id: 'breach', label: '突破防火墙', icon: 'B', color: '#ff00ff' },
  { id: 'selfdestruct', label: '自毁程序', icon: '☢️', color: '#ff0000' }
];
