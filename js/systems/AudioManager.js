/* ==========================================
   模块名称：systems/AudioManager.js
   功能：音效管理系统，处理按键音、事件音效、背景音乐
   版本：2.0 - 新增音效系统
   ========================================== */

/**
 * 音效管理器 - 统一管理所有音频效果
 */
const AudioManager = (function() {
    // 音频上下文
    let audioContext = null;
    
    // 音效缓存
    const sounds = {};
    
    // 音量设置
    const volumes = {
        master: 0.3,
        sfx: 0.5,
        music: 0.2
    };
    
    // 是否启用
    let enabled = true;
    
    // 预定义的音效配置
    const soundConfigs = {
        'key-press': {
            type: 'square',
            frequency: 440,
            duration: 0.05,
            volume: 0.1
        },
        'success': {
            type: 'sine',
            frequency: 880,
            duration: 0.2,
            volume: 0.2,
            slideTo: 1200
        },
        'error': {
            type: 'sawtooth',
            frequency: 200,
            duration: 0.3,
            volume: 0.2
        },
        'glitch': {
            type: 'square',
            frequency: 100,
            duration: 0.1,
            volume: 0.15,
            distortion: true
        },
        'notification': {
            type: 'sine',
            frequency: 600,
            duration: 0.15,
            volume: 0.15,
            slideTo: 800
        },
        'power-up': {
            type: 'triangle',
            frequency: 400,
            duration: 0.5,
            volume: 0.2,
            slideTo: 800
        },
        'power-down': {
            type: 'triangle',
            frequency: 800,
            duration: 0.5,
            volume: 0.2,
            slideTo: 300
        }
    };

    /**
     * 初始化音频管理器
     */
    function init() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioManager initialized");
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    /**
     * 预加载音效
     */
    function preload(soundNames) {
        if (!Array.isArray(soundNames)) {
            soundNames = [soundNames];
        }
        
        soundNames.forEach(name => {
            if (soundConfigs[name] && !sounds[name]) {
                sounds[name] = soundConfigs[name];
            }
        });
    }

    /**
     * 播放音效
     */
    function play(soundName, options = {}) {
        if (!enabled || !audioContext) return;
        
        const config = sounds[soundName] || soundConfigs[soundName];
        if (!config) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }
        
        try {
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 设置波形
            osc.type = config.type;
            
            // 设置频率
            const baseFreq = options.frequency || config.frequency;
            osc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
            
            // 频率滑动（如果有）
            if (config.slideTo) {
                osc.frequency.exponentialRampToValueAtTime(
                    config.slideTo,
                    audioContext.currentTime + config.duration
                );
            }
            
            // 设置音量包络
            const volume = (options.volume !== undefined ? options.volume : config.volume) * volumes.sfx * volumes.master;
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
            
            // 启动振荡器
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + config.duration);
            
        } catch (e) {
            console.warn("Audio play error:", e);
        }
    }

    /**
     * 播放自定义音调
     */
    function playTone(frequency, duration = 0.1, type = 'sine', volume = 0.1) {
        if (!enabled || !audioContext) return;
        
        try {
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            osc.type = type;
            osc.frequency.value = frequency;
            
            const actualVolume = volume * volumes.sfx * volumes.master;
            gainNode.gain.setValueAtTime(actualVolume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            osc.start();
            osc.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.warn("Tone play error:", e);
        }
    }

    /**
     * 播放序列音（用于连击效果）
     */
    function playSequence(notes, interval = 100) {
        if (!enabled || !audioContext) return;
        
        notes.forEach((note, index) => {
            setTimeout(() => {
                if (typeof note === 'number') {
                    playTone(note, 0.08);
                } else {
                    play(note);
                }
            }, index * interval);
        });
    }

    /**
     * 设置主音量
     */
    function setMasterVolume(value) {
        volumes.master = Math.max(0, Math.min(1, value));
    }

    /**
     * 设置音效音量
     */
    function setSfxVolume(value) {
        volumes.sfx = Math.max(0, Math.min(1, value));
    }

    /**
     * 设置音乐音量
     */
    function setMusicVolume(value) {
        volumes.music = Math.max(0, Math.min(1, value));
    }

    /**
     * 启用/禁用音效
     */
    function setEnabled(value) {
        enabled = value;
        if (!value && audioContext) {
            audioContext.suspend();
        } else if (value && audioContext) {
            audioContext.resume();
        }
    }

    /**
     * 切换音效开关
     */
    function toggle() {
        enabled = !enabled;
        setEnabled(enabled);
        return enabled;
    }

    /**
     * 获取当前状态
     */
    function getStatus() {
        return {
            enabled,
            hasContext: !!audioContext,
            volumes: { ...volumes }
        };
    }

    /**
     * 注册自定义音效
     */
    function registerSound(name, config) {
        sounds[name] = config;
        console.log(`Sound registered: ${name}`);
    }

    // 公开 API
    return {
        init,
        preload,
        play,
        playTone,
        playSequence,
        setMasterVolume,
        setSfxVolume,
        setMusicVolume,
        setEnabled,
        toggle,
        getStatus,
        registerSound
    };
})();

// 导出到全局作用域
window.AudioManager = AudioManager;
