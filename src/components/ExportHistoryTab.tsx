import React from 'react';
import { ExportHistoryItem } from '../types';

interface ExportHistoryTabProps {
  history: ExportHistoryItem[];
  onClearHistory: () => void;
  onNavigateToStudio: () => void;
}

export const ExportHistoryTab: React.FC<ExportHistoryTabProps> = ({
  history,
  onClearHistory,
  onNavigateToStudio,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#fdfbf7] dark:bg-[#0c1322] p-6 lg:p-10 font-body-md text-[#2b2d42] dark:text-[#dce2f7] transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#eadfcf] dark:border-[#2e3545]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#894f42] dark:text-[#f59e0b] text-[20px]">
                history
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Export Session History</h1>
            </div>
            <p className="text-[13px] text-[#524340] dark:text-[#d8c3ad]">
              Log of all high-resolution vector and raster artifacts exported during this session.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 text-[11px] font-mono transition-colors"
            >
              Clear Log
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-3 bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#f7f3ed] dark:bg-[#191f2f] flex items-center justify-center text-[#85736f]">
              <span className="material-symbols-outlined text-[28px]">folder_open</span>
            </div>
            <h2 className="text-[16px] font-bold">No Exports in Current Session</h2>
            <p className="text-[12px] text-[#85736f] dark:text-[#a08e7a] max-w-sm">
              Use the Export button in the top navigation bar or canvas inspector to generate SVG vector files, 2400px print rasters, or JSON formulas.
            </p>
            <button
              onClick={onNavigateToStudio}
              className="mt-2 px-4 py-2 rounded-xl bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold text-[11px] font-mono hover:bg-[#e07a68] transition-all shadow-xs"
            >
              Back to Studio Canvas
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-xl p-4 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f7f3ed] dark:bg-[#141b2b] border border-[#eadfcf] dark:border-[#2e3545] flex items-center justify-center font-mono text-[10px] font-bold text-[#894f42] dark:text-[#f59e0b]">
                    {item.format}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-[#2b2d42] dark:text-[#dce2f7]">
                      {item.presetName}
                    </span>
                    <span className="text-[10px] font-mono text-[#85736f] dark:text-[#a08e7a]">
                      Exported at {item.timestamp} • N={item.depth} • {item.symmetry} • {item.angle}°
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#c7e8d6]/50 dark:bg-[#10b981]/20 text-[#3e6750] dark:text-[#4edea3] font-semibold border border-[#c7e8d6] dark:border-[#10b981]/40">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
