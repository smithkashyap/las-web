import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Calendar } from 'lucide-react';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

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
    validation?: 'required' | 'dob';
  };

  const validate = (val: string): string => {
    if (props.validation !== 'required' && props.validation !== 'dob') return '';

    if (props.validation === 'dob') {
      return !/^\d{2}\/\d{2}\/\d{4}$/.test(val) ? 'Invalid date of birth' : '';
    }


    return val.trim() === '' ? 'This field is required' : '';
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(formatDate(e.target.value));
  }, []);

  useEffect(() => {
    if (!props.stateKey) return;
    setGlobalValue(props.stateKey, value);
    const msg = validate(value);
    setError(props.stateKey, msg);
    if (touched) {
      setErrorMsg(msg);
    }
  }, [props.stateKey, setError, setGlobalValue, value]);

  const onBlur = useCallback(() => {
    setTouched(true);
    const msg = validate(value);
    setErrorMsg(msg);
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...node.style }}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', ...node.style }}>
      <input
        type="text"
        inputMode="numeric"
        placeholder={props.placeholder ?? 'DD/MM/YYYY'}
        maxLength={props.maxLength ?? 10}
        style={{ fontFamily: "'Inter', sans-serif", paddingRight: '48px', ...props.inputStyle }}
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
      <input ref={ref} type="date" onChange={(e) => setValue(e.target.value ? isoToFormatted(e.target.value) : '')} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} tabIndex={-1} />
    </div>
      {errorMsg && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
