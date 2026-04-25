import { typographyMap } from '../renderer/typography';
import type { UINode } from '../renderer/types';

export function Text({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as { value?: string; variant?: string };
  const variantStyle = props.variant ? typographyMap[props.variant] ?? {} : {};

  return (
    <p style={{ fontFamily: "'Inter', sans-serif", margin: 0, ...variantStyle, ...node.style }}>
      {props.value}
    </p>
  );
}
