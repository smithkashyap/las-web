import { DynamicRenderer } from '../renderer/DynamicRenderer';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';
import { resolveNodeStyle, theme } from '../renderer/styles';

export function Container({ node }: { node: UINode }) {
  const { toggleSelection, isSelected } = useUIState();
  const props = (node.props ?? {}) as {
    selectable?: boolean;
    selectionKey?: string;
    value?: string;
  };

  // Resolve style: base → variant → size → node.style
  const resolvedStyle = resolveNodeStyle(node, 'container');

  if (props.selectable && props.selectionKey && props.value) {
    const selected = isSelected(props.selectionKey, props.value);
    return (
      <div
        onClick={() => toggleSelection(props.selectionKey!, props.value!)}
        style={{
          ...resolvedStyle,
          border: selected ? `1px solid ${theme.primary}` : resolvedStyle.border,
          backgroundColor: selected ? 'rgba(59,130,246,0.1)' : resolvedStyle.backgroundColor,
          cursor: 'pointer',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      >
        {node.children?.map((child, i) => <DynamicRenderer key={i} node={child} />)}
      </div>
    );
  }

  return (
    <div style={resolvedStyle}>
      {node.children?.map((child, i) => <DynamicRenderer key={i} node={child} />)}
    </div>
  );
}
