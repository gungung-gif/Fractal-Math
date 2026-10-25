import React from 'react';
import { Preset } from '../types';
import { PRESETS } from '../lib/presets';

interface PresetsTabProps {
  onSelectPreset: (preset: Preset) => void;
  activePresetId: string;
}

export const PresetsTab: React.FC<PresetsTabProps> = ({
  onSelectPreset,
  activePresetId,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#fdfbf7] dark:bg-[#0c1322] p-6 lg:p-10 font-body-md text-[#2b2d42] dark:text-[#dce2f7] transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 pb-4 border-b border-[#eadfcf] dark:border-[#2e3545]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#f8ad9d]/30 dark:bg-[#f59e0b]/20 text-[#894f42] dark:text-[#f59e0b] font-bold border border-[#f8ad9d]/50 dark:border-[#f59e0b]/40">
              Heritage Catalog
            </span>
            <span className="text-[11px] font-mono text-[#85736f] dark:text-[#a08e7a]">
              Traditional Javanese Royal &amp; Coastal Presets
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Parametric Fractal Motif Library</h1>
          <p className="text-[13px] text-[#524340] dark:text-[#d8c3ad]">
            Select any historic motif to inspect its mathematical grammar, rotational dihedral symmetry, and canting wax specifications.
          </p>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESETS.map((preset) => {
            const isActive = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                className={`flex flex-col justify-between bg-[#ffffff] dark:bg-[#111827] border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md ${
                  isActive
                    ? 'border-[#f8ad9d] dark:border-[#f59e0b] ring-2 ring-[#f8ad9d]/30 dark:ring-[#f59e0b]/30'
                    : 'border-[#eadfcf] dark:border-[#2e3545] hover:border-[#f8ad9d]/60'
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f7f3ed] dark:bg-[#191f2f] text-[#894f42] dark:text-[#ffc174] font-semibold border border-[#eadfcf] dark:border-[#2e3545]">
                      {preset.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#70518d] dark:text-[#dfbbff] font-bold">
                      D = {preset.fractalDimension}
                    </span>
                  </div>

                  {/* Title & Javanese name */}
                  <div>
                    <h2 className="text-[17px] font-bold text-[#2b2d42] dark:text-[#dce2f7] leading-snug">
                      {preset.name}
                    </h2>
                    <span className="text-[11px] font-mono text-[#85736f] dark:text-[#a08e7a] italic">
                      {preset.javaneseName}
                    </span>
                  </div>

                  {/* Visual Preview Box */}
                  <div
                    className="h-36 rounded-xl flex items-center justify-center relative overflow-hidden border border-[#eadfcf] dark:border-[#2e3545]"
                    style={{ backgroundColor: preset.palette.background }}
                  >
                    <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
                    {/* Simplified geometric motif icon preview */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div
                        className="w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-xs"
                        style={{
                          borderColor: preset.palette.stroke,
                          backgroundColor: `${preset.palette.accent}20`,
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[32px]"
                          style={{ color: preset.palette.stroke }}
                        >
                          {preset.id.includes('truntum') ? 'flare' : preset.id.includes('bintang') ? 'star' : 'all_inclusive'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a] mt-1">
                        {preset.symmetry} • {preset.angle}°
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-[#524340] dark:text-[#d8c3ad] leading-relaxed line-clamp-3">
                    {preset.description}
                  </p>

                  {/* Math Specs Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f7f3ed] dark:bg-[#141b2b] text-[#524340] dark:text-[#d8c3ad] border border-[#eadfcf] dark:border-[#2e3545]">
                      Axiom: {preset.axiom}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f7f3ed] dark:bg-[#141b2b] text-[#524340] dark:text-[#d8c3ad] border border-[#eadfcf] dark:border-[#2e3545]">
                      Angle: {preset.angle}°
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f7f3ed] dark:bg-[#141b2b] text-[#524340] dark:text-[#d8c3ad] border border-[#eadfcf] dark:border-[#2e3545]">
                      Depth: N={preset.depth}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-2 border-t border-[#eadfcf] dark:border-[#2e3545]">
                  <button
                    onClick={() => onSelectPreset(preset)}
                    className={`w-full py-2 px-3 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#c7e8d6]/60 dark:bg-[#10b981]/25 text-[#3e6750] dark:text-[#4edea3] border border-[#c7e8d6] dark:border-[#10b981]'
                        : 'bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] hover:bg-[#e07a68] dark:hover:bg-[#d97706] hover:text-white dark:hover:text-black shadow-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isActive ? 'check_circle' : 'palette'}
                    </span>
                    <span>{isActive ? 'Active in Studio' : 'Load into Studio'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
