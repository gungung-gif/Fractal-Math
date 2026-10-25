import React from 'react';

export type StudioSection = 'grammar' | 'parametric' | 'symmetry' | 'palette' | 'presets' | 'diagnostics';

interface SideRailProps {
  activeSection: StudioSection;
  onSelectSection: (section: StudioSection) => void;
  onOpenPreferences: () => void;
}

export const SideRail: React.FC<SideRailProps> = ({
  activeSection,
  onSelectSection,
  onOpenPreferences,
}) => {
  return (
    <aside className="w-14 bg-[#ffffff] dark:bg-[#111827] border-r border-[#eadfcf] dark:border-[#2e3545] flex flex-col items-center py-3 justify-between z-20 flex-shrink-0 shadow-xs transition-colors duration-200">
      <div className="flex flex-col items-center gap-3">
        {/* L-System Rules */}
        <button
          onClick={() => onSelectSection('grammar')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeSection === 'grammar'
              ? 'bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 border-l-2 border-[#f8ad9d] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b] shadow-xs'
              : 'text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]'
          }`}
          title="L-System Rules"
        >
          <span className="material-symbols-outlined text-[20px]">function</span>
        </button>

        {/* Transforms & Angle */}
        <button
          onClick={() => onSelectSection('parametric')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeSection === 'parametric'
              ? 'bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 border-l-2 border-[#f8ad9d] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b] shadow-xs'
              : 'text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]'
          }`}
          title="Transforms & Angle"
        >
          <span className="material-symbols-outlined text-[20px]">schema</span>
        </button>

        {/* Symmetry Matrix */}
        <button
          onClick={() => onSelectSection('symmetry')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeSection === 'symmetry'
              ? 'bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 border-l-2 border-[#f8ad9d] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b] shadow-xs'
              : 'text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]'
          }`}
          title="Symmetry Matrix"
        >
          <span className="material-symbols-outlined text-[20px]">rotate_right</span>
        </button>

        {/* Color Palette */}
        <button
          onClick={() => onSelectSection('palette')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeSection === 'palette'
              ? 'bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 border-l-2 border-[#f8ad9d] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b] shadow-xs'
              : 'text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]'
          }`}
          title="Textile Color & Canting Pigments"
        >
          <span className="material-symbols-outlined text-[20px]">palette</span>
        </button>

        {/* Preset Library */}
        <button
          onClick={() => onSelectSection('presets')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeSection === 'presets'
              ? 'bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 border-l-2 border-[#f8ad9d] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b] shadow-xs'
              : 'text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]'
          }`}
          title="Preset Library"
        >
          <span className="material-symbols-outlined text-[20px]">library_books</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 border-t border-[#eadfcf] dark:border-[#2e3545] pt-3 w-full">
        <button
          onClick={() => onSelectSection('diagnostics')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeSection === 'diagnostics'
              ? 'bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 text-[#894f42] dark:text-[#f59e0b]'
              : 'text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]'
          }`}
          title="Diagnostics & Telemetry"
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
        </button>
        <button
          onClick={onOpenPreferences}
          className="w-9 h-9 rounded-xl text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937] flex items-center justify-center transition-colors"
          title="Studio Preferences"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
    </aside>
  );
};
