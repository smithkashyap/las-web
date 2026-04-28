import { typographyMap } from '../renderer/typography';
import { DynamicList } from './DynamicList';
import type { UINode } from '../renderer/types';
import { resolveResponsiveStyle } from '../renderer/responsive';

interface ProviderGroupProps {
  title: string;
  items: unknown[];
}

export function ProviderGroup({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as ProviderGroupProps;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...resolveResponsiveStyle(node) }}>
      <p style={{ ...typographyMap.sectionHeader, color: '#94a3b8', margin: 0 }}>
        {props.title}
      </p>
      <DynamicList
        node={{
          type: 'dynamic-list',
          props: {
            itemType: 'provider-item',
            items: props.items,
          } as unknown as Record<string, unknown>,
        }}
      />
    </div>
  );
}
