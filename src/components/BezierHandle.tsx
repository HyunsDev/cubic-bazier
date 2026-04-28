import type { PointerEvent } from 'react';
import type { Point } from '../utils/bezier';

type BezierHandleProps = {
  label: string;
  point: Point;
  onPointerDown: (event: PointerEvent<SVGCircleElement>) => void;
  onPointerMove: (event: PointerEvent<SVGCircleElement>) => void;
};

export function BezierHandle({ label, point, onPointerDown, onPointerMove }: BezierHandleProps) {
  return (
    <circle
      aria-label={label}
      className="bezier-handle"
      cx={point.x}
      cy={point.y}
      r="9"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    />
  );
}
