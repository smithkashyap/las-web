import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check, X, type LucideIcon } from 'lucide-react';
import { handleAction } from '../utils/handleAction';
import { useUIState } from '../state/uiState';
import type { UINode, Action } from '../renderer/types';

const iconMap: Record<string, LucideIcon> = {
  'arrow-left': ArrowLeft,
  'chevron-right': ChevronRight,
  check: Check,
  x: X,
};

export function Button({ node }: { node: UINode }) {
  const navigate = useNavigate();
  const { getBoolean, setValue } = useUIState();
  const props = (node.props ?? {}) as {
    label?: string;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    action?: Action;
    disabled?: boolean;
    disabledWhenFalse?: string;
  };

  let isDisabled = Boolean(props.disabled);
  if (!isDisabled && props.disabledWhenFalse) isDisabled = !getBoolean(props.disabledWhenFalse);

  const Icon = props.icon ? iconMap[props.icon] : null;

  return (
    <button
      onClick={isDisabled ? undefined : () => props.action && handleAction(props.action, navigate, setValue)}
      disabled={isDisabled}
      style={{
        fontFamily: "'Inter', sans-serif",
        ...node.style,
        ...(isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
    >
      {Icon ? <Icon size={props.iconSize ?? 18} color={props.iconColor ?? '#f1f5f9'} /> : props.label}
    </button>
  );
}
