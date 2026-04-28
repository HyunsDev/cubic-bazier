import { useRef, type PointerEvent } from 'react';
import { BezierHandle } from './BezierHandle';
import {
  createBezierPath,
  fromSvgPoint,
  sanitizeBezier,
  toSvgPoint,
  type BezierValue,
  type Point,
} from '../utils/bezier';

type BezierEditorProps = {
  value: BezierValue;
  onChange: (value: BezierValue) => void;
};

const SIZE = 320;
const GRID_LINES = [0, 0.25, 0.5, 0.75, 1];

export function BezierEditor({ value, onChange }: BezierEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const start = toSvgPoint({ x: 0, y: 0 }, SIZE);
  const end = toSvgPoint({ x: 1, y: 1 }, SIZE);
  const p1 = toSvgPoint({ x: value.x1, y: value.y1 }, SIZE);
  const p2 = toSvgPoint({ x: value.x2, y: value.y2 }, SIZE);
  const path = createBezierPath(value, SIZE);

  const updatePoint = (event: PointerEvent<SVGElement>, point: 'p1' | 'p2') => {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const rect = svg.getBoundingClientRect();
    const next = fromSvgPoint(
      {
        x: ((event.clientX - rect.left) / rect.width) * SIZE,
        y: ((event.clientY - rect.top) / rect.height) * SIZE,
      },
      SIZE,
    );

    if (point === 'p1') {
      onChange(sanitizeBezier({ ...value, x1: next.x, y1: next.y }));
      return;
    }

    onChange(sanitizeBezier({ ...value, x2: next.x, y2: next.y }));
  };

  const startDrag = (event: PointerEvent<SVGCircleElement>, point: 'p1' | 'p2') => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePoint(event, point);
  };

  const continueDrag = (event: PointerEvent<SVGCircleElement>, point: 'p1' | 'p2') => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    updatePoint(event, point);
  };

  const renderGridLine = (position: number) => (
    <g key={position}>
      <line className="grid-line" x1={position * SIZE} y1="0" x2={position * SIZE} y2={SIZE} />
      <line className="grid-line" x1="0" y1={position * SIZE} x2={SIZE} y2={position * SIZE} />
    </g>
  );

  const renderPoint = (point: Point, className: string) => (
    <circle className={className} cx={point.x} cy={point.y} r="5" />
  );

  return (
    <section className="panel editor-panel" aria-label="Bezier editor">
      <svg ref={svgRef} className="bezier-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img">
        <rect className="graph-background" x="0" y="0" width={SIZE} height={SIZE} />
        {GRID_LINES.map(renderGridLine)}
        <line className="axis-line" x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
        <line className="control-line" x1={start.x} y1={start.y} x2={p1.x} y2={p1.y} />
        <line className="control-line" x1={end.x} y1={end.y} x2={p2.x} y2={p2.y} />
        <path className="bezier-path" d={path} />
        {renderPoint(start, 'endpoint')}
        {renderPoint(end, 'endpoint')}
        <BezierHandle
          label="P1"
          point={p1}
          onPointerDown={(event) => startDrag(event, 'p1')}
          onPointerMove={(event) => continueDrag(event, 'p1')}
        />
        <BezierHandle
          label="P2"
          point={p2}
          onPointerDown={(event) => startDrag(event, 'p2')}
          onPointerMove={(event) => continueDrag(event, 'p2')}
        />
      </svg>
    </section>
  );
}
