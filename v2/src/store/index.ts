/**
 * Visual Effects Lab - Zustand Store
 * 全局状态管理
 */

import { create } from 'zustand';
import type { IEffect, EffectParams, UserSettings, FavoriteEffect, PlaylistItem, ToastNotification } from '../types';

interface AppState {
  // 当前特效
  currentEffect: string | null;
  currentEffectInstance: IEffect | null;
  availableEffects: string[];
  
  // FPS 和性能
  fps: number;
  isPaused: boolean;
  
  // 用户设置
  settings: UserSettings;
  
  // 收藏
  favorites: FavoriteEffect[];
  
  // 播放列表
  playlist: PlaylistItem[];
  isPlayingPlaylist: boolean;
  currentPlaylistIndex: number;
  
  // Toast 通知
  toasts: ToastNotification[];
  
  // Actions
  setCurrentEffect: (name: string | null, instance?: IEffect | null) => void;
  setAvailableEffects: (effects: string[]) => void;
  setFPS: (fps: number) => void;
  togglePause: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addFavorite: (effect: FavoriteEffect) => void;
  removeFavorite: (effectName: string) => void;
  setPlaylist: (playlist: PlaylistItem[]) => void;
  togglePlaylist: () => void;
  nextPlaylistItem: () => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  quality: 'high',
  showFPS: true,
  autoPause: false,
  soundEnabled: true,
  volume: 0.5
};

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  currentEffect: null,
  currentEffectInstance: null,
  availableEffects: [],
  fps: 60,
  isPaused: false,
  settings: defaultSettings,
  favorites: [],
  playlist: [],
  isPlayingPlaylist: false,
  currentPlaylistIndex: 0,
  toasts: [],

  // Actions
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
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  addFavorite: (effect) => {
    set((state) => ({
      favorites: [...state.favorites, effect]
    }));
  },

  removeFavorite: (effectName) => {
    set((state) => ({
      favorites: state.favorites.filter(f => f.effectName !== effectName)
    }));
  },

  setPlaylist: (playlist) => {
    set({ playlist });
  },

  togglePlaylist: () => {
    set((state) => ({ 
      isPlayingPlaylist: !state.isPlayingPlaylist,
      currentPlaylistIndex: 0
    }));
  },

  nextPlaylistItem: () => {
    set((state) => ({
      currentPlaylistIndex: (state.currentPlaylistIndex + 1) % state.playlist.length
    }));
  },

  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = { 
      ...toast, 
      id,
      duration: toast.duration ?? 3000
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // 自动移除
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  }
}));
