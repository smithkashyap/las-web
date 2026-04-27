import { useCallback, useRef, useState, type CSSProperties } from 'react';
import type { UINode } from '../renderer/types';
import { useUIState } from '../state/uiState';

export function OtpInput({ node }: { node: UINode }) {
  const { setValue, setError } = useUIState();
  const props = (node.props ?? {}) as {
    length?: number;
    stateKey?: string;
    containerStyle?: CSSProperties;
    boxStyle?: CSSProperties;
  };
  const len = props.length ?? 6;
  const [digits, setDigits] = useState<string[]>(Array(len).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const validateOtp = useCallback((value: string) => {
    return value.length === len ? '' : 'Invalid OTP';
  }, [len]);

  const onChange = useCallback((i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...digits];
    n[i] = v.slice(-1);
    setDigits(n);
    if (props.stateKey) {
      const otpValue = n.join('');
      setValue(props.stateKey, otpValue);
      setError(props.stateKey, validateOtp(otpValue));
    }
    if (v && i < len - 1) refs.current[i + 1]?.focus();
  }, [digits, len, props.stateKey, setError, setValue, validateOtp]);

  const onKey = useCallback((i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }, [digits]);

  const onPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, len);
    if (!p) return;
    const n = Array(len).fill('');
    for (let i = 0; i < p.length; i++) n[i] = p[i]!;
    setDigits(n);
    if (props.stateKey) {
      const otpValue = n.join('');
      setValue(props.stateKey, otpValue);
      setError(props.stateKey, validateOtp(otpValue));
    }
    refs.current[Math.min(p.length, len - 1)]?.focus();
  }, [len, props.stateKey, setError, setValue, validateOtp]);

  const box: CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    textAlign: 'center',
    outline: 'none',
    ...props.boxStyle,
  };

  return (
    <div style={{ ...props.containerStyle, ...node.style }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
          value={d} onChange={(e) => onChange(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
          onPaste={i === 0 ? onPaste : undefined} autoFocus={i === 0}
          style={box} />
      ))}
    </div>
  );
}
