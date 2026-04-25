import type { UINode } from '../renderer/types';

export function Image({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as { src: string; alt?: string };
  return <img src={props.src} alt={props.alt ?? ''} style={node.style} />;
}
