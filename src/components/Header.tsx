import React, { useState } from 'react';
import { Preset, ThemeMode } from '../types';

interface HeaderProps {
  currentTab: 'canvas' | 'formulas' | 'presets' | 'history';
  onSelectTab: (tab: 'canvas' | 'formulas' | 'presets' | 'history') => void;
  activePreset: Preset;
  presets: Preset[];
  onSelectPreset: (preset: Preset) => void;
  onRandomizeSeed: () => void;
  onGenerate: () => void;
  onOpenExport: (format: 'SVG' | 'PNG' | 'JSON') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenPreferences: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activePreset,
  presets,
  onSelectPreset,
  onRandomizeSeed,
  onGenerate,
  onOpenExport,
  theme,
  onToggleTheme,
  onOpenPreferences,
  onOpenHelp,
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="w-full h-14 px-4 flex items-center justify-between border-b border-[#eadfcf] dark:border-[#2e3545] bg-[#ffffff]/90 dark:bg-[#111827]/90 backdrop-blur-md z-30 flex-shrink-0 shadow-xs transition-colors duration-200">
      {/* Left: Brand Anchor & Title */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => onSelectTab('canvas')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          {/* Pastel Coral Batik Motif Badge */}
          <div className="w-8 h-8 rounded-lg bg-[#fcd5ce]/50 dark:bg-[#f59e0b]/20 border border-[#f8ad9d]/40 dark:border-[#f59e0b]/40 flex items-center justify-center relative overflow-hidden shadow-xs transition-transform group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f8ad9d]/30 dark:from-[#f59e0b]/30 via-transparent to-[#e2d4f0]/30 dark:to-[#06b6d4]/30" />
            <span className="material-symbols-outlined text-[#894f42] dark:text-[#ffc174] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              polyline
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-tight text-[#2b2d42] dark:text-[#dce2f7] text-[15px]">BatikMath</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#f8ad9d]/25 dark:bg-[#f59e0b]/20 text-[#894f42] dark:text-[#ffc174] font-semibold border border-[#f8ad9d]/40 dark:border-[#f59e0b]/40">
                v2.4
              </span>
            </div>
            <span className="text-[10px] text-[#524340] dark:text-[#d8c3ad] font-normal tracking-wide">
              Parametric Fractal &amp; Batik Studio
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-4 text-[12px] font-mono ml-4">
          <button
            onClick={() => onSelectTab('canvas')}
            className={`pb-1 flex items-center gap-1.5 font-semibold transition-all border-b-2 ${
              currentTab === 'canvas'
                ? 'border-[#894f42] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b]'
                : 'border-transparent text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#dce2f7]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">draw</span>
            Canvas
          </button>
          <button
            onClick={() => onSelectTab('formulas')}
            className={`pb-1 flex items-center gap-1.5 font-medium transition-all border-b-2 ${
              currentTab === 'formulas'
                ? 'border-[#894f42] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b]'
                : 'border-transparent text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#dce2f7]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">function</span>
            Formulas
          </button>
          <button
            onClick={() => onSelectTab('presets')}
            className={`pb-1 flex items-center gap-1.5 font-medium transition-all border-b-2 ${
              currentTab === 'presets'
                ? 'border-[#894f42] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b]'
                : 'border-transparent text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#dce2f7]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome_motion</span>
            Presets
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`pb-1 flex items-center gap-1.5 font-medium transition-all border-b-2 ${
              currentTab === 'history'
                ? 'border-[#894f42] dark:border-[#f59e0b] text-[#894f42] dark:text-[#f59e0b]'
                : 'border-transparent text-[#524340] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-[#dce2f7]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            Export History
          </button>
        </nav>
      </div>

      {/* Center: Preset Quick Select Chips */}
      <div className="hidden xl:flex items-center gap-1.5 bg-[#f7f3ed] dark:bg-[#141b2b] px-2 py-1 rounded-full border border-[#eadfcf] dark:border-[#2e3545]">
        <span className="text-[10px] font-mono text-[#85736f] dark:text-[#a08e7a] mr-1 font-semibold">PRESET:</span>
        {presets.slice(0, 4).map((preset) => {
          const isActive = activePreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all ${
                isActive
                  ? 'bg-[#f8ad9d]/30 dark:bg-[#f59e0b]/25 text-[#753f33] dark:text-[#f59e0b] border border-[#f8ad9d] dark:border-[#f59e0b] font-bold shadow-xs'
                  : 'text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-[#ffffff] hover:bg-[#ebe8e2] dark:hover:bg-[#1f2937]'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Right: Trailing Actions */}
      <div className="flex items-center gap-2">
        {/* Randomize Seed Quick Action */}
        <button
          onClick={onRandomizeSeed}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#eadfcf] dark:border-[#2e3545] bg-[#ffffff] dark:bg-[#191f2f] hover:border-[#f8ad9d] dark:hover:border-[#f59e0b] text-[#2b2d42] dark:text-[#dce2f7] hover:text-[#894f42] dark:hover:text-[#f59e0b] text-[11px] font-mono transition-all active:scale-[0.98] shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] text-[#e07a68] dark:text-[#f59e0b]">casino</span>
          <span className="hidden sm:inline font-medium">Randomize Seed</span>
        </button>

        {/* Trailing Primary Action: Generate Pattern */}
        <button
          onClick={onGenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold hover:bg-[#e07a68] dark:hover:bg-[#d97706] hover:text-white dark:hover:text-black active:scale-[0.98] transition-all text-[11px] font-mono shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Generate Pattern</span>
        </button>

        {/* Trailing Secondary Action: Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f7f3ed] dark:bg-[#141b2b] hover:bg-[#ebe8e2] dark:hover:bg-[#1f2937] text-[#2b2d42] dark:text-[#dce2f7] text-[11px] font-mono border border-[#eadfcf] dark:border-[#2e3545] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {exportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 mt-1 w-48 bg-[#ffffff] dark:bg-[#191f2f] border border-[#eadfcf] dark:border-[#2e3545] rounded-xl shadow-xl py-1.5 z-50 text-[11px] font-mono">
                <button
                  onClick={() => {
                    setExportOpen(false);
                    onOpenExport('SVG');
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between text-[#2b2d42] dark:text-[#dce2f7] hover:bg-[#f7f3ed] dark:hover:bg-[#232a3a] hover:text-[#894f42] dark:hover:text-[#f59e0b] text-left transition-colors"
                >
                  <span className="font-semibold">SVG Vector (Path)</span>
                  <span className="text-[9px] text-[#85736f] dark:text-[#a08e7a]">Scale free</span>
                </button>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    onOpenExport('PNG');
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between text-[#2b2d42] dark:text-[#dce2f7] hover:bg-[#f7f3ed] dark:hover:bg-[#232a3a] hover:text-[#894f42] dark:hover:text-[#f59e0b] text-left transition-colors"
                >
                  <span className="font-semibold">PNG Raster (2400px)</span>
                  <span className="text-[9px] text-[#85736f] dark:text-[#a08e7a]">4X High-res</span>
                </button>
                <button
                  onClick={() => {
                    setExportOpen(false);
                    onOpenExport('JSON');
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between text-[#2b2d42] dark:text-[#dce2f7] hover:bg-[#f7f3ed] dark:hover:bg-[#232a3a] hover:text-[#894f42] dark:hover:text-[#f59e0b] text-left transition-colors"
                >
                  <span className="font-semibold">L-System JSON Formula</span>
                  <span className="text-[9px] text-[#85736f] dark:text-[#a08e7a]">Config</span>
                </button>
              </div>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-[#eadfcf] dark:bg-[#2e3545] mx-0.5" />

        {/* THEME TOGGLE BUTTON */}
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#eadfcf] dark:border-[#2e3545] bg-[#fcd5ce]/40 dark:bg-[#1f2937] hover:bg-[#fcd5ce] dark:hover:bg-[#2e3545] text-[#2b2d42] dark:text-[#dce2f7] transition-all active:scale-95 shadow-xs"
          title={theme === 'light' ? 'Switch to Midnight Batik Workstation' : 'Switch to Porcelain Algorhythm'}
        >
          <span className="material-symbols-outlined text-[17px] text-[#e07a68] dark:text-[#f59e0b]">
            palette
          </span>
          <span className="text-[10px] font-mono font-semibold tracking-wide">
            {theme === 'light' ? 'Pastel' : 'Dark Studio'}
          </span>
        </button>

        <div className="h-4 w-px bg-[#eadfcf] dark:bg-[#2e3545] mx-0.5" />

        {/* Icon Actions */}
        <button
          onClick={onOpenPreferences}
          className="p-1.5 rounded-lg hover:bg-[#f1ede7] dark:hover:bg-[#1f2937] text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-[#ffffff] transition-colors"
          title="Tune Parameters"
        >
          <span className="material-symbols-outlined">tune</span>
        </button>
        <button
          onClick={onOpenHelp}
          className="p-1.5 rounded-lg hover:bg-[#f1ede7] dark:hover:bg-[#1f2937] text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-[#ffffff] transition-colors"
          title="Documentation & Formula Syntax"
        >
          <span className="material-symbols-outlined">help</span>
        </button>

        {/* Profile Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#e2d4f0]/60 dark:bg-[#70518d]/40 border border-[#8a70a8]/30 dark:border-[#8a70a8]/60 flex items-center justify-center overflow-hidden ml-1">
          <span className="material-symbols-outlined text-[#70518d] dark:text-[#dfbbff] text-[18px]">
            person
          </span>
        </div>
      </div>
    </header>
  );
};
