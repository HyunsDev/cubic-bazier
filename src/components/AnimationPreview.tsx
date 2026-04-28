import { useState, type CSSProperties } from 'react';
import { clamp } from '../utils/clamp';

type AnimationPreviewProps = {
  timing: string;
};

type PreviewItem = {
  name: string;
  timing: string;
};

const compareItems: PreviewItem[] = [
  { name: 'linear', timing: 'linear' },
  { name: 'ease', timing: 'ease' },
  { name: 'ease-in', timing: 'ease-in' },
  { name: 'ease-out', timing: 'ease-out' },
  { name: 'ease-in-out', timing: 'ease-in-out' },
];

const DOT_SIZE = 18;

export function AnimationPreview({ timing }: AnimationPreviewProps) {
  const [runId, setRunId] = useState(0);
  const [width, setWidth] = useState(520);
  const [duration, setDuration] = useState(1200);
  const [selectedItems, setSelectedItems] = useState<string[]>(['linear']);
  const dotStyle = {
    animationDuration: `${duration}ms`,
    '--preview-size': `${DOT_SIZE}px`,
  } as CSSProperties;
  const trackStyle = {
    maxWidth: `${width}px`,
  } as CSSProperties;
  const previewItems = [
    ...compareItems.filter((item) => selectedItems.includes(item.name)),
    { name: 'custom', timing },
  ];

  const updateWidth = (value: string) => {
    const next = Number(value);

    if (!Number.isNaN(next)) {
      setWidth(clamp(next, 160, 1200));
    }
  };

  const updateDuration = (value: string) => {
    const next = Number(value);

    if (!Number.isNaN(next)) {
      setDuration(clamp(next, 100, 5000));
    }
  };

  const toggleItem = (name: string) => {
    setSelectedItems((items) =>
      items.includes(name) ? items.filter((item) => item !== name) : [...items, name],
    );
  };

  return (
    <section className="panel preview-panel" aria-label="Preview">
      <div className="preview-header">
        <span>preview</span>
        <div className="preview-controls">
          <label className="preview-control">
            <span>width</span>
            <input type="number" min="160" max="1200" step="10" value={width} onChange={(event) => updateWidth(event.target.value)} />
          </label>
          <label className="preview-control">
            <span>duration</span>
            <input type="number" min="100" max="5000" step="100" value={duration} onChange={(event) => updateDuration(event.target.value)} />
          </label>
          <button className="button" type="button" onClick={() => setRunId((value) => value + 1)}>
            play
          </button>
        </div>
      </div>
      <div className="preview-options" aria-label="Compare options">
        {compareItems.map((item) => (
          <label className="preview-option" key={item.name}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.name)}
              onChange={() => toggleItem(item.name)}
            />
            <span>{item.name}</span>
          </label>
        ))}
      </div>
      <div className="preview-track">
        {previewItems.map((item) => (
          <div className="preview-row" key={item.name}>
            <span>{item.name}</span>
            <div className="track-line" style={trackStyle}>
              <div
                key={`${item.name}-${runId}-${width}-${duration}-${item.timing}`}
                className={`preview-dot${item.name === 'custom' ? ' custom-dot' : ''}`}
                style={{ ...dotStyle, animationTimingFunction: item.timing }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
