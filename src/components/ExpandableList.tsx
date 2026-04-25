import { useState } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import type { UINode } from '../renderer/types';

interface ExpandableListProps {
  itemType: string;
  items: Record<string, unknown>[];
  extraProps?: Record<string, unknown>;
  initialCount?: number;
  moreLabel?: string;
  lessLabel?: string;
  controlStyle?: React.CSSProperties;
}

export function ExpandableList({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as ExpandableListProps;
  const items = props.items ?? [];
  const initialCount = props.initialCount ?? 2;
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? items : items.slice(0, initialCount);
  const remaining = items.length - initialCount;
  const hasMore = items.length > initialCount;

  const label = showAll
    ? props.lessLabel ?? 'Show less'
    : `${remaining} ${props.moreLabel ?? 'more holdings'}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...node.style }}>
      {visible.map((item, i) => (
        <DynamicRenderer
          key={i}
          node={{
            type: props.itemType,
            props: { ...item, ...props.extraProps },
          }}
        />
      ))}

      {hasMore && (
        <button
          onClick={() => setShowAll((p) => !p)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: '#3b82f6',
            textAlign: 'center',
            ...props.controlStyle,
          }}
        >
          {label}
        </button>
      )}
    </div>
  );
}
