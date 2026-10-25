import { FractalPoint, FractalSegment, SymmetryType } from '../types';

export interface TurtleResult {
  pathD: string;
  segments: FractalSegment[];
  dots: FractalPoint[];
  diamonds: FractalPoint[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number; width: number; height: number };
}

/**
 * Expand L-System with character replacement rules up to given depth
 */
export function expandLSystem(axiom: string, rules: Record<string, string>, depth: number): string {
  let current = axiom;
  // Safety max length
  const MAX_EXPANSION_LENGTH = 150000;

  for (let i = 0; i < depth; i++) {
    let next = '';
    for (let j = 0; j < current.length; j++) {
      const char = current[j];
      if (rules[char] !== undefined) {
        next += rules[char];
      } else {
        next += char;
      }
      if (next.length > MAX_EXPANSION_LENGTH) {
        break;
      }
    }
    current = next;
    if (current.length > MAX_EXPANSION_LENGTH) {
      break;
    }
  }

  return current;
}

/**
 * Parses user text rules (e.g. "X -> X+YF++YF-FX--FXFX-YF+" or "X = X+YF...")
 */
export function parseRulesFromText(text: string): Record<string, string> {
  const rules: Record<string, string> = {};
  const lines = text.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('//') || line.startsWith('#')) continue;

    // Check for -> or =
    const arrowMatch = line.match(/^([A-Za-z])\s*(?:->|→|=)\s*(.+)$/);
    if (arrowMatch) {
      const [, predecessor, successor] = arrowMatch;
      rules[predecessor.trim()] = successor.trim();
    }
  }

  return rules;
}

/**
 * Compiles expanded L-System string into turtle path segments & SVG path string
 */
export function compileTurtlePath(
  expanded: string,
  angleDeg: number,
  stepLength: number,
  cantingBleed: boolean = false
): TurtleResult {
  const rad = (angleDeg * Math.PI) / 180;
  let x = 0;
  let y = 0;
  let heading = 0; // facing right

  const stack: { x: number; y: number; heading: number }[] = [];
  const segments: FractalSegment[] = [];
  const dots: FractalPoint[] = [];
  const diamonds: FractalPoint[] = [];

  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  let pathD = '';
  let inPath = false;

  let segmentIndex = 0;
  const maxSegments = 25000;

  for (let i = 0; i < expanded.length && segmentIndex < maxSegments; i++) {
    const char = expanded[i];

    switch (char) {
      case 'F': {
        const nextX = x + Math.cos(heading) * stepLength;
        const nextY = y + Math.sin(heading) * stepLength;

        // update bounding box
        if (nextX < minX) minX = nextX;
        if (nextX > maxX) maxX = nextX;
        if (nextY < minY) minY = nextY;
        if (nextY > maxY) maxY = nextY;

        if (!inPath) {
          pathD += `M ${x.toFixed(2)} ${y.toFixed(2)} `;
          inPath = true;
        }

        if (cantingBleed && segmentIndex % 5 === 0) {
          // Slight bezier wave for wax flow
          const midX = (x + nextX) / 2 + (Math.sin(segmentIndex * 1.3) * 1.8);
          const midY = (y + nextY) / 2 + (Math.cos(segmentIndex * 1.3) * 1.8);
          pathD += `Q ${midX.toFixed(2)} ${midY.toFixed(2)} ${nextX.toFixed(2)} ${nextY.toFixed(2)} `;
        } else {
          pathD += `L ${nextX.toFixed(2)} ${nextY.toFixed(2)} `;
        }

        segments.push({
          x1: x,
          y1: y,
          x2: nextX,
          y2: nextY,
          depth: stack.length,
          progressIndex: segmentIndex++,
        });

        // Add periodic decorative dots & isen diamond points
        if (segmentIndex % 18 === 0) {
          dots.push({ x: nextX, y: nextY });
        }
        if (segmentIndex % 32 === 0) {
          diamonds.push({ x: nextX, y: nextY });
        }

        x = nextX;
        y = nextY;
        break;
      }
      case 'f': {
        // Move without drawing
        x += Math.cos(heading) * stepLength;
        y += Math.sin(heading) * stepLength;
        inPath = false;
        break;
      }
      case '+': {
        heading += rad;
        break;
      }
      case '-': {
        heading -= rad;
      }
      break;
      case '|': {
        heading += Math.PI;
        break;
      }
      case '[': {
        stack.push({ x, y, heading });
        break;
      }
      case ']': {
        if (stack.length > 0) {
          const state = stack.pop()!;
          x = state.x;
          y = state.y;
          heading = state.heading;
          inPath = false;
        }
        break;
      }
      default:
        // Variables like X, Y do not move
        break;
    }
  }

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  return {
    pathD,
    segments,
    dots,
    diamonds,
    bounds: { minX, maxX, minY, maxY, width, height },
  };
}

/**
 * Returns rotation angles for chosen symmetry matrix
 */
export function getSymmetryRotations(symmetry: SymmetryType): number[] {
  switch (symmetry) {
    case '4fold':
      return [0, 90, 180, 270];
    case '6fold':
      return [0, 60, 120, 180, 240, 300];
    case '8fold':
      return [0, 45, 90, 135, 180, 225, 270, 315];
    case '12fold':
      return [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    case 'none':
    default:
      return [0];
  }
}
