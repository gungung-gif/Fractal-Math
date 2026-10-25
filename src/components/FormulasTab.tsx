import React, { useState } from 'react';
import { PRESETS } from '../lib/presets';

export const FormulasTab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('parang-rusak');
  const [customN, setCustomN] = useState<number>(4);
  const [customS, setCustomS] = useState<number>(3);

  const preset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // Calculate theoretical Hausdorff dimension: log(N) / log(S)
  const calculatedD = (Math.log(customN) / Math.log(customS)).toFixed(3);

  return (
    <div className="flex-1 overflow-y-auto bg-[#fdfbf7] dark:bg-[#0c1322] p-6 lg:p-10 font-body-md text-[#2b2d42] dark:text-[#dce2f7] transition-colors duration-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header Banner */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#eadfcf] dark:border-[#2e3545]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#f8ad9d]/30 dark:bg-[#f59e0b]/20 text-[#894f42] dark:text-[#f59e0b] font-bold border border-[#f8ad9d]/50 dark:border-[#f59e0b]/40">
              Computational Ethnomathematics
            </span>
            <span className="text-[11px] font-mono text-[#85736f] dark:text-[#a08e7a]">
              L-Systems &amp; Fractal Geometry in Javanese Batik
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#2b2d42] dark:text-[#dce2f7]">
            Mathematical Foundations of Batik Fractality
          </h1>
          <p className="text-[13px] text-[#524340] dark:text-[#d8c3ad] max-w-3xl leading-relaxed">
            Long before Benoît Mandelbrot coined the term &quot;fractal&quot; in 1975, centuries of Javanese royal canting masters intuitively implemented recursive self-similarity, scale-invariance, and fractal dimensions to represent cosmic order (<em>Rukun</em>) and continuous spiritual refinement.
          </p>
        </div>

        {/* Section 1: Interactive Hausdorff Fractal Dimension Calculator */}
        <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[22px]">
                calculate
              </span>
              <h2 className="text-[16px] font-bold">Hausdorff-Besicovitch Fractal Dimension (D)</h2>
            </div>
            <span className="text-[11px] font-mono text-[#70518d] dark:text-[#dfbbff] px-2.5 py-0.5 rounded-full bg-[#e2d4f0]/50 dark:bg-[#70518d]/30 border border-[#e2d4f0] dark:border-[#70518d] font-semibold">
              D = log(N) / log(1/s)
            </span>
          </div>

          <p className="text-[12px] text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
            In Euclidean geometry, a line has dimension 1, a plane has dimension 2, and a solid has dimension 3. Javanese batik motifs occupy non-integer dimensions typically between 1.5 and 1.85, demonstrating true fractional space-filling properties.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
              <span className="text-[10px] font-mono text-[#85736f] dark:text-[#a08e7a] font-semibold">
                NUMBER OF SELF-SIMILAR PIECES (N)
              </span>
              <input
                type="number"
                min="1"
                max="64"
                value={customN}
                onChange={(e) => setCustomN(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#ffffff] dark:bg-[#191f2f] border border-[#eadfcf] dark:border-[#2e3545] rounded-lg px-2.5 py-1 text-[13px] font-mono font-bold focus:outline-none"
              />
              <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a]">Segments produced each step</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
              <span className="text-[10px] font-mono text-[#85736f] dark:text-[#a08e7a] font-semibold">
                SCALE REDUCTION FACTOR (1/s)
              </span>
              <input
                type="number"
                min="1.1"
                max="10"
                step="0.1"
                value={customS}
                onChange={(e) => setCustomS(Math.max(1.1, parseFloat(e.target.value) || 1.1))}
                className="w-full bg-[#ffffff] dark:bg-[#191f2f] border border-[#eadfcf] dark:border-[#2e3545] rounded-lg px-2.5 py-1 text-[13px] font-mono font-bold focus:outline-none"
              />
              <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a]">Magnification inverse</span>
            </div>

            <div className="flex flex-col justify-center items-center p-3 rounded-xl bg-[#fcd5ce]/30 dark:bg-[#f59e0b]/15 border border-[#f8ad9d]/60 dark:border-[#f59e0b]/40">
              <span className="text-[10px] font-mono text-[#894f42] dark:text-[#ffc174] font-semibold">
                CALCULATED FRACTAL DIMENSION
              </span>
              <span className="text-2xl font-mono font-bold text-[#894f42] dark:text-[#f59e0b]">
                D = {calculatedD}
              </span>
              <span className="text-[10px] text-[#524340] dark:text-[#d8c3ad] text-center">
                {parseFloat(calculatedD) > 1.0 && parseFloat(calculatedD) < 2.0
                  ? 'Fractal Curve (Typical Batik Space Filling)'
                  : 'Out of standard planar range'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Lindenmayer System (L-System) Formal Syntax */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl p-6 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8a70a8] dark:text-[#dfbbff] text-[20px]">
                menu_book
              </span>
              <h3 className="text-[15px] font-bold">L-System Formal Grammar</h3>
            </div>
            <p className="text-[12px] text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
              An L-system is a parallel rewriting grammar formalized by Aristid Lindenmayer in 1968, defined by a 4-tuple G = (V, Σ, ω, P):
            </p>
            <ul className="flex flex-col gap-2 text-[11px] font-mono pt-1">
              <li className="flex items-start gap-2 bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#e07a68] dark:text-[#f59e0b]">V (Variables):</span>
                <span>Symbols that can be replaced (e.g., X, Y)</span>
              </li>
              <li className="flex items-start gap-2 bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#2a9d8f] dark:text-[#10b981]">Σ (Alphabet):</span>
                <span>Drawing &amp; turtle commands (F, +, -, [, ])</span>
              </li>
              <li className="flex items-start gap-2 bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#70518d] dark:text-[#dfbbff]">ω (Axiom):</span>
                <span>The initial string seed where growth initiates</span>
              </li>
              <li className="flex items-start gap-2 bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#e07a68] dark:text-[#f59e0b]">P (Production Rules):</span>
                <span>Mapping functions: A → α expanding simultaneously</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl p-6 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3e6750] dark:text-[#4edea3] text-[20px]">
                gesture
              </span>
              <h3 className="text-[15px] font-bold">Turtle Canting Geometrical Interpretation</h3>
            </div>
            <p className="text-[12px] text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
              The compiled string is traversed by an algorithmic &quot;canting pen&quot; holding state (x, y, θ) on unbleached mori fabric:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded-lg bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#2a9d8f] dark:text-[#10b981]">F</span> : Move forward by d with hot wax canting line
              </div>
              <div className="p-2 rounded-lg bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#2a9d8f] dark:text-[#10b981]">f</span> : Move forward by d without drawing
              </div>
              <div className="p-2 rounded-lg bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#e07a68] dark:text-[#f59e0b]">+</span> : Turn right by branching angle θ
              </div>
              <div className="p-2 rounded-lg bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#e07a68] dark:text-[#f59e0b]">-</span> : Turn left by branching angle θ
              </div>
              <div className="p-2 rounded-lg bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#70518d] dark:text-[#dfbbff]">[</span> : Push (x, y, θ) to stack (branch fork)
              </div>
              <div className="p-2 rounded-lg bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545]">
                <span className="font-bold text-[#70518d] dark:text-[#dfbbff]">]</span> : Pop (x, y, θ) from stack (return to fork)
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Dihedral Symmetry Group Matrix */}
        <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[20px]">
              rotate_right
            </span>
            <h3 className="text-[15px] font-bold">Dihedral Symmetry Groups in Javanese Textiles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px]">
            <div className="p-4 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-2">
              <span className="text-[13px] font-mono font-bold text-[#e07a68] dark:text-[#f59e0b]">
                D4 Dihedral (Ceplok / Parang)
              </span>
              <p className="text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
                Contains 4 rotations (0°, 90°, 180°, 270°) and 4 reflections. Forms the four cardinal directions (<em>Kiblat Papat Kalima Pancer</em>) fundamental to Javanese spatial cosmology.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-2">
              <span className="text-[13px] font-mono font-bold text-[#3e6750] dark:text-[#4edea3]">
                D6 Dihedral (Truntum Hexagonal)
              </span>
              <p className="text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
                6-fold star lattice rotated every 60°. Mimics the hexagonal crystallization of dew and star jasmine blossoms, representing eternal reviving love.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-2">
              <span className="text-[13px] font-mono font-bold text-[#70518d] dark:text-[#dfbbff]">
                D8 Dihedral (Mandala Cirebon)
              </span>
              <p className="text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
                8-fold symmetry rotated every 45°. Embodies the <em>Asthabrata</em> (the eight virtuous qualities of royal rulers) harmonizing sun, moon, wind, water, and earth.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Preset Case Study Deep Dive */}
        <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold">Case Study: {preset.name} ({preset.javaneseName})</h3>
            <div className="flex gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all ${
                    selectedPresetId === p.id
                      ? 'bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold'
                      : 'bg-[#f7f3ed] dark:bg-[#141b2b] text-[#524340] dark:text-[#a08e7a] hover:bg-[#ebe8e2]'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-[#85736f] dark:text-[#a08e7a] font-semibold">
                HISTORICAL &amp; CULTURAL ETHOS
              </span>
              <p className="text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
                {preset.history}
              </p>
              <div className="p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] mt-1">
                <span className="font-semibold text-[#894f42] dark:text-[#ffc174] block mb-1">Philosophical Meaning:</span>
                <span className="text-[#524340] dark:text-[#d8c3ad]">{preset.meaning}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-[#85736f] dark:text-[#a08e7a] font-semibold">
                MATHEMATICAL GRAMMAR SPECIFICATION
              </span>
              <div className="bg-[#f7f3ed]/40 dark:bg-[#141b2b] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] font-mono text-[11px] flex flex-col gap-1.5">
                <div><span className="text-[#85736f]">Axiom (ω):</span> <span className="font-bold text-[#70518d] dark:text-[#dfbbff]">{preset.axiom}</span></div>
                <div><span className="text-[#85736f]">Angle (θ):</span> <span className="font-bold text-[#e07a68] dark:text-[#f59e0b]">{preset.angle}°</span></div>
                <div><span className="text-[#85736f]">Dimension (D):</span> <span className="font-bold text-[#3e6750] dark:text-[#4edea3]">{preset.fractalDimension}</span></div>
                <div><span className="text-[#85736f]">Symmetry:</span> <span className="font-bold text-[#2b2d42] dark:text-[#dce2f7]">{preset.symmetry}</span></div>
                <div className="border-t border-[#eadfcf] dark:border-[#2e3545] pt-1 mt-1 text-[#85736f]">
                  Production Rules:
                </div>
                {Object.entries(preset.rules).map(([k, v]) => (
                  <div key={k} className="pl-2">
                    <span className="text-[#e07a68] dark:text-[#f59e0b] font-bold">{k}</span> &rarr; <span className="text-[#2a9d8f] dark:text-[#10b981]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
