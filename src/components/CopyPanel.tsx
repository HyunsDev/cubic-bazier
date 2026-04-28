import { useEffect, useState } from 'react';
import { parseBezier, type BezierValue } from '../utils/bezier';

type CopyPanelProps = {
  timing: string;
  onChange: (value: BezierValue) => void;
};

export function CopyPanel({ timing, onChange }: CopyPanelProps) {
  const [inputValue, setInputValue] = useState(timing);
  const [copied, setCopied] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const cssLine = `transition-timing-function: ${timing};`;

  useEffect(() => {
    setInputValue(timing);
    setIsInvalid(false);
  }, [timing]);

  const applyInput = (nextValue: string) => {
    setInputValue(nextValue);

    const parsed = parseBezier(nextValue);
    setIsInvalid(parsed === null);

    if (parsed) {
      onChange(parsed);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="panel copy-panel" aria-label="Copy">
      <input
        aria-invalid={isInvalid}
        className="bezier-input"
        value={inputValue}
        onChange={(event) => applyInput(event.target.value)}
      />
      <div className="copy-actions">
        <button className="button" type="button" onClick={() => copy(timing)}>
          copy value
        </button>
        <button className="button" type="button" onClick={() => copy(cssLine)}>
          copy css
        </button>
      </div>
      <span className="copy-state" aria-live="polite">
        {copied ? 'copied' : isInvalid ? 'invalid' : ''}
      </span>
    </section>
  );
}
