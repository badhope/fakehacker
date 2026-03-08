import { useState } from 'react';
import { useAppStore } from '../store';

interface ControlPanelProps {
  onLoadEffect: (effectName: string) => void;
}

interface EffectCategory {
  name: string;
  title: string;
  icon: string;
  effects: string[];
}

export function ControlPanel({ onLoadEffect }: ControlPanelProps) {
  const { availableEffects, currentEffect } = useAppStore();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // 按类别分组特效
  const categories: EffectCategory[] = [
    {
      name: 'horizontal',
      title: '横向排列',
      icon: '⟷',
      effects: availableEffects.filter(name => 
        name.includes('Horizontal') || 
        name.includes('Wave') || 
        name.includes('Particle') ||
        name.includes('Text') ||
        name.includes('Color')
      )
    },
    {
      name: 'vertical',
      title: '纵向排列',
      icon: '⟳',
      effects: availableEffects.filter(name =>
        name.includes('Vertical') ||
        name.includes('Rain') ||
        name.includes('Cascade') ||
        name.includes('Falling') ||
        name.includes('Star')
      )
    },
    {
      name: 'diagonal',
      title: '斜向排列',
      icon: '⤡',
      effects: availableEffects.filter(name =>
        name.includes('Diagonal') ||
        name.includes('Angular') ||
        name.includes('Slash')
      )
    },
    {
      name: 'dynamic',
      title: '动态变化',
      icon: '⟳',
      effects: availableEffects.filter(name =>
        name.includes('Pulse') ||
        name.includes('Breathing') ||
        name.includes('Morphing')
      )
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const handleEffectClick = (effectName: string) => {
    onLoadEffect(effectName);
  };

  return (
    <aside className="absolute left-0 top-0 w-[300px] h-full bg-[var(--bg-panel)] backdrop-blur-md border-r border-[rgba(0,255,255,0.3)] p-5 pointer-events-auto overflow-y-auto z-[30]">
      <h2 className="text-base font-bold text-[var(--primary-cyan)] mb-4 border-b border-[var(--primary-cyan)] pb-2.5">
        ⚡ 特效列表
      </h2>
      
      {categories.map(category => (
        <div key={category.name} className="mb-5">
          <h3
            className="text-sm text-[var(--primary-green)] mb-2.5 cursor-pointer flex justify-between items-center transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] p-2 rounded hover:text-[var(--primary-cyan)] hover:bg-[rgba(0,255,255,0.05)]"
            onClick={() => toggleCategory(category.name)}
          >
            <span>{category.icon} {category.title}</span>
            <span className={`text-[10px] transition-transform duration-300 ${collapsedCategories.has(category.name) ? '-rotate-90' : ''}`}>
              ▼
            </span>
          </h3>
          
          <ul className={`list-none max-h-[500px] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${collapsedCategories.has(category.name) ? 'max-h-0 mb-0' : 'mb-0'}`}>
            {category.effects.map(effectName => (
              <li
                key={effectName}
                className={`p-2 m-1 bg-[rgba(0,255,255,0.1)] border border-transparent rounded cursor-pointer text-[13px] text-[var(--text-secondary)] transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-[rgba(0,255,255,0.2)] hover:border-[var(--primary-cyan)] hover:translate-x-1.5 hover:text-[var(--text-primary)] ${currentEffect === effectName ? 'bg-[rgba(0,255,255,0.3)] border-[var(--primary-cyan)] shadow-[0_0_10px_rgba(0,255,255,0.3)] text-[var(--text-primary)]' : ''}`}
                onClick={() => handleEffectClick(effectName)}
              >
                {effectName.replace(/([A-Z])/g, ' $1').trim()}
              </li>
            ))}
            {category.effects.length === 0 && (
              <li className="text-xs text-[var(--text-muted)] p-2">暂无特效</li>
            )}
          </ul>
        </div>
      ))}
      
      <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.1)]">
        <h2 className="text-base font-bold text-[var(--primary-cyan)] mb-4">
          🎛️ 参数控制
        </h2>
        <div className="text-xs text-[var(--text-muted)]">
          选择一个特效以调节参数
        </div>
      </div>
    </aside>
  );
}
