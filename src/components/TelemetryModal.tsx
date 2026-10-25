import React from 'react';
import { ParametricConstraints, Preset } from '../types';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePreset: Preset;
  constraints: ParametricConstraints;
}

export const TelemetryModal: React.FC<TelemetryModalProps> = ({
  isOpen,
  onClose,
  activePreset,
  constraints,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col font-body-md text-[#2b2d42] dark:text-[#dce2f7] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#eadfcf] dark:border-[#2e3545] flex items-center justify-between bg-[#f7f3ed]/60 dark:bg-[#141b2b]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[20px]">
              terminal
            </span>
            <h3 className="font-bold text-[15px]">Fractal Engine Kernel Telemetry</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#85736f] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-[12px]">
          <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
            <div className="p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col">
              <span className="text-[#85736f] text-[9px]">ENGINE PIPELINE</span>
              <span className="font-bold text-[#3e6750] dark:text-[#4edea3]">WebGL2 Vector Accelerate</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col">
              <span className="text-[#85736f] text-[9px]">GPU FRAME TARGET</span>
              <span className="font-bold text-[#2b2d42] dark:text-[#dce2f7]">60.0 FPS Stable</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col">
              <span className="text-[#85736f] text-[9px]">ACTIVE SYMMETRY GROUP</span>
              <span className="font-bold text-[#70518d] dark:text-[#dfbbff]">{constraints.symmetry.toUpperCase()}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f7f3ed]/60 dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex flex-col">
              <span className="text-[#85736f] text-[9px]">CANTING BLEED JURING</span>
              <span className="font-bold text-[#e07a68] dark:text-[#f59e0b]">
                {constraints.cantingBleed ? 'Active (Wax Flow Sim)' : 'Disabled (Linear)'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 bg-[#0c1322] text-[#dce2f7] p-3.5 rounded-xl font-mono text-[10px] leading-4 border border-[#2e3545]">
            <div className="text-[#a08e7a]">// Kernel Execution Benchmark Profile</div>
            <div>[INFO] Initialized L-System grammar &quot;{activePreset.rulesFileName}&quot;</div>
            <div>[INFO] Expansion depth: N={constraints.depth} (iterations: {constraints.depth})</div>
            <div>[INFO] Memory pool: heap 4.2 MB, VRAM textures 1.8 MB</div>
            <div>[INFO] Dihedral transform matrix compiled in 0.42 ms</div>
            <div>[INFO] Render buffer: 2400x2400 @ 32bpp sRGB</div>
            <div className="text-[#4edea3]">[STATUS] Kernel status: NOMINAL (0 dropped frames)</div>
          </div>
        </div>

        <div className="p-4 border-t border-[#eadfcf] dark:border-[#2e3545] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold text-[11px] font-mono hover:bg-[#e07a68] transition-all shadow-xs"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
