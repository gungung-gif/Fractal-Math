import React, { useState } from 'react';
import { ThemeMode } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}) => {
  const [autoSynthesize, setAutoSynthesize] = useState(true);
  const [highDpi, setHighDpi] = useState(true);
  const [showGuides, setShowGuides] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col font-body-md text-[#2b2d42] dark:text-[#dce2f7] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#eadfcf] dark:border-[#2e3545] flex items-center justify-between bg-[#f7f3ed]/60 dark:bg-[#141b2b]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[20px]">
              tune
            </span>
            <h3 className="font-bold text-[15px]">Studio Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#85736f] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-[12px]">
          {/* Theme setting */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
            <div className="flex flex-col">
              <span className="font-bold">Color Theme Archetype</span>
              <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a]">
                {theme === 'light' ? 'Porcelain Algorhythm (Warm Light)' : 'Fractal Batik Workstation (Midnight)'}
              </span>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-lg bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-mono font-bold text-[10px]"
            >
              Toggle
            </button>
          </div>

          {/* Auto Synthesize */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
            <div className="flex flex-col">
              <span className="font-bold">Continuous Auto-Synthesize</span>
              <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a]">
                Recalculate turtle vectors live while adjusting sliders
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSynthesize}
                onChange={(e) => setAutoSynthesize(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#ebe8e2] dark:bg-[#2e3545] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#f8ad9d] dark:peer-checked:bg-[#f59e0b]" />
            </label>
          </div>

          {/* High DPI */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
            <div className="flex flex-col">
              <span className="font-bold">Sub-Pixel Antialiasing</span>
              <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a]">
                Smooth canting wax edges and micro-filaments
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={highDpi}
                onChange={(e) => setHighDpi(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#ebe8e2] dark:bg-[#2e3545] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#f8ad9d] dark:peer-checked:bg-[#f59e0b]" />
            </label>
          </div>

          {/* Radial Guides */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
            <div className="flex flex-col">
              <span className="font-bold">Symmetry Orbit Guides</span>
              <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a]">
                Display concentric dashed mandala orbit circles
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showGuides}
                onChange={(e) => setShowGuides(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#ebe8e2] dark:bg-[#2e3545] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#f8ad9d] dark:peer-checked:bg-[#f59e0b]" />
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-[#eadfcf] dark:border-[#2e3545] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold text-[11px] font-mono hover:bg-[#e07a68] transition-all shadow-xs"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
