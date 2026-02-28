/* ==========================================
   文件名：js/simple-commands.js
   功能：26个字母按钮的具体功能实现
   ========================================== */

const SimpleCommands = {
    // --- A: 密码破解 ---
    crackPassword: function(config) {
        const progress = document.getElementById('main-progress');
        const progressText = document.querySelector('.progress-text');
        let p = 0;
        
        // 更新UI状态
        if (progressText) progressText.innerText = "CRACKING...";
        
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 15) + 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                
                // 成功提示
                const password = Math.random().toString(36).substring(2, 10);
                App.addLog(`PASSWORD FOUND: ${password}`, 'success');
                
                // 触发成功特效
                if (typeof Effects !== 'undefined') Effects.flashScreen('#00ff00');
                
                if (progress) progress.style.width = '100%';
                if (progressText) progressText.innerText = "ACCESS GRANTED";
                
                // 重置进度条
                setTimeout(() => {
                    if (progress) progress.style.width = '0%';
                }, 2000);
            } else {
                if (progress) progress.style.width = p + '%';
                App.addLog(`Testing combination: ${Math.random().toString(36).substring(2, 6)}`, 'warning');
            }
        }, 150);
    },

    // --- B: SQL注入 ---
    sqlInjection: function(config) {
        const payloads = ["' OR '1'='1", "'; DROP TABLE users;--", "' UNION SELECT * FROM passwords--"];
        const payload = payloads[Math.floor(Math.random() * payloads.length)];
        
        App.addLog("Analyzing database structure...", 'info');
        setTimeout(() => {
            App.addLog(`Injecting payload: ${payload}`, 'warning');
            setTimeout(() => {
                App.addLog("Database vulnerability confirmed!", 'success');
                App.addLog("Extracting admin credentials...", 'success');
                if (typeof Effects !== 'undefined') Effects.flashScreen('#00ff00');
            }, 500);
        }, 500);
    },

    // --- C: DDoS攻击 ---
    ddosAttack: function(config) {
        let packets = 0;
        const targetIP = CONFIG.getRandomIP();
        
        App.addLog(`Target locked: ${targetIP}`, 'info');
        
        const interval = setInterval(() => {
            packets += Math.floor(Math.random() * 500) + 100;
            App.addLog(`Sending ${packets} packets...`, 'warning');
            
            // 更新图表占位符显示流量
            const chart = document.querySelector('.chart-placeholder');
            if (chart) {
                chart.style.background = `linear-gradient(0deg, rgba(0, 255, 0, ${Math.random()*0.3}) 0%, transparent 100%)`;
            }
        }, 200);
        
        // 3秒后停止
        setTimeout(() => {
            clearInterval(interval);
            App.addLog("Target server unresponsive!", 'success');
            if (typeof Effects !== 'undefined') Effects.flashScreen('#ff0044');
        }, 3000);
    },

    // --- D: 恶意软件部署 ---
    deployMalware: function(config) {
        const progress = document.getElementById('main-progress');
        const progressText = document.querySelector('.progress-text');
        if (progressText) progressText.innerText = "UPLOADING...";
        
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            if (p > 100) {
                clearInterval(interval);
                App.addLog("Trojan deployed successfully!", 'success');
                App.addLog("Backdoor active on port 1337", 'success');
                if (progress) progress.style.width = '100%';
                if (progressText) progressText.innerText = "DEPLOYED";
            } else {
                if (progress) progress.style.width = p + '%';
            }
        }, 100);
    },

    // --- E: 端口扫描 ---
    portScan: function(config) {
        const target = CONFIG.getRandomIP();
        const ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 8080];
        
        App.addLog(`Scanning target: ${target}`, 'info');
        
        ports.forEach((port, index) => {
            setTimeout(() => {
                const isOpen = Math.random() > 0.6;
                const status = isOpen ? "OPEN" : "CLOSED";
                const type = isOpen ? 'success' : 'info';
                App.addLog(`Port ${port}: ${status}`, type);
                
                if (isOpen && index === ports.length - 1) {
                    if (typeof Effects !== 'undefined') Effects.flashScreen('#00ffff');
                }
            }, index * 200);
        });
    },

    // --- F: 网络拓扑图 ---
    networkMap: function(config) {
        // 触发网络地图Canvas特效
        if (typeof Effects !== 'undefined') {
            Effects.triggerNetworkMap();
        }
    },

    // --- G: 漏洞扫描 ---
    vulnScan: function(config) {
        const vulns = ["CVE-2023-1234", "CVE-2022-5678", "XSS Vulnerability", "Outdated SSL"];
        
        App.addLog("Initiating vulnerability scan...", 'info');
        
        setTimeout(() => {
            const count = Math.floor(Math.random() * 3) + 1;
            App.addLog(`Found ${count} critical vulnerabilities:`, 'error');
            
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    App.addLog(`>>> ${vulns[Math.floor(Math.random() * vulns.length)]}`, 'warning');
                }, i * 300);
            }
        }, 1000);
    },

    // --- H: 文件解密 ---
    decryptFile: function(config) {
        const filename = "classified_data.enc";
        App.addLog(`Analyzing encryption for: ${filename}`, 'info');
        
        setTimeout(() => {
            App.addLog("Breaking AES-256 encryption...", 'warning');
            setTimeout(() => {
                App.addLog("File decrypted successfully!", 'success');
                App.addLog("Content: [TOP SECRET DATA]", 'success');
                if (typeof Effects !== 'undefined') Effects.flashScreen('#00ff00');
            }, 1500);
        }, 1000);
    },

    // --- I: 挖矿 ---
    cryptoMine: function(config) {
        App.addLog("Starting crypto miner...", 'warning');
        let coins = 0;
        
        const interval = setInterval(() => {
            const hash = CONFIG.getRandomHash();
            App.addLog(`Block found: ${hash.substring(0, 16)}...`, 'success');
            coins += 0.05;
            
            const chart = document.querySelector('#system-resources .chart-placeholder');
            if (chart) chart.innerText = `Mining: ${coins.toFixed(2)} BTC`;
        }, 500);
        
        setTimeout(() => {
            clearInterval(interval);
            App.addLog("Mining paused. Wallet updated.", 'info');
        }, 4000);
    },

    // --- J: 数据转储 ---
    dataDump: function(config) {
        App.addLog("Connecting to shadow database...", 'info');
        
        let size = 0;
        const interval = setInterval(() => {
            size += Math.floor(Math.random() * 50) + 10;
            App.addLog(`Downloaded: ${size} MB`, 'warning');
        }, 200);
        
        setTimeout(() => {
            clearInterval(interval);
            App.addLog("Database dump complete. Total size: " + size + " MB", 'success');
        }, 3000);
    },

    // --- K: 系统诊断 ---
    systemDiag: function(config) {
        App.addLog("Running system diagnostics...", 'info');
        
        setTimeout(() => {
            const cpu = Math.floor(Math.random() * 40 + 60);
            const mem = (Math.random() * 4 + 10).toFixed(1);
            
            App.addLog(`CPU Temperature: ${cpu}°C`, cpu > 80 ? 'error' : 'warning');
            App.addLog(`Memory Usage: ${mem} GB`, mem > 12 ? 'warning' : 'info');
            App.addLog(`System Status: CRITICAL`, 'error');
        }, 1000);
    },

    // --- L: 清除日志 ---
    clearLogs: function(config) {
        App.addLog("Initiating log cleanup...", 'warning');
        
        // 模拟删除过程
        const lines = document.querySelectorAll('#log-container .log-entry');
        let count = lines.length;
        
        const interval = setInterval(() => {
            if (count > 2) { // 保留最后几行
                lines[count - 1].style.opacity = '0';
                setTimeout(() => lines[count - 1].remove(), 200);
                count--;
            } else {
                clearInterval(interval);
                App.addLog("System logs cleared successfully.", 'success');
            }
        }, 50);
    },

    // --- M-Z: 通用功能实现 ---
    // 为了简洁，M-Z使用通用逻辑，实际项目中可继续扩展
    
    // M: 邮件伪造
    emailSpoof: function(config) {
        App.addLog("Spoofing email sender address...", 'info');
        setTimeout(() => App.addLog("Email sent from: admin@government.gov", 'success'), 1000);
    },
    
    // N: DNS欺骗
    dnsSpoof: function(config) {
        App.addLog("Poisoning DNS cache...", 'warning');
        setTimeout(() => App.addLog("All traffic redirected to: 192.168.66.6", 'success'), 1500);
    },
    
    // O: 键盘记录器
    keylogger: function(config) {
        App.addLog("Activating keylogger daemon...", 'info');
        const chars = "abcdef123456";
        setInterval(() => {
            App.addLog(`Key captured: ${chars[Math.floor(Math.random()*chars.length)]}`, 'warning');
        }, 100);
    },
    
    // P: 代理链
    proxyChain: function(config) {
        App.addLog("Routing through 7 proxies...", 'warning');
        App.addLog("IP Hidden. Location: UNKNOWN", 'success');
    },
    
    // Q: 量子解密
    quantumDecrypt: function(config) {
        App.addLog("Quantum computer engaged...", 'info');
        setTimeout(() => App.addLog("Decryption completed in 0.004s", 'success'), 500);
    },
    
    // R: 勒索软件
    ransomware: function(config) {
        if (typeof Effects !== 'undefined') Effects.triggerRansomware();
        App.addLog("Encrypting local files...", 'error');
    },
    
    // S: 隐写术
    steganography: function(config) {
        App.addLog("Hiding data in image: meme.jpg...", 'info');
        setTimeout(() => App.addLog("Data hidden successfully.", 'success'), 1000);
    },
    
    // T: Tor网络
    torNetwork: function(config) {
        App.addLog("Connecting to Tor network...", 'warning');
        setTimeout(() => App.addLog("Connection established. You are anonymous.", 'success'), 1500);
    },
    
    // U: USB感染
    usbInfect: function(config) {
        App.addLog("Scanning for USB devices...", 'info');
        setTimeout(() => App.addLog("Device 'KINGSTON' infected.", 'success'), 800);
    },
    
    // V: VPN隧道
    vpnTunnel: function(config) {
        App.addLog("Building secure VPN tunnel...", 'info');
        App.addLog("Encryption: AES-256-GCM", 'warning');
        setTimeout(() => App.addLog("Tunnel active.", 'success'), 1200);
    },
    
    // W: WiFi破解
    wifiCrack: function(config) {
        App.addLog("Capturing WPA2 handshake...", 'warning');
        setTimeout(() => {
            App.addLog("Password found: mywifi12345", 'success');
        }, 2000);
    },
    
    // X: XSS攻击
    xssAttack: function(config) {
        App.addLog("Injecting script: <script>alert(1)</script>", 'warning');
        App.addLog("Cookie stolen: session_id=abc123", 'success');
    },
    
    // Y: 零日漏洞
    zeroDay: function(config) {
        App.addLog("Deploying unknown zero-day exploit...", 'error');
        setTimeout(() => {
            App.addLog("CRITICAL: Target system fully compromised.", 'success');
            if (typeof Effects !== 'undefined') Effects.flashScreen('#ff0044');
        }, 1000);
    },
    
    // Z: 僵尸网络
    zombieBot: function(config) {
        App.addLog("Enslaving botnet nodes...", 'warning');
        let bots = 0;
        const interval = setInterval(() => {
            bots += Math.floor(Math.random() * 100);
            App.addLog(`Total bots: ${bots}`, 'warning');
        }, 200);
        
        setTimeout(() => clearInterval(interval), 3000);
    }
};
