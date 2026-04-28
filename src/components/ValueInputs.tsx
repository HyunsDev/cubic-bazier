import { sanitizeBezier, type BezierValue } from '../utils/bezier';

type ValueInputsProps = {
  value: BezierValue;
  onChange: (value: BezierValue) => void;
};

const fields: Array<keyof BezierValue> = ['x1', 'y1', 'x2', 'y2'];

export function ValueInputs({ value, onChange }: ValueInputsProps) {
  const update = (key: keyof BezierValue, nextValue: string) => {
    const parsed = Number(nextValue);

    if (Number.isNaN(parsed)) {
      return;
    }

    onChange(sanitizeBezier({ ...value, [key]: parsed }));
  };

  return (
    <section className="panel value-panel" aria-label="Values">
      {fields.map((field) => (
        <label className="value-field" key={field}>
          <span>{field}</span>
          <input
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={value[field]}
            onChange={(event) => update(field, event.target.value)}
          />
        </label>
      ))}
    </section>
  );
}
