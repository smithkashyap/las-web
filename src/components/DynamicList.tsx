import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import { handleAction } from '../utils/handleAction';
import { useUIState } from '../state/uiState';
import type { UINode, Action } from '../renderer/types';
import { resolveNodeStyle } from '../renderer/styles';

interface DynamicListProps {
  itemType: string;
  items: Record<string, unknown>[];
  extraProps?: Record<string, unknown>;
  onItemClick?: Action;
}

export function DynamicList({ node }: { node: UINode }) {
  const navigate = useNavigate();
  const { setValue } = useUIState();
  const props = (node.props ?? {}) as unknown as DynamicListProps;
  const items = props.items ?? [];

  const resolvedStyle = resolveNodeStyle(node, 'container', {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  });

  const handleItemClick = useCallback(
    (item: Record<string, unknown>) => {
      const itemAction = item.action as Action | undefined;
      const action = itemAction ?? props.onItemClick;
      if (action) handleAction(action, navigate, setValue);
    },
    [props.onItemClick, navigate, setValue],
  );

  return (
    <div style={resolvedStyle}>
      {items.map((item, i) => {
        const hasItemAction = !!item.action;
        const hasListAction = !!props.onItemClick;
        const shouldInjectClick = hasItemAction || hasListAction;

        return (
          <DynamicRenderer
            key={i}
            node={{
              type: props.itemType,
              props: {
                ...item,
                ...props.extraProps,
                ...(shouldInjectClick ? { onClick: () => handleItemClick(item) } : {}),
              },
            }}
          />
        );
      })}
    </div>
  );
}
