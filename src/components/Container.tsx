import { DynamicRenderer } from '../renderer/DynamicRenderer';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

export function Container({ node }: { node: UINode }) {
  const { toggleSelection, isSelected } = useUIState();
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
          ...node.style,
          border: selected ? '1px solid #3b82f6' : (node.style?.border ?? '1px solid #1e293b'),
          backgroundColor: selected ? 'rgba(59,130,246,0.1)' : (node.style?.backgroundColor ?? '#111827'),
          cursor: 'pointer',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      >
        {node.children?.map((child, i) => <DynamicRenderer key={i} node={child} />)}
      </div>
    );
  }

  return (
    <div style={node.style}>
      {node.children?.map((child, i) => <DynamicRenderer key={i} node={child} />)}
    </div>
  );
}
