const PortScanner = {
    openWindow: function(targetIP) {
        const content = `
            <div class="scanner-container">
                <div style="margin-bottom: 10px;">Target: <span style="color:var(--accent-color)">${targetIP}</span></div>
                <div id="scan-output" style="height: 250px; background: #000; padding: 10px; border: 1px solid var(--dim-color); overflow-y: auto; font-size: 12px;"></div>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button class="hack-btn" onclick="PortScanner.startScan('${targetIP}')">START SCAN</button>
                    <button class="hack-btn" style="border-color: var(--alert-color); color: var(--alert-color);" onclick="PortScanner.attack('${targetIP}')">DEPLOY PAYLOAD</button>
                </div>
            </div>
        `;
        windowManager.createWindow('win-scanner', 'PORT SCANNER v2.0', content, {width: 500, height: 400});
    },

    startScan: function(targetIP) {
        const output = document.getElementById('scan-output');
        if (!output) return;
        output.innerHTML = '';
        
        this.log(output, `Initiating SYN Scan on ${targetIP}...`, 'info');
        
        // 常见端口列表
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 139, 443, 445, 8080, 3306, 3389];
        // 恶搞服务列表
        const fakeServices = [
            "ssh (OpenSSH 7.9)", 
            "http (nginx)", 
            "microsoft-ds (Secret File Share)",
            "mysql (Unprotected DB)",
            "vnc (VNC Access - No Password!)",
            "telnet (Legacy System)",
            "quake-halflife (Game Server)",
            "pizza-delivery (Order Service)"
        ];

        let delay = 0;
        commonPorts.forEach((port, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                // 随机决定端口是否开启 (30%概率)
                const isOpen = Math.random() > 0.7;
                
                if (isOpen) {
                    const service = fakeServices[Math.floor(Math.random() * fakeServices.length)];
                    this.log(output, `Discovered open port ${port}/tcp --> ${service}`, 'success');
                    // 随机触发一个轻微的警报效果
                    if (Math.random() > 0.8) App.effects.flash();
                } else {
                    // 只显示少量关闭的端口，避免刷屏
                    if (Math.random() > 0.9) this.log(output, `Port ${port}/tcp closed`, 'dim');
                }
                
                // 更新状态栏
                const status = document.getElementById('status-win-scanner');
                if (status) status.innerText = `Scanning: ${Math.floor((index/commonPorts.length)*100)}%`;
                
            }, delay);
        });

        // 扫描结束
        setTimeout(() => {
            this.log(output, "Scan complete. Potential vulnerabilities found.", 'warning');
            const status = document.getElementById('status-win-scanner');
            if (status) status.innerText = "Complete";
        }, delay + 500);
    },

    attack: function(targetIP) {
        const output = document.getElementById('scan-output');
        if (!output) return;
        
        this.log(output, "PACKET INJECTION INITIATED...", 'warning');
        this.log(output, "Overwriting sector 0...", 'error');
        this.log(output, "CRITICAL FAILURE: Target system too powerful. Counter-measure engaged.", 'error');
        
        // 模拟反击：关闭窗口
        setTimeout(() => {
            windowManager.closeWindow('win-scanner');
            terminal.print("CONNECTION RESET BY PEER. Your IP has been reported (not really).", 'error');
        }, 2000);
    },

    log: function(container, text, type = 'normal') {
        const line = document.createElement('div');
        line.style.color = type === 'success' ? '#00ff00' : type === 'error' ? '#ff3333' : type === 'info' ? '#00ffff' : type === 'warning' ? '#ffaa00' : '#888';
        line.innerText = `> ${text}`;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    }
};
