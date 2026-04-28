import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check, X, type LucideIcon } from 'lucide-react';
import { handleAction } from '../utils/handleAction';
import { useUIState } from '../state/uiState';
import type { UINode, Action } from '../renderer/types';
import { resolveResponsiveStyle } from '../renderer/responsive';

const iconMap: Record<string, LucideIcon> = {
  'arrow-left': ArrowLeft,
  'chevron-right': ChevronRight,
  check: Check,
  x: X,
};

export function Button({ node }: { node: UINode }) {
  const navigate = useNavigate();
  const { state, getBoolean, setValue } = useUIState();
  const props = (node.props ?? {}) as {
    label?: string;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    action?: Action;
    disabled?: boolean;
    disabledWhenFalse?: string;
    disabledWhenEmpty?: string;
    disableWhenInvalid?: boolean;
    validateFields?: string[];
  };
  const validateFields = props.validateFields ?? [];
  const hasInvalidFields = validateFields.some((field) => {
    const value = state.values[field];
    const error = state.errors[field];
    // Also check selections array for fields stored there
    const selections = state.selections[field];
    if (selections !== undefined) return selections.length === 0;
    return !value || !!error;
  });

  let isDisabled = Boolean(props.disabled);
  if (!isDisabled && props.disabledWhenFalse) {
    isDisabled = !getBoolean(props.disabledWhenFalse);
  }
  if (!isDisabled && props.disabledWhenEmpty) {
    isDisabled = (state.selections[props.disabledWhenEmpty] ?? []).length === 0;
  }
  if (!isDisabled && props.disableWhenInvalid) {
    isDisabled = hasInvalidFields;
  }

  const Icon = props.icon ? iconMap[props.icon] : null;
  const resolvedStyle = resolveResponsiveStyle(node);

  return (
    <button
      onClick={isDisabled ? undefined : () => props.action && handleAction(props.action, navigate, setValue)}
      disabled={isDisabled}
      style={{
        fontFamily: "'Inter', sans-serif",
        ...resolvedStyle,
        ...(isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
    >
      {Icon ? <Icon size={props.iconSize ?? 18} color={props.iconColor ?? '#f1f5f9'} /> : props.label}
    </button>
  );
}
