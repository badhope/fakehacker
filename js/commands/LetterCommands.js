/* ==========================================
   模块名称：commands/LetterCommands.js
   功能：26 个字母按钮的具体功能实现（重构增强版）
   版本：2.0 - 模块化、可扩展
   ========================================== */

/**
 * 字母指令实现模块
 * 包含所有 A-Z 字母按钮对应的功能函数
 */
const LetterCommands = {
    // ==================== 攻击类指令 ====================
    
    /**
     * A: 密码破解
     */
    crackPassword: function(config) {
        const ui = Application ? Application.getModule('ui') : null;
        let p = 0;
        
        if (ui) ui.updateProgress(0, "CRACKING...");
        
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 15) + 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                
                // 成功提示
                const password = Math.random().toString(36).substring(2, 10);
                if (Application) Application.addLog(`PASSWORD FOUND: ${password}`, 'success');
                
                // 触发特效
                if (window.EffectsEngine) EffectsEngine.flashScreen('#00ff00');
                
                if (ui) ui.updateProgress(100, "ACCESS GRANTED");
                
                // 重置进度条
                setTimeout(() => {
                    if (ui) ui.updateProgress(0, "READY");
                }, 2000);
            } else {
                if (ui) ui.updateProgress(p);
                if (Application) Application.addLog(`Testing combination: ${Math.random().toString(36).substring(2, 6)}`, 'warning');
            }
        }, 150);
    },

    /**
     * B: SQL 注入
     */
    sqlInjection: function(config) {
        const payloads = ["' OR '1'='1", "'; DROP TABLE users;--", "' UNION SELECT * FROM passwords--"];
        const payload = payloads[Math.floor(Math.random() * payloads.length)];
        
        if (Application) {
            Application.addLog("Analyzing database structure...", 'info');
            setTimeout(() => {
                Application.addLog(`Injecting payload: ${payload}`, 'warning');
                setTimeout(() => {
                    Application.addLog("Database vulnerability confirmed!", 'success');
                    Application.addLog("Extracting admin credentials...", 'success');
                    if (window.EffectsEngine) EffectsEngine.flashScreen('#00ff00');
                }, 500);
            }, 500);
        }
    },

    /**
     * C: DDoS 攻击
     */
    ddosAttack: function(config) {
        let packets = 0;
        const targetIP = CONFIG.getRandomIP();
        
        if (Application) Application.addLog(`Target locked: ${targetIP}`, 'info');
        
        const interval = setInterval(() => {
            packets += Math.floor(Math.random() * 500) + 100;
            if (Application) Application.addLog(`Sending ${packets} packets...`, 'warning');
            
            // 更新图表占位符显示流量
            const chart = document.querySelector('.chart-placeholder');
            if (chart) {
                chart.style.background = `linear-gradient(0deg, rgba(0, 255, 0, ${Math.random()*0.3}) 0%, transparent 100%)`;
            }
        }, 200);
        
        // 3 秒后停止
        setTimeout(() => {
            clearInterval(interval);
            if (Application) Application.addLog("Target server unresponsive!", 'success');
            if (window.EffectsEngine) EffectsEngine.flashScreen('#ff0044');
        }, 3000);
    },

    /**
     * D: 恶意软件部署
     */
    deployMalware: function(config) {
        const ui = Application ? Application.getModule('ui') : null;
        if (ui) ui.updateProgress(0, "UPLOADING...");
        
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            if (p > 100) {
                clearInterval(interval);
                if (Application) {
                    Application.addLog("Trojan deployed successfully!", 'success');
                    Application.addLog("Backdoor active on port 1337", 'success');
                }
                if (ui) ui.updateProgress(100, "DEPLOYED");
            } else {
                if (ui) ui.updateProgress(p);
            }
        }, 100);
    },

    // ==================== 扫描类指令 ====================
    
    /**
     * E: 端口扫描
     */
    portScan: function(config) {
        const target = CONFIG.getRandomIP();
        const ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 8080];
        
        if (Application) Application.addLog(`Scanning target: ${target}`, 'info');
        
        ports.forEach((port, index) => {
            setTimeout(() => {
                const isOpen = Math.random() > 0.6;
                const status = isOpen ? "OPEN" : "CLOSED";
                const type = isOpen ? 'success' : 'info';
                if (Application) Application.addLog(`Port ${port}: ${status}`, type);
                
                if (isOpen && index === ports.length - 1) {
                    if (window.EffectsEngine) EffectsEngine.flashScreen('#00ffff');
                }
            }, index * 200);
        });
    },

    /**
     * F: 网络拓扑图
     */
    networkMap: function(config) {
        if (window.EffectsEngine) {
            EffectsEngine.triggerNetworkMap();
        }
    },

    /**
     * G: 漏洞扫描
     */
    vulnScan: function(config) {
        const vulns = ["CVE-2023-1234", "CVE-2022-5678", "XSS Vulnerability", "Outdated SSL"];
        
        if (Application) {
            Application.addLog("Initiating vulnerability scan...", 'info');
            
            setTimeout(() => {
                const count = Math.floor(Math.random() * 3) + 1;
                Application.addLog(`Found ${count} critical vulnerabilities:`, 'error');
                
                for (let i = 0; i < count; i++) {
                    setTimeout(() => {
                        Application.addLog(`>>> ${vulns[Math.floor(Math.random() * vulns.length)]}`, 'warning');
                    }, i * 300);
                }
            }, 1000);
        }
    },

    // ==================== 工具类指令 ====================
    
    /**
     * H: 文件解密
     */
    decryptFile: function(config) {
        const filename = "classified_data.enc";
        if (Application) {
            Application.addLog(`Analyzing encryption for: ${filename}`, 'info');
            
            setTimeout(() => {
                Application.addLog("Breaking AES-256 encryption...", 'warning');
                setTimeout(() => {
                    Application.addLog("File decrypted successfully!", 'success');
                    Application.addLog("Content: [TOP SECRET DATA]", 'success');
                    if (window.EffectsEngine) EffectsEngine.flashScreen('#00ff00');
                }, 1500);
            }, 1000);
        }
    },

    /**
     * I: 加密货币挖矿
     */
    cryptoMine: function(config) {
        if (Application) Application.addLog("Starting crypto miner...", 'warning');
        let coins = 0;
        
        const interval = setInterval(() => {
            const hash = CONFIG.getRandomHash();
            if (Application) Application.addLog(`Block found: ${hash.substring(0, 16)}...`, 'success');
            coins += 0.05;
            
            const chart = document.querySelector('#system-resources .chart-placeholder');
            if (chart) chart.innerText = `Mining: ${coins.toFixed(2)} BTC`;
        }, 500);
        
        setTimeout(() => {
            clearInterval(interval);
            if (Application) Application.addLog("Mining paused. Wallet updated.", 'info');
        }, 4000);
    },

    /**
     * J: 数据转储
     */
    dataDump: function(config) {
        if (Application) {
            Application.addLog("Connecting to shadow database...", 'info');
            
            let size = 0;
            const interval = setInterval(() => {
                size += Math.floor(Math.random() * 50) + 10;
                Application.addLog(`Downloaded: ${size} MB`, 'warning');
            }, 200);
            
            setTimeout(() => {
                clearInterval(interval);
                Application.addLog("Database dump complete. Total size: " + size + " MB", 'success');
            }, 3000);
        }
    },

    // ==================== 系统类指令 ====================
    
    /**
     * K: 系统诊断
     */
    systemDiag: function(config) {
        if (Application) {
            Application.addLog("Running system diagnostics...", 'info');
            
            setTimeout(() => {
                const cpu = Math.floor(Math.random() * 40 + 60);
                const mem = (Math.random() * 4 + 10).toFixed(1);
                
                Application.addLog(`CPU Temperature: ${cpu}°C`, cpu > 80 ? 'error' : 'warning');
                Application.addLog(`Memory Usage: ${mem} GB`, mem > 12 ? 'warning' : 'info');
                Application.addLog(`System Status: CRITICAL`, 'error');
            }, 1000);
        }
    },

    /**
     * L: 清除日志
     */
    clearLogs: function(config) {
        if (Application) Application.addLog("Initiating log cleanup...", 'warning');
        
        const container = document.getElementById('log-container');
        if (!container) return;
        
        const lines = container.querySelectorAll('.log-entry');
        let count = lines.length;
        
        const interval = setInterval(() => {
            if (count > 2) {
                lines[count - 1].style.opacity = '0';
                setTimeout(() => lines[count - 1].remove(), 200);
                count--;
            } else {
                clearInterval(interval);
                if (Application) Application.addLog("System logs cleared successfully.", 'success');
            }
        }, 50);
    },

    // ==================== M-Z 扩展指令 ====================
    
    emailSpoof: function(config) {
        if (Application) {
            Application.addLog("Spoofing email sender address...", 'info');
            setTimeout(() => Application.addLog("Email sent from: admin@government.gov", 'success'), 1000);
        }
    },
    
    dnsSpoof: function(config) {
        if (Application) {
            Application.addLog("Poisoning DNS cache...", 'warning');
            setTimeout(() => Application.addLog("All traffic redirected to: 192.168.66.6", 'success'), 1500);
        }
    },
    
    keylogger: function(config) {
        if (Application) {
            Application.addLog("Activating keylogger daemon...", 'info');
            const chars = "abcdef123456";
            let count = 0;
            const interval = setInterval(() => {
                if (count++ > 10) {
                    clearInterval(interval);
                    Application.addLog("Keylogger data uploaded.", 'success');
                } else {
                    Application.addLog(`Key captured: ${chars[Math.floor(Math.random()*chars.length)]}`, 'warning');
                }
            }, 100);
        }
    },
    
    proxyChain: function(config) {
        if (Application) {
            Application.addLog("Routing through 7 proxies...", 'warning');
            const proxies = ["192.168.1.1", "10.0.0.1", "172.16.0.1", "8.8.8.8"];
            proxies.forEach((proxy, i) => {
                setTimeout(() => {
                    Application.addLog(`Hop ${i+1}: ${proxy}`, 'info');
                }, i * 300);
            });
            setTimeout(() => Application.addLog("IP Hidden. Location: UNKNOWN", 'success'), 2500);
        }
    },
    
    quantumDecrypt: function(config) {
        if (Application) {
            Application.addLog("Quantum computer engaged...", 'info');
            setTimeout(() => Application.addLog("Decryption completed in 0.004s", 'success'), 500);
        }
    },
    
    ransomware: function(config) {
        if (window.EffectsEngine) EffectsEngine.triggerRansomware();
        if (Application) Application.addLog("Encrypting local files...", 'error');
    },
    
    steganography: function(config) {
        if (Application) {
            Application.addLog("Hiding data in image: meme.jpg...", 'info');
            setTimeout(() => Application.addLog("Data hidden successfully.", 'success'), 1000);
        }
    },
    
    torNetwork: function(config) {
        if (Application) {
            Application.addLog("Connecting to Tor network...", 'warning');
            setTimeout(() => Application.addLog("Connection established. You are anonymous.", 'success'), 1500);
        }
    },
    
    usbInfect: function(config) {
        if (Application) {
            Application.addLog("Scanning for USB devices...", 'info');
            setTimeout(() => Application.addLog("Device 'KINGSTON' infected.", 'success'), 800);
        }
    },
    
    vpnTunnel: function(config) {
        if (Application) {
            Application.addLog("Building secure VPN tunnel...", 'info');
            Application.addLog("Encryption: AES-256-GCM", 'warning');
            setTimeout(() => Application.addLog("Tunnel active.", 'success'), 1200);
        }
    },
    
    wifiCrack: function(config) {
        if (Application) {
            Application.addLog("Capturing WPA2 handshake...", 'warning');
            setTimeout(() => {
                Application.addLog("Password found: mywifi12345", 'success');
            }, 2000);
        }
    },
    
    xssAttack: function(config) {
        if (Application) {
            Application.addLog("Injecting script: <script>alert(1)</script>", 'warning');
            Application.addLog("Cookie stolen: session_id=abc123", 'success');
        }
    },
    
    zeroDay: function(config) {
        if (Application) {
            Application.addLog("Deploying unknown zero-day exploit...", 'error');
            setTimeout(() => {
                Application.addLog("CRITICAL: Target system fully compromised.", 'success');
                if (window.EffectsEngine) EffectsEngine.flashScreen('#ff0044');
            }, 1000);
        }
    },
    
    zombieBot: function(config) {
        if (Application) {
            Application.addLog("Enslaving botnet nodes...", 'warning');
            let bots = 0;
            let count = 0;
            const interval = setInterval(() => {
                bots += Math.floor(Math.random() * 100);
                Application.addLog(`Total bots: ${bots}`, 'warning');
                if (count++ > 15) clearInterval(interval);
            }, 200);
        }
    }
};

// 导出到全局作用域
window.LetterCommands = LetterCommands;
