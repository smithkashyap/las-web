import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

export function Checkbox({ node }: { node: UINode }) {
  const { getBoolean, setValue } = useUIState();
  const props = (node.props ?? {}) as { label: string; stateKey: string };
  const checked = getBoolean(props.stateKey);

  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontFamily: "'Inter', sans-serif", ...node.style }} onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={() => setValue(props.stateKey, !checked)}
        style={{ marginTop: '2px', width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer', flexShrink: 0 }} />
      <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>{props.label}</span>
    </label>
  );
}
