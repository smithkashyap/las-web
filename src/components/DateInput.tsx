import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Calendar } from 'lucide-react';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';
import { validateValue, type ValidationRule } from '../utils/validationEngine';
import { resolveNodeStyle } from '../renderer/styles';

function formatDate(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  let r = '';
  for (let i = 0; i < d.length; i++) { if (i === 2 || i === 4) r += '/'; r += d[i]; }
  return r;
}

function isoToFormatted(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : '';
}

export function DateInput({ node }: { node: UINode }) {
  const { setValue: setGlobalValue, setError } = useUIState();
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState(false);

  const props = (node.props ?? {}) as {
    placeholder?: string;
    maxLength?: number;
    inputStyle?: CSSProperties;
    iconButtonStyle?: CSSProperties;
    stateKey?: string;
    validation?: { rules?: ValidationRule[] };
  };

  const rules = props.validation?.rules;

  // Always sync value + global error — only validate when input is complete
  useEffect(() => {
    if (!props.stateKey) return;
    const isComplete = value.length === 10;
    const msg = isComplete ? validateValue(value, rules) : '';
    setGlobalValue(props.stateKey, value);
    setError(props.stateKey, msg);
  }, [value, props.stateKey, rules, setGlobalValue, setError]);

  // Show UI error only when touched AND input is complete
  useEffect(() => {
    if (!touched) return;
    const isComplete = value.length === 10;
    const msg = isComplete ? validateValue(value, rules) : '';
    setErrorMsg(msg);
  }, [value, touched, rules]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(formatDate(e.target.value));
  }, []);

  const onBlur = useCallback(() => {
    setTouched(true);
  }, []);

  // Resolve style: base → variant → size → node.style
  const resolvedStyle = resolveNodeStyle(node, 'input', {
    fontFamily: "'Inter', sans-serif",
    paddingRight: '48px',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          inputMode="numeric"
          placeholder={props.placeholder ?? 'DD/MM/YYYY'}
          maxLength={props.maxLength ?? 10}
          style={{
            ...resolvedStyle,
            ...props.inputStyle,
            border: errorMsg ? '1px solid red' : props.inputStyle?.border,
          }}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <button
          type="button"
          onClick={() => { try { ref.current?.showPicker(); } catch { ref.current?.click(); } }}
          style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', ...props.iconButtonStyle }}
        >
          <Calendar size={18} color="#94a3b8" />
        </button>
        <input
          ref={ref}
          type="date"
          onChange={(e) => { setValue(e.target.value ? isoToFormatted(e.target.value) : ''); setTouched(true); }}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
          tabIndex={-1}
        />
      </div>
      {errorMsg && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
