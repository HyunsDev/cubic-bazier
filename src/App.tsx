import { useEffect, useMemo, useState } from 'react';
import { AnimationPreview } from './components/AnimationPreview';
import { BezierEditor } from './components/BezierEditor';
import { CopyPanel } from './components/CopyPanel';
import { PresetList } from './components/PresetList';
import { ValueInputs } from './components/ValueInputs';
import { formatBezier, sanitizeBezier, type BezierValue } from './utils/bezier';

const initialValue: BezierValue = {
  x1: 0,
  y1: 0,
  x2: 1,
  y2: 1,
};

function readValueFromUrl(): BezierValue {
  const params = new URLSearchParams(window.location.search);
  const x1Param = params.get('x1');
  const y1Param = params.get('y1');
  const x2Param = params.get('x2');
  const y2Param = params.get('y2');

  if ([x1Param, y1Param, x2Param, y2Param].some((param) => param === null)) {
    return initialValue;
  }

  const x1 = Number(x1Param);
  const y1 = Number(y1Param);
  const x2 = Number(x2Param);
  const y2 = Number(y2Param);

  if ([x1, y1, x2, y2].some(Number.isNaN)) {
    return initialValue;
  }

  return sanitizeBezier({ x1, y1, x2, y2 });
}

function writeValueToUrl(value: BezierValue) {
  const params = new URLSearchParams(window.location.search);

  params.set('x1', value.x1.toString());
  params.set('y1', value.y1.toString());
  params.set('x2', value.x2.toString());
  params.set('y2', value.y2.toString());

  const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
}

export default function App() {
  const [value, setValue] = useState<BezierValue>(() => readValueFromUrl());
  const timing = useMemo(() => formatBezier(value), [value]);

  useEffect(() => {
    writeValueToUrl(value);
  }, [value]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>cubic-bezier.hyuns.dev</h1>
      </header>

      <div className="workspace">
        <BezierEditor value={value} onChange={setValue} />
        <aside className="side-column">
          <ValueInputs value={value} onChange={setValue} />
          <PresetList current={value} onSelect={setValue} />
        </aside>
      </div>

      <CopyPanel timing={timing} onChange={setValue} />
      <AnimationPreview timing={timing} />
    </main>
  );
}
