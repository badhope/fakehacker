const CONFIG = {
    systemName: "DARK_NET_OS",
    version: "6.6.6",
    
    // 随机日志库
    logs: [
        "Initializing secure handshake...", 
        "Scanning ports: 21, 22, 80, 443, 8080...",
        "Response received: 200 OK", 
        "Injecting SQL payload: ' OR 1=1 --",
        "Mapping network topology...", 
        "Accessing shadow database...",
        "Bypassing 2FA authentication...", 
        "Downloading memory dump...",
        "Spoofing MAC address: 00:0a:95:9d:68:16", 
        "Uploading trojan.sh...",
        "Connecting to proxy server...", 
        "Clearing log files...",
        "GPU temperature: 85C",
        "Virtual machine detected.", 
        "Escaping sandbox environment..."
    ],

    // 恶搞结果库
    hackResults: [
        "SUCCESS: Target's webcam activated. Cat detected.",
        "ERROR: Firewall too strong. Try using 'sudo'.",
        "WARNING: Trace initiated. Your pizza order has been cancelled.",
        "ACCESS GRANTED: Welcome to the mainframe, Batman."
    ],

    // 假的文件系统
    fileSystem: {
        "/": ["secret", "documents", "system.log"],
        "/secret": ["passwords.txt", "nuclear_codes.doc"],
        "/documents": ["tax_returns.pdf", "diary.txt"]
    }
};

// 工具函数：生成随机IP
function randomIP() {
    return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

// 工具函数：生成随机ID
function randomID() {
    return Math.random().toString(36).substring(2, 15);
}
