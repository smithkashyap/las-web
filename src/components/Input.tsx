import { useCallback, useEffect, useState } from 'react';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';
import { validateValue, type ValidationRule } from '../utils/validationEngine';
import { resolveNodeStyle } from '../renderer/styles';

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
    validation?: { rules?: ValidationRule[] };
  };

  const isPhone = props.format === 'phone';
  const hasPanRule = props.validation?.rules?.some((rule) => rule.type === 'pan') ?? false;
  const rules = props.validation?.rules;

  // Always sync value + global error — never show UI error here
  useEffect(() => {
    if (!props.stateKey) return;
    const msg = validateValue(value, rules);
    setValue(props.stateKey, value);
    setError(props.stateKey, msg);
  }, [value, props.stateKey, rules, setValue, setError]);

  // Show UI error only when touched — re-runs when either value or touched changes
  useEffect(() => {
    if (!touched) return;
    const msg = validateValue(value, rules);
    setErrorMsg(msg);
  }, [value, touched, rules]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (hasPanRule) val = val.toUpperCase();
      if (isPhone) val = formatPhone(val);
      setLocalValue(val);
    },
    [hasPanRule, isPhone],
  );

  const onBlur = useCallback(() => {
    setTouched(true);
  }, []);

  // Resolve style: base → variant → size → node.style
  const resolvedStyle = resolveNodeStyle(node, 'input', {
    fontFamily: "'Inter', sans-serif",
  });

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
          ...resolvedStyle,
          border: errorMsg ? '1px solid red' : resolvedStyle.border,
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
