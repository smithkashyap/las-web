import { useCallback, useRef, useState, type CSSProperties } from 'react';
import type { UINode } from '../renderer/types';

export function OtpInput({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as { length?: number; boxStyle?: CSSProperties };
  const len = props.length ?? 6;
  const [digits, setDigits] = useState<string[]>(Array(len).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const onChange = useCallback((i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...digits]; n[i] = v.slice(-1); setDigits(n);
    if (v && i < len - 1) refs.current[i + 1]?.focus();
  }, [digits, len]);

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
    refs.current[Math.min(p.length, len - 1)]?.focus();
  }, [len]);

  const box: CSSProperties = props.boxStyle ?? {
    width: '48px', height: '56px', textAlign: 'center', fontSize: '20px', fontWeight: '600',
    borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#f1f5f9', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', ...node.style }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
          value={d} onChange={(e) => onChange(i, e.target.value)} onKeyDown={(e) => onKey(i, e)}
          onPaste={i === 0 ? onPaste : undefined} autoFocus={i === 0}
          style={{ fontFamily: "'Inter', sans-serif", ...box }} />
      ))}
    </div>
  );
}
