import { clamp } from './clamp';

export type BezierValue = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Point = {
  x: number;
  y: number;
};

export const Y_MIN = 0;
export const Y_MAX = 1;

export function formatNumber(value: number) {
  return Number(value.toFixed(3)).toString();
}

export function formatBezier(value: BezierValue) {
  return `cubic-bezier(${formatNumber(value.x1)}, ${formatNumber(value.y1)}, ${formatNumber(value.x2)}, ${formatNumber(value.y2)})`;
}

export function parseBezier(input: string): BezierValue | null {
  const match = input
    .trim()
    .match(/^cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/i);

  if (!match) {
    return null;
  }

  const [, x1, y1, x2, y2] = match;
  const parsed = {
    x1: Number(x1),
    y1: Number(y1),
    x2: Number(x2),
    y2: Number(y2),
  };

  if (Object.values(parsed).some(Number.isNaN)) {
    return null;
  }

  return sanitizeBezier(parsed);
}

export function sanitizeBezier(value: BezierValue): BezierValue {
  return {
    x1: clamp(value.x1, 0, 1),
    y1: clamp(value.y1, Y_MIN, Y_MAX),
    x2: clamp(value.x2, 0, 1),
    y2: clamp(value.y2, Y_MIN, Y_MAX),
  };
}

export function toSvgPoint(value: Point, size: number): Point {
  return {
    x: value.x * size,
    y: size - ((value.y - Y_MIN) / (Y_MAX - Y_MIN)) * size,
  };
}

export function fromSvgPoint(value: Point, size: number): Point {
  return {
    x: clamp(value.x / size, 0, 1),
    y: clamp(Y_MIN + ((size - value.y) / size) * (Y_MAX - Y_MIN), Y_MIN, Y_MAX),
  };
}

export function createBezierPath(value: BezierValue, size: number) {
  const start = toSvgPoint({ x: 0, y: 0 }, size);
  const p1 = toSvgPoint({ x: value.x1, y: value.y1 }, size);
  const p2 = toSvgPoint({ x: value.x2, y: value.y2 }, size);
  const end = toSvgPoint({ x: 1, y: 1 }, size);

  return `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`;
}
