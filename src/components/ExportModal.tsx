import React, { useState } from 'react';
import { ColorPalette, ExportHistoryItem, ParametricConstraints, Preset } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  format: 'SVG' | 'PNG' | 'JSON';
  onFormatChange: (f: 'SVG' | 'PNG' | 'JSON') => void;
  axiom: string;
  rules: Record<string, string>;
  constraints: ParametricConstraints;
  palette: ColorPalette;
  activePreset: Preset;
  onExportSuccess: (item: ExportHistoryItem) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  format,
  onFormatChange,
  axiom,
  rules,
  constraints,
  palette,
  activePreset,
  onExportSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // Generate SVG string
  const getSvgString = () => {
    const svgElem = document.getElementById('batik-svg-canvas');
    if (svgElem) {
      return new XMLSerializer().serializeToString(svgElem);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -300 600 600"></svg>`;
  };

  // Generate JSON string
  const getJsonString = () => {
    const data = {
      app: 'BatikMath v2.4',
      name: activePreset.name,
      javaneseName: activePreset.javaneseName,
      exportedAt: new Date().toISOString(),
      grammar: {
        axiom,
        rules,
      },
      parametric: constraints,
      palette,
      fractalDimension: activePreset.fractalDimension,
    };
    return JSON.stringify(data, null, 2);
  };

  const handleCopy = () => {
    const content = format === 'JSON' ? getJsonString() : getSvgString();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filenameBase = `batikmath_${activePreset.id}_${timestamp}`;

      if (format === 'SVG') {
        const svgContent = getSvgString();
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filenameBase}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'JSON') {
        const jsonContent = getJsonString();
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filenameBase}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'PNG') {
        // High-resolution 2400px canvas export
        const svgString = getSvgString();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const URLObj = window.URL || window.webkitURL || window;
        const blobURL = URLObj.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 2400;
          canvas.height = 2400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Fill background
            ctx.fillStyle = palette.background;
            ctx.fillRect(0, 0, 2400, 2400);

            // Draw SVG centered
            ctx.drawImage(img, 0, 0, 2400, 2400);

            canvas.toBlob((blob) => {
              if (blob) {
                const pngUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = `${filenameBase}.png`;
                link.click();
                URL.revokeObjectURL(pngUrl);
              }
            }, 'image/png');
          }
          URLObj.revokeObjectURL(blobURL);
        };
        img.src = blobURL;
      }

      // Add to history
      onExportSuccess({
        id: `exp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        presetName: activePreset.name,
        format,
        depth: constraints.depth,
        angle: constraints.angle,
        symmetry: constraints.symmetry,
      });

      setTimeout(() => {
        setDownloading(false);
        onClose();
      }, 500);
    } catch {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#ffffff] dark:bg-[#111827] border border-[#eadfcf] dark:border-[#2e3545] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col font-body-md text-[#2b2d42] dark:text-[#dce2f7] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#eadfcf] dark:border-[#2e3545] flex items-center justify-between bg-[#f7f3ed]/60 dark:bg-[#141b2b]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[20px]">
              download
            </span>
            <h3 className="font-bold text-[15px]">Export Batik Artwork</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#85736f] dark:text-[#a08e7a] hover:text-[#2b2d42] dark:hover:text-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#85736f] dark:text-[#a08e7a] font-semibold">
              SELECT EXPORT SPECIFICATION
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onFormatChange('SVG')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                  format === 'SVG'
                    ? 'border-[#f8ad9d] dark:border-[#f59e0b] bg-[#f8ad9d]/15 dark:bg-[#f59e0b]/15 text-[#894f42] dark:text-[#f59e0b] font-bold'
                    : 'border-[#eadfcf] dark:border-[#2e3545] bg-[#f7f3ed]/40 dark:bg-[#141b2b] text-[#524340] dark:text-[#a08e7a]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">polyline</span>
                <span className="text-[11px] font-mono">SVG Vector</span>
                <span className="text-[9px] text-[#85736f]">Lossless scale</span>
              </button>

              <button
                onClick={() => onFormatChange('PNG')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                  format === 'PNG'
                    ? 'border-[#f8ad9d] dark:border-[#f59e0b] bg-[#f8ad9d]/15 dark:bg-[#f59e0b]/15 text-[#894f42] dark:text-[#f59e0b] font-bold'
                    : 'border-[#eadfcf] dark:border-[#2e3545] bg-[#f7f3ed]/40 dark:bg-[#141b2b] text-[#524340] dark:text-[#a08e7a]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">image</span>
                <span className="text-[11px] font-mono">PNG 2400px</span>
                <span className="text-[9px] text-[#85736f]">High-res print</span>
              </button>

              <button
                onClick={() => onFormatChange('JSON')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                  format === 'JSON'
                    ? 'border-[#f8ad9d] dark:border-[#f59e0b] bg-[#f8ad9d]/15 dark:bg-[#f59e0b]/15 text-[#894f42] dark:text-[#f59e0b] font-bold'
                    : 'border-[#eadfcf] dark:border-[#2e3545] bg-[#f7f3ed]/40 dark:bg-[#141b2b] text-[#524340] dark:text-[#a08e7a]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">code</span>
                <span className="text-[11px] font-mono">L-System JSON</span>
                <span className="text-[9px] text-[#85736f]">Config code</span>
              </button>
            </div>
          </div>

          {/* Details Box */}
          <div className="bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-3.5 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] flex flex-col gap-2 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-[#85736f]">Motif:</span>
              <span className="font-bold">{activePreset.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#85736f]">Recursion Depth:</span>
              <span>N = {constraints.depth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#85736f]">Symmetry:</span>
              <span>{constraints.symmetry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#85736f]">Target Resolution:</span>
              <span>{format === 'PNG' ? '2400 × 2400 px @ 300 DPI' : 'Infinite (Vector Math)'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl border border-[#eadfcf] dark:border-[#2e3545] bg-[#ffffff] dark:bg-[#191f2f] hover:bg-[#f7f3ed] dark:hover:bg-[#232a3a] text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="py-2.5 px-4 rounded-xl bg-[#f8ad9d] dark:bg-[#f59e0b] hover:bg-[#e07a68] dark:hover:bg-[#d97706] text-[#753f33] dark:text-[#0b0f19] hover:text-white dark:hover:text-black text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                {downloading ? 'sync' : 'download'}
              </span>
              <span>{downloading ? 'Rendering...' : `Download .${format.toLowerCase()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
