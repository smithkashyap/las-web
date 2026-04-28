import type { UINode } from '../renderer/types';
import { resolveNodeStyle, getTextColor } from '../renderer/styles';

export function Text({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as { value?: string; variant?: string; colorVariant?: string };

  // Get text color based on colorVariant prop
  const textColor = props.colorVariant ? getTextColor(props.colorVariant) : undefined;

  // Resolve style: base → variant → size → node.style
  const resolvedStyle = resolveNodeStyle(node, 'text', {
    fontFamily: "'Inter', sans-serif",
    margin: 0,
    ...(textColor ? { color: textColor } : {}),
  });

  return (
    <p style={resolvedStyle}>
      {props.value}
    </p>
  );
}
