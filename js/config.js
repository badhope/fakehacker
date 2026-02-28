/* ==========================================
   文件名：js/config.js
   功能：全局配置、功能映射、文案库
   ========================================== */

const CONFIG = {
    // --- 1. 系统基础设置 ---
    system: {
        name: "QUANTUM HACK TERMINAL",
        version: "2.0.0",
        author: "BADHOPE",
        bootSequence: [
            "INITIALIZING QUANTUM CORE...",
            "LOADING ENCRYPTION MODULES...",
            "ESTABLISHING SECURE TUNNEL...",
            "CONNECTING TO DARK NETWORK...",
            "SYSTEM READY. WELCOME, OPERATOR."
        ],
        helpText: `
====================================
   QUANTUM HACK TERMINAL v2.0
====================================
SIMPLE MODE: Press any A-Z button.
ADVANCED MODE: Enter number code 1-9 in the input box.

EXAMPLES:
  1 - Executes Attack Sequence Alpha
  2 - Executes Full System Scan
  3 - Initiates Data Heist

Press any key to begin simulation...
====================================
        `
    },

    // --- 2. 简单玩法：26个字母按钮功能定义 ---
    // 每个键映射一个具体功能
    letterCommands: {
        // --- 攻击类 ---
        'A': {
            name: "Password Cracker",
            type: "attack", // 决定按钮颜色主题 (attack=红色)
            icon: "fa-key",
            desc: "Brute force attack",
            action: "crackPassword",
            logMessages: [
                "Initiating password cracking sequence...",
                "Testing common combinations...",
                "Dictionary attack in progress...",
                "Hash comparison running..."
            ]
        },
        'B': {
            name: "SQL Injection",
            type: "attack",
            icon: "fa-database",
            desc: "Inject malicious code",
            action: "sqlInjection",
            logMessages: [
                "Analyzing target database...",
                "Crafting SQL payload...",
                "Injecting payload: ' OR 1=1 --",
                "Database vulnerability confirmed..."
            ]
        },
        'C': {
            name: "DDoS Attack",
            type: "attack",
            icon: "fa-network-wired",
            desc: "Flood target server",
            action: "ddosAttack",
            logMessages: [
                "Mobilizing botnet nodes...",
                "Sending SYN flood packets...",
                "Server response time increasing...",
                "Target server under heavy load..."
            ]
        },
        'D': {
            name: "Malware Deploy",
            type: "attack",
            icon: "fa-virus",
            desc: "Upload trojan horse",
            action: "deployMalware",
            logMessages: [
                "Packaging malware payload...",
                "Uploading to target system...",
                "Executing remote script...",
                "Backdoor established successfully."
            ]
        },

        // --- 扫描类 ---
        'E': {
            name: "Port Scanner",
            type: "scan", // 决定按钮颜色主题 (scan=青色)
            icon: "fa-search",
            desc: "Scan open ports",
            action: "portScan",
            logMessages: [
                "Initializing port scan...",
                "Checking ports: 21, 22, 80, 443...",
                "Port 22: SSH (Open)",
                "Port 80: HTTP (Open)"
            ]
        },
        'F': {
            name: "Network Mapper",
            type: "scan",
            icon: "fa-project-diagram",
            desc: "Map network topology",
            action: "networkMap",
            logMessages: [
                "Tracing network routes...",
                "Mapping device connections...",
                "Network topology generated.",
                "Identified 3 potential access points."
            ]
        },
        'G': {
            name: "Vulnerability Scan",
            type: "scan",
            icon: "fa-bug",
            desc: "Find system weaknesses",
            action: "vulnScan",
            logMessages: [
                "Starting vulnerability scan...",
                "Checking for CVE-2023-1234...",
                "Checking for outdated software...",
                "Found 2 critical vulnerabilities."
            ]
        },

        // --- 工具类 ---
        'H': {
            name: "File Decryptor",
            type: "util", // 决定按钮颜色主题 (util=橙色)
            icon: "fa-unlock-alt",
            desc: "Decrypt encrypted files",
            action: "decryptFile",
            logMessages: [
                "Analyzing encryption algorithm...",
                "Applying decryption keys...",
                "File decrypted successfully.",
                "Access granted to secret_data.doc"
            ]
        },
        'I': {
            name: "Crypto Miner",
            type: "util",
            icon: "fa-coins",
            desc: "Mine cryptocurrency",
            action: "cryptoMine",
            logMessages: [
                "Starting mining process...",
                "Calculating hash rate...",
                "Block found: 0x7a8b9c...",
                "Wallet balance updated."
            ]
        },
        'J': {
            name: "Data Dumper",
            type: "util",
            icon: "fa-download",
            desc: "Download sensitive data",
            action: "dataDump",
            logMessages: [
                "Connecting to target database...",
                "Extracting user tables...",
                "Downloading: passwords.db",
                "Data dump complete."
            ]
        },

        // --- 系统类 ---
        'K': {
            name: "System Diagnostic",
            type: "system", // 决定按钮颜色主题 (system=白色)
            icon: "fa-heartbeat",
            desc: "Check system health",
            action: "systemDiag",
            logMessages: [
                "Running system diagnostics...",
                "CPU Temperature: 85°C",
                "Memory Usage: 3.2GB / 16GB",
                "System Status: CRITICAL"
            ]
        },
        'L': {
            name: "Log Cleaner",
            type: "system",
            icon: "fa-broom",
            desc: "Clear access logs",
            action: "clearLogs",
            logMessages: [
                "Initiating log cleanup...",
                "Deleting access logs...",
                "Clearing bash history...",
                "Tracks covered successfully."
            ]
        },

        // --- 剩下的字母 M-Z，每个都有独特功能 ---
        'M': { name: "Email Spoofer", type: "attack", icon: "fa-envelope", desc: "Send fake email", action: "emailSpoof" },
        'N': { name: "DNS Spoof", type: "attack", icon: "fa-server", desc: "Redirect DNS", action: "dnsSpoof" },
        'O': { name: "Keylogger", type: "attack", icon: "fa-keyboard", desc: "Record keystrokes", action: "keylogger" },
        'P': { name: "Proxy Chain", type: "util", icon: "fa-random", desc: "Route through proxies", action: "proxyChain" },
        'Q': { name: "Quantum Decrypt", type: "util", icon: "fa-atom", desc: "Quantum decryption", action: "quantumDecrypt" },
        'R': { name: "Ransomware", type: "attack", icon: "fa-lock", desc: "Encrypt for ransom", action: "ransomware" },
        'S': { name: "Steganography", type: "util", icon: "fa-image", desc: "Hide data in image", action: "steganography" },
        'T': { name: "Tor Network", type: "system", icon: "fa-user-secret", desc: "Connect to Tor", action: "torNetwork" },
        'U': { name: "USB Infection", type: "attack", icon: "fa-usb", desc: "Infect USB drives", action: "usbInfect" },
        'V': { name: "VPN Tunnel", type: "system", icon: "fa-shield-alt", desc: "Create VPN tunnel", action: "vpnTunnel" },
        'W': { name: "WiFi Cracker", type: "attack", icon: "fa-wifi", desc: "Crack WiFi password", action: "wifiCrack" },
        'X': { name: "XSS Attack", type: "attack", icon: "fa-code", desc: "Cross-site scripting", action: "xssAttack" },
        'Y': { name: "Zero Day Exploit", type: "attack", icon: "fa-bomb", desc: "Unknown exploit", action: "zeroDay" },
        'Z': { name: "Zombie Bot", type: "attack", icon: "fa-robot", desc: "Create botnet node", action: "zombieBot" }
    },

    // --- 3. 高级玩法：数字指令定义 ---
    // 输入框输入数字触发对应功能序列
    numberCommands: {
        '1': {
            name: "Attack Sequence Alpha",
            description: "Complete attack sequence",
            sequence: ['A', 'B', 'E'], // 依次执行A、B、E的功能
            finalMessage: ">>> ATTACK SEQUENCE ALPHA COMPLETED <<<"
        },
        '2': {
            name: "Full System Scan",
            description: "Comprehensive scan",
            sequence: ['E', 'F', 'G'],
            finalMessage: ">>> FULL SYSTEM SCAN COMPLETED <<<"
        },
        '3': {
            name: "Data Heist",
            description: "Steal all the data",
            sequence: ['J', 'H', 'I'],
            finalMessage: ">>> DATA HEIST SUCCESSFUL <<<"
        },
        '4': {
            name: "System Meltdown",
            description: "Critical failure simulation",
            sequence: ['K', 'L', 'R'],
            finalMessage: ">>> SYSTEM MELTDOWN INITIATED <<<"
        },
        '5': {
            name: "The Works",
            description: "Execute everything",
            sequence: ['A', 'C', 'E', 'J', 'R'],
            finalMessage: ">>> TOTAL CHAOS UNLEASHED <<<"
        },
        '6': {
            name: "Stealth Mode",
            description: "Cover all tracks",
            sequence: ['P', 'T', 'L', 'V'],
            finalMessage: ">>> STEALTH MODE ACTIVATED <<<"
        },
        '7': {
            name: "Quantum Break",
            description: "Advanced quantum attack",
            sequence: ['Q', 'X', 'Y'],
            finalMessage: ">>> QUANTUM BREAK SUCCESSFUL <<<"
        },
        '8': {
            name: "Cyber War",
            description: "Launch all attacks",
            sequence: ['C', 'D', 'M', 'N', 'O'],
            finalMessage: ">>> CYBER WAR INITIATED <<<"
        },
        '9': {
            name: "Self Destruct",
            description: "Destroy all evidence",
            sequence: ['L', 'R'],
            finalMessage: ">>> SELF DESTRUCT COMPLETED <<<",
            finalAction: function() {
                // 触发自毁动画
                if (typeof triggerDestruct === 'function') {
                    triggerDestruct();
                }
            }
        }
    },

    // --- 4. 日志消息库 ---
    logMessages: {
        attack: [
            ">>> ATTACKING TARGET: {TARGET}",
            ">>> PAYLOAD DELIVERED SUCCESSFULLY",
            ">>> TARGET COMPROMISED",
            ">>> DATA EXFILTRATION IN PROGRESS"
        ],
        scan: [
            ">>> SCANNING TARGET: {TARGET}",
            ">>> OPEN PORT DETECTED: {PORT}",
            ">>> VULNERABILITY FOUND: {VULN}",
            ">>> SCAN COMPLETE"
        ],
        util: [
            ">>> PROCESSING: {PROCESS}",
            ">>> HASH CALCULATED: {HASH}",
            ">>> DECRYPTION KEY FOUND",
            ">>> OPERATION COMPLETE"
        ],
        system: [
            ">>> SYSTEM: {STATUS}",
            ">>> UPTIME: {UPTIME}",
            ">>> RESOURCES: {RESOURCES}",
            ">>> DIAGNOSTIC COMPLETE"
        ],
        error: [
            "!!! ERROR: CONNECTION FAILED",
            "!!! ERROR: ACCESS DENIED",
            "!!! ERROR: FIREWALL DETECTED",
            "!!! ERROR: TRACE INITIATED"
        ],
        success: [
            ">>> SUCCESS: ACCESS GRANTED",
            ">>> SUCCESS: DATA DOWNLOADED",
            ">>> SUCCESS: SYSTEM BREACHED",
            ">>> SUCCESS: OPERATION COMPLETE"
        ]
    },

    // --- 5. 恶搞结果库 ---
    hackResults: {
        success: [
            "ACCESS GRANTED. Welcome, Admin.",
            "PASSWORD FOUND: qwerty123",
            "DATABASE DOWNLOADED. Selling on dark web...",
            "Congratulations! You are now a hacker.",
            "Target's webcam activated. Say cheese!",
            "Transfer complete. $1,000,000 sent to your account."
        ],
        failure: [
            "TRACE DETECTED. Your location has been sent to the FBI.",
            "FIREWALL BLOCKED. Your IP has been reported.",
            "CRITICAL ERROR. System meltdown initiated.",
            "ACCESS DENIED. You are not worthy.",
            "VIRUS DETECTED. Your computer will explode in 5... 4... 3..."
        ]
    },

    // --- 6. 辅助函数 ---
    // 获取随机日志消息
    getRandomLog: function(type) {
        const messages = this.logMessages[type] || this.logMessages.system;
        return messages[Math.floor(Math.random() * messages.length)];
    },

    // 获取随机恶搞结果
    getRandomResult: function(success) {
        const results = success ? this.hackResults.success : this.hackResults.failure;
        return results[Math.floor(Math.random() * results.length)];
    },

    // 获取随机IP地址
    getRandomIP: function() {
        return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    },

    // 获取随机端口号
    getRandomPort: function() {
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 8080];
        return commonPorts[Math.floor(Math.random() * commonPorts.length)];
    },

    // 获取随机哈希值
    getRandomHash: function() {
        return Array.from({length: 32}, () => "abcdef0123456789"[Math.floor(Math.random()*16)]).join('');
    }
};
