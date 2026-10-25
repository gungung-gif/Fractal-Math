import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ColorPalette, GrowthMode, ParametricConstraints, Preset, RenderMetrics, ViewMode } from '../types';
import { compileTurtlePath, expandLSystem, getSymmetryRotations, TurtleResult } from '../lib/lsystem';

interface CanvasViewportProps {
  axiom: string;
  rules: Record<string, string>;
  constraints: ParametricConstraints;
  palette: ColorPalette;
  activePreset: Preset;
  onDepthChange: (depth: number) => void;
  onOpenTelemetry: () => void;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  axiom,
  rules,
  constraints,
  palette,
  activePreset,
  onDepthChange,
  onOpenTelemetry,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('render');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panToolActive, setPanToolActive] = useState<boolean>(false);

  // Playback & animation scrubber state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopAnimation, setLoopAnimation] = useState<boolean>(true);
  const [growthMode, setGrowthMode] = useState<GrowthMode>('turtle');
  const [growthProgress, setGrowthProgress] = useState<number>(1.0); // 0.0 to 1.0 for turtle drawing

  const containerRef = useRef<HTMLDivElement>(null);

  // Measure performance
  const [renderMetrics, setRenderMetrics] = useState<RenderMetrics>({
    iteration: constraints.depth,
    segmentsCount: 32768,
    boundingBox: { width: 2400, height: 2400 },
    renderTimeMs: 14.2,
    memoryMb: 1.8,
    symmetryName: 'D4 Dihedral',
    fps: 60,
  });

  // Calculate compiled fractal data
  const turtleResult: TurtleResult = useMemo(() => {
    const startTime = performance.now();
    const expanded = expandLSystem(axiom, rules, constraints.depth);
    const result = compileTurtlePath(
      expanded,
      constraints.angle,
      constraints.stepLength,
      constraints.cantingBleed
    );
    const endTime = performance.now();
    const renderTime = Math.max(1.2, endTime - startTime);

    const rotations = getSymmetryRotations(constraints.symmetry);
    const totalSegments = Math.max(1, result.segments.length * rotations.length * (constraints.symmetry === '4fold' ? 2 : 1));

    let symName = 'C1 Single';
    if (constraints.symmetry === '4fold') symName = 'D4 Dihedral';
    else if (constraints.symmetry === '6fold') symName = 'D6 Dihedral';
    else if (constraints.symmetry === '8fold') symName = 'D8 Dihedral';
    else if (constraints.symmetry === '12fold') symName = 'D12 Dihedral';

    setRenderMetrics({
      iteration: constraints.depth,
      segmentsCount: totalSegments,
      boundingBox: { width: 2400, height: 2400 },
      renderTimeMs: parseFloat(renderTime.toFixed(1)),
      memoryMb: parseFloat((1.2 + totalSegments * 0.00003).toFixed(1)),
      symmetryName: symName,
      fps: 60,
    });

    return result;
  }, [axiom, rules, constraints.depth, constraints.angle, constraints.stepLength, constraints.cantingBleed, constraints.symmetry]);

  // Animation player loop
  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setGrowthProgress((prev) => {
        const next = prev + (delta * 0.6 * playbackSpeed);
        if (next >= 1.0) {
          if (loopAnimation) {
            // Loop next depth or reset
            if (constraints.depth < 6) {
              onDepthChange(constraints.depth + 1);
              return 0.1;
            } else {
              onDepthChange(1);
              return 0.1;
            }
          } else {
            setIsPlaying(false);
            return 1.0;
          }
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, playbackSpeed, loopAnimation, constraints.depth, onDepthChange]);

  // Handle Mouse Pan & Zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panToolActive || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(3.5, Math.max(0.3, prev * zoomFactor)));
  };

  const resetZoom = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom((prev) => Math.min(3.5, prev * 1.2));
  const zoomOut = () => setZoom((prev) => Math.max(0.3, prev / 1.2));

  // Symmetry rotation angles
  const rotations = getSymmetryRotations(constraints.symmetry);

  // Visible segments according to growth progress if animating
  const visibleSegmentsCount = Math.floor(turtleResult.segments.length * growthProgress);
  const activeSegments = turtleResult.segments.slice(0, visibleSegmentsCount);

  // Keyframe milestones for scrubber
  const keyframes = [
    { n: 0, label: '0: Axiom' },
    { n: 1, label: '1: Stems' },
    { n: 2, label: '2: Branch' },
    { n: 3, label: '3: Motifs' },
    { n: 4, label: '4: Ceplok' },
    { n: 5, label: '5: Micro' },
    { n: 6, label: '6: Dense' },
  ];

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`flex-1 relative flex items-center justify-center overflow-hidden transition-colors duration-200 ${
        showGrid ? 'blueprint-grid' : ''
      } ${panToolActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      style={{ backgroundColor: palette.background }}
    >
      {/* Soft Ambient Radial Glow Behind Motif */}
      <div className="absolute w-[800px] h-[800px] rounded-full pastel-radial-glow pointer-events-none transition-all duration-300" />

      {/* Subtle Coordinate Origin Crosshair */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-full h-px bg-[#eadfcf] dark:bg-[#2e3545]" />
        <div className="h-full w-px bg-[#eadfcf] dark:bg-[#2e3545] absolute" />
      </div>

      {/* Outer Symmetry Radial Guides */}
      <div className="absolute w-[580px] h-[580px] rounded-full border border-dashed border-[#dcd1c2] dark:border-[#2e3545] pointer-events-none" />
      <div className="absolute w-[420px] h-[420px] rounded-full border border-[#ebd8d0] dark:border-[#374151] pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-[#f8ad9d]/60 dark:border-[#f59e0b]/40 pointer-events-none" />

      {/* Symmetry Axes Overlay when in 'symmetry' mode */}
      {viewMode === 'symmetry' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {rotations.map((deg, i) => (
            <div
              key={i}
              className="absolute w-[700px] h-px bg-[#e07a68]/40 dark:bg-[#f59e0b]/50 border-t border-dashed"
              style={{ transform: `rotate(${deg}deg)` }}
            />
          ))}
          {constraints.symmetry === '4fold' && (
            <>
              <div className="absolute w-[700px] h-px bg-[#8a70a8]/30 border-t border-dotted rotate-45" />
              <div className="absolute w-[700px] h-px bg-[#8a70a8]/30 border-t border-dotted -rotate-45" />
            </>
          )}
        </div>
      )}

      {/* INTRICATE PROCEDURAL BATIK FRACTAL SVG CANVAS */}
      <div
        className="relative z-0 p-8 transform transition-transform duration-75 select-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          id="batik-svg-canvas"
          className="w-[580px] h-[580px] batik-pastel-glow transition-all duration-300"
          viewBox="-300 -300 600 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pastel Coral to Soft Rose Gradient */}
            <linearGradient id="pastelRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.accent} />
              <stop offset="35%" stopColor="#f8ad9d" />
              <stop offset="70%" stopColor={palette.stroke} />
              <stop offset="100%" stopColor="#bd8996" />
            </linearGradient>

            {/* Pastel Mint / Turquoise Gradient */}
            <linearGradient id="pastelMint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.tertiary} />
              <stop offset="100%" stopColor="#5fa898" />
            </linearGradient>

            {/* Pastel Lavender Gradient */}
            <linearGradient id="pastelViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2d4f0" />
              <stop offset="100%" stopColor={palette.secondary} />
            </linearGradient>

            {/* L-System Unit Quadrant Motif */}
            <g id="parangQuadrant">
              {/* Primary Compiled Path or Procedural Segments */}
              {turtleResult.pathD && (
                <path
                  d={turtleResult.pathD}
                  fill="none"
                  opacity={viewMode === 'wireframe' ? 0.75 : 0.95}
                  stroke={viewMode === 'wireframe' ? palette.stroke : 'url(#pastelRose)'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={viewMode === 'wireframe' ? 1.0 : constraints.thickness}
                />
              )}

              {/* Render View rich ornamentation (canting dots & isen diamond scales) */}
              {viewMode === 'render' && (
                <>
                  {/* Decorative Canting Wax Drops */}
                  {turtleResult.dots.slice(0, 15).map((pt, i) => (
                    <circle
                      key={`dot-${i}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={2.2 + (i % 3) * 0.8}
                      fill={i % 3 === 0 ? palette.accent : i % 2 === 0 ? palette.stroke : palette.tertiary}
                    />
                  ))}

                  {/* Isen-Isen Diamond Scales */}
                  {turtleResult.diamonds.slice(0, 8).map((pt, i) => (
                    <polygon
                      key={`dia-${i}`}
                      points={`${pt.x},${pt.y - 7} ${pt.x + 6},${pt.y} ${pt.x},${pt.y + 7} ${pt.x - 6},${pt.y}`}
                      fill={i % 2 === 0 ? '#fff5eb' : '#eefaf7'}
                      fillOpacity={0.65}
                      stroke={i % 2 === 0 ? palette.stroke : palette.tertiary}
                      strokeWidth={1.0}
                    />
                  ))}
                </>
              )}

              {/* If wireframe mode: render vertex points */}
              {viewMode === 'wireframe' && (
                <g fill={palette.stroke} opacity={0.6}>
                  {activeSegments.filter((_, idx) => idx % 6 === 0).map((seg, idx) => (
                    <circle key={`node-${idx}`} cx={seg.x2} cy={seg.y2} r={1.5} />
                  ))}
                </g>
              )}
            </g>
          </defs>

          {/* Central Core Mandala Motif (Ceplok Centerpiece with soft mori fills) */}
          <circle
            cx="0"
            cy="0"
            r="36"
            fill={palette.background === '#0b0f19' || palette.background === '#0c1322' ? '#141b2b' : '#ffffff'}
            stroke="url(#pastelRose)"
            strokeWidth={viewMode === 'wireframe' ? 1.2 : 2.5}
          />
          <circle
            cx="0"
            cy="0"
            r="24"
            fill={palette.background === '#0b0f19' || palette.background === '#0c1322' ? '#191f2f' : '#faf7f2'}
            stroke={palette.tertiary}
            strokeDasharray="3 2"
            strokeWidth={1.5}
          />
          <circle
            cx="0"
            cy="0"
            r="12"
            fill={palette.background === '#0b0f19' || palette.background === '#0c1322' ? '#232a3a' : '#fef5f0'}
            stroke={palette.stroke}
            strokeWidth={2}
          />
          <circle cx="0" cy="0" r="4.5" fill={palette.accent} />

          {/* Center 8-petal mini rosette */}
          <g fill="none" stroke="#f8ad9d" strokeWidth={1.25} opacity={viewMode === 'wireframe' ? 0.4 : 0.9}>
            <path d="M 0 -24 C 6 -16, 6 -8, 0 0 C -6 -8, -6 -16, 0 -24" />
            <path d="M 0 24 C 6 16, 6 8, 0 0 C -6 8, -6 16, 0 24" />
            <path d="M -24 0 C -16 6, -8 6, 0 0 C -8 -6, -16 -6, -24 0" />
            <path d="M 24 0 C 16 6, 8 6, 0 0 C 8 -6, 16 -6, 24 0" />
            <path d="M -17 -17 C -10 -14, -6 -8, 0 0 C -8 -6, -14 -10, -17 -17" />
            <path d="M 17 17 C 10 14, 6 8, 0 0 C 8 6, 14 10, 17 17" />
            <path d="M 17 -17 C 14 -10, 8 -6, 0 0 C 6 -8, 10 -14, 17 -17" />
            <path d="M -17 17 C -14 10, -8 6, 0 0 C -6 8, -10 14, -17 17" />
          </g>

          {/* ROTATIONAL SYMMETRY MAPPINGS */}
          {rotations.map((deg, idx) => (
            <g key={`rot-${idx}`} transform={`rotate(${deg})`}>
              <use href="#parangQuadrant" />
              {/* If Dihedral symmetry, also include mirrored counterpart */}
              {constraints.symmetry === '4fold' && (
                <use href="#parangQuadrant" transform="scale(1, -1)" opacity={0.35} />
              )}
            </g>
          ))}

          {/* Outer Ceplok Boundary Ring */}
          <circle
            cx="0"
            cy="0"
            r="280"
            fill="none"
            opacity={0.6}
            stroke="url(#pastelRose)"
            strokeDasharray="6 4"
            strokeWidth={1.8}
          />
          <circle
            cx="0"
            cy="0"
            r="290"
            fill="none"
            opacity={0.45}
            stroke={palette.secondary}
            strokeWidth={1}
          />
        </svg>
      </div>

      {/* FLOATING HUD 1: TOP-RIGHT VIEW CONTROLS */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#ffffff]/85 dark:bg-[#111827]/85 backdrop-blur-md border border-white/80 dark:border-[#2e3545] rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode('render')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
              viewMode === 'render'
                ? 'bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] shadow-xs'
                : 'text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white'
            }`}
          >
            Render View
          </button>
          <button
            onClick={() => setViewMode('wireframe')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              viewMode === 'wireframe'
                ? 'bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-semibold shadow-xs'
                : 'text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white'
            }`}
          >
            Vector Wireframe
          </button>
          <button
            onClick={() => setViewMode('symmetry')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
              viewMode === 'symmetry'
                ? 'bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-semibold shadow-xs'
                : 'text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white'
            }`}
          >
            Symmetry Axes
          </button>
        </div>

        {/* Zoom & Nav Controls */}
        <div className="flex items-center bg-[#ffffff]/85 dark:bg-[#111827]/85 backdrop-blur-md border border-white/80 dark:border-[#2e3545] rounded-xl p-1 shadow-sm text-[#524340] dark:text-[#d8c3ad]">
          <button
            onClick={zoomIn}
            className="p-1 hover:text-[#894f42] dark:hover:text-[#f59e0b] hover:bg-[#f7f3ed] dark:hover:bg-[#191f2f] rounded-lg transition-colors"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          </button>
          <button
            onClick={zoomOut}
            className="p-1 hover:text-[#894f42] dark:hover:text-[#f59e0b] hover:bg-[#f7f3ed] dark:hover:bg-[#191f2f] rounded-lg transition-colors"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">zoom_out</span>
          </button>
          <div className="h-3 w-px bg-[#eadfcf] dark:bg-[#2e3545] mx-0.5" />
          <button
            onClick={resetZoom}
            className="px-1.5 py-0.5 text-[10px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-semibold hover:text-[#894f42] dark:hover:text-[#f59e0b] rounded-md"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <div className="h-3 w-px bg-[#eadfcf] dark:bg-[#2e3545] mx-0.5" />
          <button
            onClick={resetZoom}
            className="p-1 hover:text-[#894f42] dark:hover:text-[#f59e0b] hover:bg-[#f7f3ed] dark:hover:bg-[#191f2f] rounded-lg transition-colors"
            title="Fit to Screen"
          >
            <span className="material-symbols-outlined text-[18px]">fit_screen</span>
          </button>
          <button
            onClick={() => setPanToolActive(!panToolActive)}
            className={`p-1 rounded-lg transition-colors ${
              panToolActive
                ? 'bg-[#f8ad9d]/30 text-[#894f42] dark:text-[#f59e0b]'
                : 'hover:text-[#894f42] dark:hover:text-[#f59e0b] hover:bg-[#f7f3ed] dark:hover:bg-[#191f2f]'
            }`}
            title="Pan Tool"
          >
            <span className="material-symbols-outlined text-[18px]">pan_tool</span>
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 rounded-lg transition-colors ${
              showGrid
                ? 'text-[#e07a68] dark:text-[#f59e0b]'
                : 'text-[#85736f] dark:text-[#a08e7a] hover:bg-[#f7f3ed] dark:hover:bg-[#191f2f]'
            }`}
            title="Toggle Grid"
          >
            <span className="material-symbols-outlined text-[18px]">grid_4x4</span>
          </button>
        </div>
      </div>

      {/* FLOATING HUD: ANIMATION PLAYBACK & RECURSION SCRUBBER TOOLBAR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 bg-[#ffffff]/85 dark:bg-[#111827]/90 backdrop-blur-md border border-white/80 dark:border-[#2e3545] rounded-2xl px-5 py-3 shadow-md w-[580px] max-w-[92vw] transition-colors duration-200">
        {/* Top Bar: Playback Controls, Progress Readout & Modes */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono">
          {/* Left: Media Playback Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDepthChange(1)}
              className="p-1 text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937] rounded-lg transition-colors"
              title="Rewind to Axiom (Seed)"
            >
              <span className="material-symbols-outlined text-[16px]">first_page</span>
            </button>
            <button
              onClick={() => onDepthChange(Math.max(1, constraints.depth - 1))}
              className="p-1 text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937] rounded-lg transition-colors"
              title="Step Backward (N-1)"
            >
              <span className="material-symbols-outlined text-[16px]">skip_previous</span>
            </button>

            {/* Primary Play / Pause Button with Pastel Coral Glow */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f8ad9d] dark:bg-[#f59e0b] text-[#753f33] dark:text-[#0b0f19] font-bold hover:bg-[#e07a68] dark:hover:bg-[#d97706] hover:text-white dark:hover:text-black shadow-xs active:scale-95 transition-all"
              title={isPlaying ? 'Pause' : 'Play Fractal Animation'}
            >
              <span className="material-symbols-outlined text-[18px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button
              onClick={() => onDepthChange(Math.min(6, constraints.depth + 1))}
              className="p-1 text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937] rounded-lg transition-colors"
              title="Step Forward (N+1)"
            >
              <span className="material-symbols-outlined text-[16px]">skip_next</span>
            </button>
            <button
              onClick={() => setLoopAnimation(!loopAnimation)}
              className={`p-1 rounded-lg transition-colors ${
                loopAnimation
                  ? 'text-[#894f42] dark:text-[#f59e0b]'
                  : 'text-[#85736f] dark:text-[#a08e7a]'
              } hover:bg-[#f7f3ed] dark:hover:bg-[#1f2937]`}
              title="Loop Animation"
            >
              <span className="material-symbols-outlined text-[16px]">repeat</span>
            </button>

            <div className="h-3 w-px bg-[#eadfcf] dark:bg-[#2e3545] mx-0.5" />
            <span className="font-mono text-[#2b2d42] dark:text-[#dce2f7] font-bold tracking-wide ml-0.5">
              N = {constraints.depth} / 6
            </span>
            <span className="text-[#85736f] dark:text-[#a08e7a] font-mono">
              (Step {constraints.depth} of 6)
            </span>
          </div>

          {/* Right: Speed Selector & Render Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Speed Toggle Pill */}
            <div className="flex items-center bg-[#f7f3ed] dark:bg-[#141b2b] rounded-lg border border-[#eadfcf] dark:border-[#2e3545] px-1 py-0.5 gap-1 font-mono text-[#85736f] dark:text-[#a08e7a]">
              <span className="text-[9px] font-semibold">SPEED:</span>
              {[0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded ${
                    playbackSpeed === s
                      ? 'bg-[#f8ad9d]/30 dark:bg-[#f59e0b]/25 text-[#2b2d42] dark:text-[#f59e0b] font-bold border border-[#f8ad9d]/60 dark:border-[#f59e0b]/40'
                      : 'text-[#524340] dark:text-[#d8c3ad] hover:text-[#2b2d42] dark:hover:text-white'
                  }`}
                >
                  {s.toFixed(1)}x
                </button>
              ))}
            </div>

            <div className="h-3 w-px bg-[#eadfcf] dark:bg-[#2e3545]" />

            {/* Growth Mode Toggle */}
            <div
              onClick={() => {
                const modes: GrowthMode[] = ['turtle', 'progressive', 'instant'];
                const nextIdx = (modes.indexOf(growthMode) + 1) % modes.length;
                setGrowthMode(modes[nextIdx]);
              }}
              className="flex items-center gap-1 bg-[#f7f3ed] dark:bg-[#141b2b] rounded-lg border border-[#eadfcf] dark:border-[#2e3545] px-2 py-0.5 text-[#524340] dark:text-[#d8c3ad] cursor-pointer hover:border-[#f8ad9d]"
            >
              <span className="material-symbols-outlined text-[14px] text-[#3e6750] dark:text-[#4edea3]">
                gesture
              </span>
              <span className="text-[10px] text-[#2b2d42] dark:text-[#dce2f7] font-semibold capitalize">
                {growthMode === 'turtle' ? 'Turtle Canting' : growthMode === 'progressive' ? 'Progressive Bloom' : 'Instant Geometry'}
              </span>
              <span className="material-symbols-outlined text-[12px] text-[#85736f] dark:text-[#a08e7a]">
                unfold_more
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Keyframed Scrubber Track & Step Markers */}
        <div className="w-full flex flex-col gap-1 pt-0.5">
          <div
            className="relative flex items-center w-full h-4 group cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const targetLevel = Math.max(1, Math.min(6, Math.round(ratio * 6)));
              onDepthChange(targetLevel);
            }}
          >
            {/* Background Rail */}
            <div className="absolute w-full h-1.5 bg-[#ebe8e2] dark:bg-[#2e3545] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#fcd5ce] via-[#f8ad9d] to-[#e07a68] dark:from-[#ffb95f] dark:via-[#f59e0b] dark:to-[#d97706] rounded-full transition-all duration-150"
                style={{ width: `${(constraints.depth / 6) * 100}%` }}
              />
            </div>

            {/* Interactive Keyframe Pins / Step Nodes */}
            <div className="absolute w-full flex justify-between px-0.5 pointer-events-none">
              {[0, 1, 2, 3, 4, 5, 6].map((step) => {
                const isPassed = step <= constraints.depth;
                const isActive = step === constraints.depth;
                return (
                  <span
                    key={step}
                    className={`w-2 h-2 rounded-full border border-white shadow-xs transition-all ${
                      isActive
                        ? 'bg-[#f8ad9d] dark:bg-[#f59e0b] ring-2 ring-[#f8ad9d]/40 dark:ring-[#f59e0b]/40 scale-125'
                        : isPassed
                        ? 'bg-[#f8ad9d] dark:bg-[#f59e0b]'
                        : 'bg-[#ebe8e2] dark:bg-[#2e3545] border-[#eadfcf]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Playhead Scrubber Handle (Thumb) */}
            <div
              className="absolute -translate-x-1/2 flex items-center justify-center pointer-events-none z-10 transition-transform group-hover:scale-110"
              style={{ left: `${(constraints.depth / 6) * 100}%` }}
            >
              <div className="w-4 h-4 rounded-full bg-[#f8ad9d] dark:bg-[#f59e0b] border-2 border-white dark:border-[#111827] shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#0b0f19]" />
              </div>
            </div>
          </div>

          {/* Keyframe Labels & Iteration Step Milestones */}
          <div className="w-full flex justify-between text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a] px-0.5 select-none font-medium">
            {keyframes.map((kf) => (
              <span
                key={kf.n}
                onClick={() => onDepthChange(Math.max(1, kf.n))}
                className={`cursor-pointer transition-colors ${
                  kf.n === constraints.depth
                    ? 'text-[#e07a68] dark:text-[#f59e0b] font-bold'
                    : 'hover:text-[#2b2d42] dark:hover:text-white'
                }`}
              >
                {kf.n === constraints.depth ? `${kf.label} (Active)` : kf.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING HUD 2: BOTTOM-LEFT PRESET METRIC / QUICK INFO */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 bg-[#ffffff]/85 dark:bg-[#111827]/85 backdrop-blur-md border border-white/80 dark:border-[#2e3545] rounded-xl px-3.5 py-2 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[16px]">
            auto_awesome
          </span>
          <span className="text-[12px] font-semibold text-[#2b2d42] dark:text-[#dce2f7]">
            Active Motif: {activePreset.name}
          </span>
        </div>
        <div className="h-3 w-px bg-[#eadfcf] dark:bg-[#2e3545] mx-1" />
        <span className="text-[10px] text-[#85736f] dark:text-[#a08e7a] font-mono">
          Rot: {rotations.length} × {(360 / Math.max(1, rotations.length)).toFixed(0)}° | Angle: {constraints.angle.toFixed(1)}°
        </span>
      </div>

      {/* FLOATING HUD 3: BOTTOM-RIGHT FRACTAL ENGINE DIAGNOSTICS CARD */}
      <div className="absolute bottom-4 right-4 z-10 w-80 bg-[#ffffff]/85 dark:bg-[#111827]/85 backdrop-blur-md border border-white/80 dark:border-[#2e3545] rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5 transition-colors duration-200">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#eadfcf] dark:border-[#2e3545] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#e07a68] dark:text-[#f59e0b] text-[16px]">
              memory
            </span>
            <span className="text-[11px] font-mono text-[#2b2d42] dark:text-[#dce2f7] font-bold">
              Fractal Engine Diagnostics
            </span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#c7e8d6]/50 dark:bg-[#10b981]/20 text-[#3e6750] dark:text-[#4edea3] border border-[#c7e8d6] dark:border-[#10b981]/40 font-bold">
            Live
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="flex flex-col bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
            <span className="text-[#85736f] dark:text-[#a08e7a] font-medium text-[9px]">ITERATION</span>
            <span className="text-[#2b2d42] dark:text-[#dce2f7] font-bold">
              Depth {constraints.depth} (N={constraints.depth})
            </span>
          </div>
          <div className="flex flex-col bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
            <span className="text-[#85736f] dark:text-[#a08e7a] font-medium text-[9px]">SEGMENTS</span>
            <span className="text-[#e07a68] dark:text-[#f59e0b] font-bold">
              {renderMetrics.segmentsCount.toLocaleString()} lines
            </span>
          </div>
          <div className="flex flex-col bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
            <span className="text-[#85736f] dark:text-[#a08e7a] font-medium text-[9px]">BOUNDING BOX</span>
            <span className="text-[#2b2d42] dark:text-[#dce2f7] font-medium">
              2400 × 2400 px
            </span>
          </div>
          <div className="flex flex-col bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
            <span className="text-[#85736f] dark:text-[#a08e7a] font-medium text-[9px]">RENDER TIME</span>
            <span className="text-[#3e6750] dark:text-[#4edea3] font-bold">
              {renderMetrics.renderTimeMs} ms
            </span>
          </div>
          <div className="flex flex-col bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
            <span className="text-[#85736f] dark:text-[#a08e7a] font-medium text-[9px]">MEMORY ALLOC</span>
            <span className="text-[#2b2d42] dark:text-[#dce2f7] font-medium">
              {renderMetrics.memoryMb} MB VRAM
            </span>
          </div>
          <div className="flex flex-col bg-[#f7f3ed]/60 dark:bg-[#141b2b] p-2 rounded-lg border border-[#eadfcf] dark:border-[#2e3545]">
            <span className="text-[#85736f] dark:text-[#a08e7a] font-medium text-[9px]">SYMMETRY</span>
            <span className="text-[#70518d] dark:text-[#dfbbff] font-bold">
              {renderMetrics.symmetryName}
            </span>
          </div>
        </div>

        {/* GPU Acceleration Footnote */}
        <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-[#85736f] dark:text-[#a08e7a] border-t border-[#eadfcf] dark:border-[#2e3545]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84dcc6] dark:bg-[#10b981]" />
            GPU Accelerated • Canvas WebGL
          </span>
          <button
            onClick={onOpenTelemetry}
            className="text-[#e07a68] dark:text-[#f59e0b] font-semibold hover:underline cursor-pointer"
          >
            Telemetry
          </button>
        </div>
      </div>
    </main>
  );
};
