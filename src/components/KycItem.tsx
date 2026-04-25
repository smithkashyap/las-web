import { useNavigate } from 'react-router-dom';
import { handleAction } from '../utils/handleAction';
import { useUIState } from '../state/uiState';
import { typographyMap } from '../renderer/typography';
import type { UINode, Action } from '../renderer/types';

interface KycItemProps {
  icon: string;
  title: string;
  subtitle: string;
  status?: 'done' | 'pending';
  action?: Action;
  stateKey?: string;
  onClick?: () => void;
}

const STATUS = {
  done: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Done' },
  pending: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Pending' },
} as const;

export function KycItem({ node }: { node: UINode }) {
  const navigate = useNavigate();
  const { setValue, getBoolean } = useUIState();
  const props = (node.props ?? {}) as KycItemProps;

  const isDoneViaState = props.stateKey ? getBoolean(props.stateKey) : false;
  const effectiveStatus: 'done' | 'pending' | undefined = isDoneViaState ? 'done' : props.status;
  const isDone = effectiveStatus === 'done';
  const hasAction = !!props.action;
  const isActive = hasAction && !isDone;

  return (
    <div
      onClick={props.onClick}
      style={{
        borderRadius: '16px',
        border: isActive ? '1px solid #3b82f6' : '1px solid #1e293b',
        backgroundColor: isActive ? 'rgba(59,130,246,0.05)' : '#111827',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        cursor: props.onClick ? 'pointer' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ ...typographyMap.emoji, margin: 0 }}>{props.icon}</span>
        <div>
          <p style={{ ...typographyMap.bodySemibold, color: '#f1f5f9', margin: 0 }}>{props.title}</p>
          <p style={{ ...typographyMap.caption, color: '#94a3b8', margin: '2px 0 0 0' }}>{props.subtitle}</p>
        </div>
      </div>

      {isDone ? (
        <span style={{ backgroundColor: STATUS.done.bg, padding: '4px 12px', borderRadius: '8px', ...typographyMap.badge, color: STATUS.done.color }}>
          {STATUS.done.label}
        </span>
      ) : isActive ? (
        <button
          onClick={(e) => { e.stopPropagation(); props.action && handleAction(props.action, navigate, setValue); }}
          style={{ backgroundColor: 'rgba(59,130,246,0.15)', padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', ...typographyMap.badge, color: '#3b82f6', fontFamily: "'Inter', sans-serif" }}
        >
          Start
        </button>
      ) : effectiveStatus === 'pending' ? (
        <span style={{ backgroundColor: STATUS.pending.bg, padding: '4px 12px', borderRadius: '8px', ...typographyMap.badge, color: STATUS.pending.color }}>
          {STATUS.pending.label}
        </span>
      ) : null}
    </div>
  );
}
