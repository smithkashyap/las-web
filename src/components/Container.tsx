import { DynamicRenderer } from '../renderer/DynamicRenderer';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';
import { resolveResponsiveStyle } from '../renderer/responsive';

export function Container({ node }: { node: UINode }) {
  const { toggleSelection, isSelected } = useUIState();
  const resolvedStyle = resolveResponsiveStyle(node);
  const props = (node.props ?? {}) as {
    selectable?: boolean;
    selectionKey?: string;
    value?: string;
  };

  if (props.selectable && props.selectionKey && props.value) {
    const selected = isSelected(props.selectionKey, props.value);
    return (
      <div
        onClick={() => toggleSelection(props.selectionKey!, props.value!)}
        style={{
          ...resolvedStyle,
          border: selected ? '1px solid #3b82f6' : (resolvedStyle?.border ?? '1px solid #1e293b'),
          backgroundColor: selected ? 'rgba(59,130,246,0.1)' : (resolvedStyle?.backgroundColor ?? '#111827'),
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
