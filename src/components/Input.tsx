import { useCallback, useEffect, useState } from 'react';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return digits.slice(0, 5) + ' ' + digits.slice(5);
}

export function Input({ node }: { node: UINode }) {
  const { setValue, setError } = useUIState();
  const [touched, setTouched] = useState(false);
  const [value, setLocalValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const props = (node.props ?? {}) as {
    placeholder?: string;
    inputType?: string;
    maxLength?: number;
    format?: string;
    stateKey?: string;
    validation?: 'required' | 'email' | 'pan' | 'dob';
  };

  const isPhone = props.format === 'phone';

  const validate = (val: string): string => {
    if (!props.validation) return '';

    switch (props.validation) {
      case 'required':
        return val.trim() === '' ? 'This field is required' : '';

      case 'email':
        return !/^\S+@\S+\.\S+$/.test(val) ? 'Invalid email' : '';

      case 'dob':
        return !/^\d{2}\/\d{2}\/\d{4}$/.test(val) ? 'Invalid date of birth' : '';

      case 'pan':
        return !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val) ? 'Invalid PAN' : '';

      default:
        return '';
    }
  };

  useEffect(() => {
    if (!props.stateKey) return;

    const msg = validate(value);
    setValue(props.stateKey, value);
    setError(props.stateKey, msg);
  }, [props.stateKey, setError, setValue, value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      if (props.validation === 'pan') {
        val = val.toUpperCase();
      }

      if (isPhone) {
        val = formatPhone(val);
      }

      setLocalValue(val);
      if (touched) {
        setErrorMsg(validate(val));
      }
    },
    [isPhone, props.validation, touched]
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    const msg = validate(value);
    setErrorMsg(msg);
  }, [value]);


  return (
    <div>
      <input
        type={props.inputType ?? 'text'}
        inputMode={isPhone ? 'numeric' : undefined}
        placeholder={props.placeholder}
        maxLength={isPhone ? 11 : props.maxLength}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        style={{
          fontFamily: "'Inter', sans-serif",
          ...node.style,
          border: errorMsg ? '1px solid red' : node.style?.border,
        }}
      />

      {errorMsg && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
