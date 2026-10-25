import React from 'react';

interface SyntaxGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyntaxGuideModal: React.FC<SyntaxGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col font-body-md text-[#2b2d42] dark:text-[#dce2f7] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-[#eadfcf] dark:border-[#2e3545] flex items-center justify-between bg-[#f7f3ed]/60 dark:bg-[#141b2b]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[20px]">
              menu_book
            </span>
            <h3 className="font-bold text-[15px]">L-System Syntax Reference Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#85736f] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto custom-scroll text-[12px]">
          <p className="text-[#524340] dark:text-[#d8c3ad] leading-relaxed">
            The L-System kernel interprets string characters as sequential commands for the virtual Javanese canting pen.
          </p>

          <div className="flex flex-col gap-2 font-mono text-[11px]">
            <div className="bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#2a9d8f] dark:text-[#10b981]">F</span>
                <span className="text-[#85736f]">Draw Step</span>
              </div>
              <span className="text-[#524340] dark:text-[#d8c3ad] font-sans">
                Move forward by <code>stepLength</code> drawing a stroke with hot canting wax.
              </span>
            </div>

            <div className="bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#2a9d8f] dark:text-[#10b981]">f</span>
                <span className="text-[#85736f]">Blank Step</span>
              </div>
              <span className="text-[#524340] dark:text-[#d8c3ad] font-sans">
                Move forward without laying wax (creates negative space / mori borders).
              </span>
            </div>

            <div className="bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#e07a68] dark:text-[#f59e0b]">+ and -</span>
                <span className="text-[#85736f]">Branch Angles</span>
              </div>
              <span className="text-[#524340] dark:text-[#d8c3ad] font-sans">
                <code>+</code> turns right by angle &theta;. <code>-</code> turns left by angle &theta;.
              </span>
            </div>

            <div className="bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#70518d] dark:text-[#dfbbff]">[ and ]</span>
                <span className="text-[#85736f]">State Stack</span>
              </div>
              <span className="text-[#524340] dark:text-[#d8c3ad] font-sans">
                <code>[</code> pushes current position and angle to memory. <code>]</code> restores it, enabling branching tree tendrils.
              </span>
            </div>

            <div className="bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-3 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#e07a68] dark:text-[#f59e0b]">X, Y, A, B</span>
                <span className="text-[#85736f]">Syntactic Variables</span>
              </div>
              <span className="text-[#524340] dark:text-[#d8c3ad] font-sans">
                Abstract non-terminal symbols that guide recursive expansion without drawing directly.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fcd5ce]/30 dark:bg-[#f59e0b]/15 border border-[#f8ad9d]/60 dark:border-[#f59e0b]/40 text-[11px] text-[#524340] dark:text-[#d8c3ad]">
            <strong>Format Syntax:</strong> Rules can be written as <code>X -&gt; ...</code> or <code>X = ...</code>. Comments start with <code>//</code>.
          </div>
        </div>

        <div className="p-4 border-t border-[#eadfcf] dark:border-[#2e3545] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold text-[11px] font-mono hover:bg-[#e07a68] transition-all shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
