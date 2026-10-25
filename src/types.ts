export type SymmetryType = 'none' | '4fold' | '6fold' | '8fold' | '12fold';
export type ViewMode = 'render' | 'wireframe' | 'symmetry';
export type ThemeMode = 'light' | 'dark';
export type GrowthMode = 'turtle' | 'progressive' | 'instant';

export interface ParametricConstraints {
  angle: number;
  depth: number;
  stepLength: number;
  thickness: number;
  cantingBleed: boolean;
  symmetry: SymmetryType;
}

export interface ColorPalette {
  id: string;
  name: string;
  stroke: string;
  strokeName: string;
  background: string;
  backgroundName: string;
  accent: string;
  secondary: string;
  tertiary: string;
}

export interface Preset {
  id: string;
  name: string;
  javaneseName: string;
  meaning: string;
  category: 'Traditional Royal' | 'Pesisir Coastal' | 'Geometric Mandala' | 'Modern Algorithmic';
  axiom: string;
  rules: Record<string, string>;
  rulesFileName: string;
  angle: number;
  depth: number;
  stepLength: number;
  thickness: number;
  symmetry: SymmetryType;
  palette: ColorPalette;
  description: string;
  fractalDimension: number;
  history: string;
}

export interface FractalPoint {
  x: number;
  y: number;
}

export interface FractalSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  progressIndex: number;
  strokeColor?: string;
  width?: number;
}

export interface RenderMetrics {
  iteration: number;
  segmentsCount: number;
  boundingBox: { width: number; height: number };
  renderTimeMs: number;
  memoryMb: number;
  symmetryName: string;
  fps: number;
}

export interface ExportHistoryItem {
  id: string;
  timestamp: string;
  presetName: string;
  format: 'SVG' | 'PNG' | 'JSON';
  depth: number;
  angle: number;
  symmetry: SymmetryType;
  previewSvgData?: string;
}
