import type { BezierValue } from '../utils/bezier';

type Preset = {
  name: string;
  value: BezierValue;
};

type PresetGroup = {
  label: string;
  presets: Preset[];
};

type PresetListProps = {
  current: BezierValue;
  onSelect: (value: BezierValue) => void;
};

const presetGroups: PresetGroup[] = [
  {
    label: 'built-in',
    presets: [
      { name: 'linear', value: { x1: 0, y1: 0, x2: 1, y2: 1 } },
      { name: 'ease', value: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 } },
      { name: 'ease-in', value: { x1: 0.42, y1: 0, x2: 1, y2: 1 } },
      { name: 'ease-out', value: { x1: 0, y1: 0, x2: 0.58, y2: 1 } },
      { name: 'ease-in-out', value: { x1: 0.42, y1: 0, x2: 0.58, y2: 1 } },
    ],
  },
  {
    label: 'extended',
    presets: [
      { name: 'quad-in', value: { x1: 0.55, y1: 0.085, x2: 0.68, y2: 0.53 } },
      { name: 'quad-out', value: { x1: 0.25, y1: 0.46, x2: 0.45, y2: 0.94 } },
      { name: 'quad-in-out', value: { x1: 0.455, y1: 0.03, x2: 0.515, y2: 0.955 } },
      { name: 'cubic-in', value: { x1: 0.55, y1: 0.055, x2: 0.675, y2: 0.19 } },
      { name: 'cubic-out', value: { x1: 0.215, y1: 0.61, x2: 0.355, y2: 1 } },
      { name: 'cubic-in-out', value: { x1: 0.645, y1: 0.045, x2: 0.355, y2: 1 } },
      { name: 'quart-in', value: { x1: 0.895, y1: 0.03, x2: 0.685, y2: 0.22 } },
      { name: 'quart-out', value: { x1: 0.165, y1: 0.84, x2: 0.44, y2: 1 } },
      { name: 'quart-in-out', value: { x1: 0.77, y1: 0, x2: 0.175, y2: 1 } },
    ],
  },
  {
    label: 'special',
    presets: [
      { name: 'sharp', value: { x1: 0.4, y1: 0, x2: 0.6, y2: 1 } },
      { name: 'swift-out', value: { x1: 0.4, y1: 0, x2: 0.2, y2: 1 } },
      { name: 'material', value: { x1: 0.4, y1: 0, x2: 0.2, y2: 1 } },
      { name: 'soft', value: { x1: 0.33, y1: 0, x2: 0.2, y2: 1 } },
      { name: 'snap', value: { x1: 0.9, y1: 0, x2: 0.1, y2: 1 } },
      { name: 'slow-start', value: { x1: 0.8, y1: 0, x2: 0.9, y2: 0.5 } },
      { name: 'slow-end', value: { x1: 0.1, y1: 0.5, x2: 0.2, y2: 1 } },
      { name: 's-curve', value: { x1: 0.7, y1: 0, x2: 0.3, y2: 1 } },
    ],
  },
];

function isSameValue(left: BezierValue, right: BezierValue) {
  return left.x1 === right.x1 && left.y1 === right.y1 && left.x2 === right.x2 && left.y2 === right.y2;
}

export function PresetList({ current, onSelect }: PresetListProps) {
  return (
    <section className="panel preset-panel" aria-label="Presets">
      {presetGroups.map((group) => (
        <div className="preset-group" key={group.label}>
          <span className="preset-label">{group.label}</span>
          <div className="preset-buttons">
            {group.presets.map((preset) => (
              <button
                className="button"
                data-active={isSameValue(current, preset.value)}
                key={`${group.label}-${preset.name}`}
                type="button"
                onClick={() => onSelect(preset.value)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
