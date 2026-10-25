import React, { useState } from 'react';
import { ColorPalette, ParametricConstraints, Preset, SymmetryType } from '../types';
import { COLOR_PALETTES } from '../lib/presets';

interface InspectorProps {
  axiom: string;
  onAxiomChange: (axiom: string) => void;
  rulesText: string;
  onRulesTextChange: (rulesText: string) => void;
  rulesFileName: string;
  constraints: ParametricConstraints;
  onConstraintsChange: (updates: Partial<ParametricConstraints>) => void;
  palette: ColorPalette;
  onPaletteChange: (palette: ColorPalette) => void;
  onSynthesize: () => void;
  onRandomize: () => void;
  onOpenSyntaxGuide: () => void;
  activePreset: Preset;
}

export const Inspector: React.FC<InspectorProps> = ({
  axiom,
  onAxiomChange,
  rulesText,
  onRulesTextChange,
  rulesFileName,
  constraints,
  onConstraintsChange,
  palette,
  onPaletteChange,
  onSynthesize,
  onRandomize,
  onOpenSyntaxGuide,
}) => {
  const [copiedAxiom, setCopiedAxiom] = useState(false);
  const [showPaletteModal, setShowPaletteModal] = useState(false);

  const handleCopyAxiom = () => {
    navigator.clipboard.writeText(axiom);
    setCopiedAxiom(true);
    setTimeout(() => setCopiedAxiom(false), 1500);
  };

  const getSymmetryBadge = (sym: SymmetryType) => {
    switch (sym) {
      case '4fold':
        return 'Dihedral D4';
      case '6fold':
        return 'Dihedral D6';
      case '8fold':
        return 'Dihedral D8';
      case '12fold':
        return 'Dihedral D12';
      default:
        return 'C1 Single';
    }
  };

  const ruleLines = rulesText.split('\n');

  return (
    <aside className="w-96 bg-[#ffffff] dark:bg-[#111827] border-r border-[#eadfcf] dark:border-[#2e3545] flex flex-col justify-between overflow-y-auto custom-scroll z-10 flex-shrink-0 shadow-xs transition-colors duration-200">
      {/* Studio Header / Mode Status */}
      <div className="p-4 border-b border-[#eadfcf] dark:border-[#2e3545] bg-[#f7f3ed]/60 dark:bg-[#141b2b]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#f8ad9d]/20 dark:bg-[#f59e0b]/20 border border-[#f8ad9d]/40 dark:border-[#f59e0b]/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#894f42] dark:text-[#f59e0b] text-[16px]">
                all_inclusive
              </span>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#2b2d42] dark:text-[#dce2f7] leading-tight">
                Fractal Generator
              </h2>
              <p className="text-[9px] font-mono text-[#524340] dark:text-[#a08e7a]">
                Parametric Studio v2.4 • L-System Kernel
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-[#c7e8d6]/50 dark:bg-[#10b981]/20 text-[#3e6750] dark:text-[#4edea3] border border-[#c7e8d6] dark:border-[#10b981]/40 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84dcc6] dark:bg-[#10b981]" />
            Ready
          </span>
        </div>
      </div>

      {/* Main Parameter Stack */}
      <div className="p-4 flex flex-col gap-3.5 bg-[#f7f3ed]/20 dark:bg-[#0c1322]/40">
        {/* SECTION 1: Mathematical Grammar */}
        <div className="flex flex-col gap-2 bg-[#ffffff] dark:bg-[#191f2f] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#e07a68] dark:text-[#f59e0b]">
                menu_book
              </span>
              Mathematical Grammar
            </span>
            <span className="text-[9px] font-mono text-[#2b2d42] dark:text-[#dce2f7] px-2 py-0.5 rounded-full bg-[#e2d4f0]/60 dark:bg-[#70518d]/30 border border-[#e2d4f0] dark:border-[#70518d] font-medium">
              L-System
            </span>
          </div>

          {/* Axiom Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-mono text-[#524340] dark:text-[#a08e7a] flex justify-between font-semibold">
              <span>AXIOM (STARTING SEED)</span>
              <span className="font-normal">Symbol: ω</span>
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-[#f7f3ed]/40 dark:bg-[#141b2b]/60 border border-[#eadfcf] dark:border-[#2e3545] focus:border-[#f8ad9d] dark:focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f8ad9d] rounded-lg px-2.5 py-1.5 text-[13px] font-mono text-[#70518d] dark:text-[#ffc174] font-semibold uppercase tracking-wider pr-16"
                spellCheck="false"
                type="text"
                value={axiom}
                onChange={(e) => onAxiomChange(e.target.value.toUpperCase())}
              />
              <div className="absolute right-1 flex items-center gap-0.5 text-[#524340] dark:text-[#a08e7a]">
                <button
                  onClick={handleCopyAxiom}
                  className="p-1 hover:text-[#894f42] dark:hover:text-[#f59e0b] transition-colors"
                  title="Copy Axiom"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedAxiom ? 'check' : 'content_copy'}
                  </span>
                </button>
                <button
                  onClick={() => onAxiomChange('')}
                  className="p-1 hover:text-red-500 transition-colors"
                  title="Clear Axiom"
                >
                  <span className="material-symbols-outlined text-[14px]">backspace</span>
                </button>
              </div>
            </div>
          </div>

          {/* L-System Rules Editor */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] font-mono text-[#524340] dark:text-[#a08e7a] font-semibold">
              <span>PRODUCTION RULES (P)</span>
              <button
                onClick={onOpenSyntaxGuide}
                className="text-[#e07a68] dark:text-[#f59e0b] hover:underline cursor-pointer flex items-center gap-0.5"
                title="Rules Syntax Reference"
              >
                <span className="material-symbols-outlined text-[12px]">help_outline</span>
                Syntax Guide
              </button>
            </div>
            <div className="bg-[#ffffff] dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] rounded-lg overflow-hidden flex flex-col shadow-xs">
              <div className="bg-[#f7f3ed] dark:bg-[#111827] px-2.5 py-1 flex justify-between items-center border-b border-[#eadfcf] dark:border-[#2e3545] text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a] font-medium">
                <span className="text-[#2b2d42] dark:text-[#dce2f7] font-semibold">
                  {rulesFileName}
                </span>
                <span>UTF-8</span>
              </div>
              <div className="flex text-[11px] font-mono leading-5 p-2 bg-[#fdfcf9] dark:bg-[#0c1322]">
                <div className="text-[#85736f]/50 dark:text-[#534434] select-none pr-2.5 text-right border-r border-[#eadfcf] dark:border-[#2e3545] mr-2 flex flex-col font-mono">
                  {ruleLines.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  className="flex-1 bg-transparent border-0 p-0 text-[#2b2d42] dark:text-[#dce2f7] font-mono text-[11px] leading-5 resize-none focus:outline-none whitespace-pre overflow-x-auto min-h-[70px]"
                  spellCheck="false"
                  value={rulesText}
                  onChange={(e) => onRulesTextChange(e.target.value)}
                  rows={Math.max(3, ruleLines.length)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Parametric Constraints */}
        <div className="flex flex-col gap-2 bg-[#ffffff] dark:bg-[#191f2f] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#e07a68] dark:text-[#f59e0b]">
                tune
              </span>
              Parametric Constraints
            </span>
            <span className="text-[9px] font-mono text-[#3e6750] dark:text-[#4edea3] px-2 py-0.5 rounded-full bg-[#c7e8d6]/50 dark:bg-[#10b981]/20 border border-[#c7e8d6] dark:border-[#10b981]/40 font-medium">
              Geometric
            </span>
          </div>

          {/* Slider 1: Branching Angle */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-[#524340] dark:text-[#a08e7a] font-semibold">BRANCHING ANGLE (θ)</span>
              <div className="flex items-center gap-1 bg-[#f7f3ed] dark:bg-[#141b2b] px-2 py-0.5 rounded-md border border-[#eadfcf] dark:border-[#2e3545]">
                <input
                  className="w-10 bg-transparent text-right font-mono text-[11px] text-[#2b2d42] dark:text-[#dce2f7] font-bold focus:outline-none"
                  type="number"
                  min="0"
                  max="180"
                  step="0.5"
                  value={constraints.angle}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onConstraintsChange({ angle: Math.min(180, Math.max(0, val)) });
                  }}
                />
                <span className="text-[#85736f] dark:text-[#a08e7a] text-[9px]">°</span>
              </div>
            </div>
            <input
              className="w-full h-1.5 bg-[#ebe8e2] dark:bg-[#2e3545] rounded-full appearance-none cursor-pointer slider-thumb"
              max="180"
              min="0"
              step="0.5"
              type="range"
              value={constraints.angle}
              onChange={(e) => onConstraintsChange({ angle: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a] px-0.5">
              <button onClick={() => onConstraintsChange({ angle: 0 })} className="hover:text-[#2b2d42] dark:hover:text-white">0°</button>
              <button onClick={() => onConstraintsChange({ angle: 45 })} className="hover:text-[#2b2d42] dark:hover:text-white">45° (Batik)</button>
              <button onClick={() => onConstraintsChange({ angle: 60 })} className="text-[#e07a68] dark:text-[#f59e0b] font-medium">60° (Truntum)</button>
              <button onClick={() => onConstraintsChange({ angle: 90 })} className="hover:text-[#2b2d42] dark:hover:text-white">90°</button>
              <button onClick={() => onConstraintsChange({ angle: 180 })} className="hover:text-[#2b2d42] dark:hover:text-white">180°</button>
            </div>
          </div>

          {/* Slider 2: Recursion Depth */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-[#524340] dark:text-[#a08e7a] font-semibold">RECURSION DEPTH (N)</span>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f8ad9d]/25 dark:bg-[#f59e0b]/20 text-[#753f33] dark:text-[#f59e0b] font-semibold border border-[#f8ad9d]/50 dark:border-[#f59e0b]/40">
                  N = {constraints.depth}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1 pt-1">
              {[1, 2, 3, 4, 5, 6].map((level) => {
                const isActive = constraints.depth === level;
                return (
                  <button
                    key={level}
                    onClick={() => onConstraintsChange({ depth: level })}
                    className={`py-1 rounded-lg text-center text-[10px] font-mono transition-all ${
                      isActive
                        ? 'bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold border border-[#f8ad9d] dark:border-[#f59e0b] shadow-xs'
                        : 'bg-[#f7f3ed] dark:bg-[#141b2b] text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white hover:bg-[#ebe8e2] dark:hover:bg-[#1f2937] border border-[#eadfcf] dark:border-[#2e3545]'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider 3: Step Length & Line Thickness */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-[#524340] dark:text-[#a08e7a] font-semibold">STEP LENGTH</span>
                <span className="font-mono text-[#2b2d42] dark:text-[#dce2f7] font-bold">
                  {constraints.stepLength.toFixed(1)} px
                </span>
              </div>
              <input
                className="w-full h-1.5 bg-[#ebe8e2] dark:bg-[#2e3545] rounded-full appearance-none cursor-pointer slider-thumb"
                max="30"
                min="1"
                step="0.5"
                type="range"
                value={constraints.stepLength}
                onChange={(e) => onConstraintsChange({ stepLength: parseFloat(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-[#524340] dark:text-[#a08e7a] font-semibold">THICKNESS</span>
                <span className="font-mono text-[#2b2d42] dark:text-[#dce2f7] font-bold">
                  {constraints.thickness.toFixed(2)} px
                </span>
              </div>
              <input
                className="w-full h-1.5 bg-[#ebe8e2] dark:bg-[#2e3545] rounded-full appearance-none cursor-pointer slider-thumb"
                max="8"
                min="0.5"
                step="0.25"
                type="range"
                value={constraints.thickness}
                onChange={(e) => onConstraintsChange({ thickness: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Batik Symmetry & Structure Dropdown */}
        <div className="flex flex-col gap-2 bg-[#ffffff] dark:bg-[#191f2f] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#e07a68] dark:text-[#f59e0b]">
                join_inner
              </span>
              Batik Symmetry &amp; Grid Matrix
            </span>
            <span className="text-[9px] font-mono text-[#70518d] dark:text-[#dfbbff] px-2 py-0.5 rounded-full bg-[#e2d4f0]/60 dark:bg-[#70518d]/30 border border-[#e2d4f0] dark:border-[#70518d] font-medium">
              {getSymmetryBadge(constraints.symmetry)}
            </span>
          </div>

          <div className="relative">
            <select
              value={constraints.symmetry}
              onChange={(e) => onConstraintsChange({ symmetry: e.target.value as SymmetryType })}
              className="w-full bg-[#f7f3ed]/50 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] rounded-lg px-2.5 py-1.5 text-[12px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-medium focus:border-[#f8ad9d] dark:focus:border-[#f59e0b] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="none">None (Single Plane)</option>
              <option value="4fold">4-Fold (Ceplok / Parang Rusak Matrix)</option>
              <option value="6fold">6-Fold (Hexagonal Truntum Lattice)</option>
              <option value="8fold">8-Fold (Mandala Cirebon Sunburst)</option>
              <option value="12fold">12-Fold (Royal Sultanate Rosette)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#85736f] dark:text-[#a08e7a] pointer-events-none text-[16px]">
              unfold_more
            </span>
          </div>

          {/* Taper Profile & Juring Wax Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#524340] dark:text-[#d8c3ad] font-medium">
              Canting Bleed &amp; Juring Wax
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={constraints.cantingBleed}
                onChange={(e) => onConstraintsChange({ cantingBleed: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#ebe8e2] dark:bg-[#2e3545] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#f8ad9d] dark:peer-checked:bg-[#f59e0b]" />
            </label>
          </div>
        </div>

        {/* SECTION 4: Color & Textile Palette */}
        <div className="flex flex-col gap-2 bg-[#ffffff] dark:bg-[#191f2f] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#e07a68] dark:text-[#f59e0b]">
                palette
              </span>
              Textile Dye &amp; Canting Pigments
            </span>
            <button
              onClick={() => setShowPaletteModal(!showPaletteModal)}
              className="text-[9px] font-mono text-[#e07a68] dark:text-[#f59e0b] hover:underline cursor-pointer font-medium"
            >
              Palettes
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Stroke Swatch */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-[#524340] dark:text-[#a08e7a] font-semibold uppercase">
                CANTING STROKE
              </span>
              <div 
                onClick={() => setShowPaletteModal(true)}
                className="flex items-center gap-2 bg-[#f7f3ed]/50 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] rounded-lg p-1.5 cursor-pointer hover:border-[#f8ad9d] transition-colors"
              >
                <div
                  className="w-5 h-5 rounded-md border border-white shadow-xs flex-shrink-0"
                  style={{ backgroundColor: palette.stroke }}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-mono text-[10px] text-[#2b2d42] dark:text-[#dce2f7] uppercase font-bold truncate">
                    {palette.stroke}
                  </span>
                  <span className="text-[9px] text-[#85736f] dark:text-[#a08e7a] leading-none truncate">
                    {palette.strokeName}
                  </span>
                </div>
              </div>
            </div>

            {/* Background Swatch */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-[#524340] dark:text-[#a08e7a] font-semibold uppercase">
                MORI FABRIC
              </span>
              <div 
                onClick={() => setShowPaletteModal(true)}
                className="flex items-center gap-2 bg-[#f7f3ed]/50 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] rounded-lg p-1.5 cursor-pointer hover:border-[#f8ad9d] transition-colors"
              >
                <div
                  className="w-5 h-5 rounded-md border border-[#eadfcf] dark:border-[#2e3545] shadow-xs flex-shrink-0"
                  style={{ backgroundColor: palette.background }}
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-mono text-[10px] text-[#2b2d42] dark:text-[#dce2f7] uppercase font-bold truncate">
                    {palette.background}
                  </span>
                  <span className="text-[9px] text-[#85736f] dark:text-[#a08e7a] leading-none truncate">
                    {palette.backgroundName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Palette Switcher Drawer */}
          {showPaletteModal && (
            <div className="pt-2 border-t border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a]">Select Traditional Dye Theme:</span>
              <div className="grid grid-cols-3 gap-1">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => {
                      onPaletteChange(pal);
                      setShowPaletteModal(false);
                    }}
                    className={`p-1.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      palette.id === pal.id
                        ? 'border-[#f8ad9d] dark:border-[#f59e0b] bg-[#f8ad9d]/10'
                        : 'border-[#eadfcf] dark:border-[#2e3545] bg-[#f7f3ed]/40 hover:bg-[#ebe8e2] dark:bg-[#141b2b]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: pal.stroke }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: pal.background }} />
                    </div>
                    <span className="text-[9px] font-mono text-[#2b2d42] dark:text-[#dce2f7] truncate">
                      {pal.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#eadfcf] dark:border-[#2e3545] bg-[#ffffff] dark:bg-[#111827] flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSynthesize}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold hover:bg-[#e07a68] dark:hover:bg-[#d97706] hover:text-white dark:hover:text-black active:scale-[0.98] transition-all text-[11px] font-mono shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            <span>Synthesize</span>
          </button>
          <button
            onClick={onRandomize}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#f7f3ed] dark:bg-[#141b2b] hover:bg-[#ebe8e2] dark:hover:bg-[#1f2937] text-[#2b2d42] dark:text-[#dce2f7] border border-[#eadfcf] dark:border-[#2e3545] active:scale-[0.98] transition-all text-[11px] font-mono font-medium"
          >
            <span className="material-symbols-outlined text-[16px] text-[#e07a68] dark:text-[#f59e0b]">
              shuffle
            </span>
            <span>Randomize</span>
          </button>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a] px-1">
          <span>Engine: WebGL2 Javanese Math v2</span>
          <span className="text-[#3e6750] dark:text-[#4edea3] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84dcc6] dark:bg-[#10b981]" /> 60 FPS
          </span>
        </div>
      </div>
    </aside>
  );
};
