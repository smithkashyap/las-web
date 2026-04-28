import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';
import { resolveNodeStyle, theme } from '../renderer/styles';

export function Checkbox({ node }: { node: UINode }) {
  const { getBoolean, setValue } = useUIState();
  const props = (node.props ?? {}) as { label: string; stateKey: string };
  const checked = getBoolean(props.stateKey);

  // Resolve style: base → variant → size → node.style
  const resolvedStyle = resolveNodeStyle(node, 'checkbox', {
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <label style={resolvedStyle} onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={() => setValue(props.stateKey, !checked)}
        style={{ marginTop: '2px', width: '18px', height: '18px', accentColor: theme.primary, cursor: 'pointer', flexShrink: 0 }} />
      <span style={{ fontSize: resolvedStyle.fontSize ?? '12px', color: theme.textSecondary, lineHeight: '1.5' }}>{props.label}</span>
    </label>
  );
}
