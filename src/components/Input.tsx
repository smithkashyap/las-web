import { useCallback, useState } from 'react';
import type { UINode } from '../renderer/types';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return digits.slice(0, 5) + ' ' + digits.slice(5);
}

export function Input({ node }: { node: UINode }) {
  const [value, setValue] = useState('');
  const props = (node.props ?? {}) as {
    placeholder?: string;
    inputType?: string;
    maxLength?: number;
    format?: string;
  };

  const isPhone = props.format === 'phone';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isPhone) {
        setValue(formatPhone(e.target.value));
      } else {
        setValue(e.target.value);
      }
    },
    [isPhone],
  );

  return (
    <input
      type={props.inputType ?? 'text'}
      inputMode={isPhone ? 'numeric' : undefined}
      placeholder={props.placeholder}
      maxLength={isPhone ? 11 : props.maxLength}
      style={{ fontFamily: "'Inter', sans-serif", ...node.style }}
      value={value}
      onChange={handleChange}
    />
  );
}
