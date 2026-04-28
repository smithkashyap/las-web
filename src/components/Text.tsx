import { typographyMap } from '../renderer/typography';
import type { UINode } from '../renderer/types';
import { resolveResponsiveStyle } from '../renderer/responsive';

export function Text({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as { value?: string; variant?: string };
  const variantStyle = props.variant ? typographyMap[props.variant] ?? {} : {};
  const resolvedStyle = resolveResponsiveStyle(node);

  return (
    <p style={{ fontFamily: "'Inter', sans-serif", margin: 0, ...variantStyle, ...resolvedStyle }}>
      {props.value}
    </p>
  );
}
