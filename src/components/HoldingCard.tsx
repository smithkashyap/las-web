import type { CSSProperties } from 'react';
import { typographyMap } from '../renderer/typography';
import type { UINode } from '../renderer/types';
import { getSizeStyle } from '../renderer/responsive';

interface HoldingCardProps {
  code: string;
  codeBg: string;
  codeColor: string;
  name: string;
  subtitle: string;
  value: string;
  change: string;
  changeColor: string;
  containerStyle?: CSSProperties;
}

export function HoldingCard({ node }: { node: UINode }) {
  const props = (node.props ?? {}) as unknown as HoldingCardProps;
  const sizeStyle = getSizeStyle(node, 'container');

  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid #1e293b',
        backgroundColor: '#111827',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sizeStyle,
        ...props.containerStyle,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: props.codeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ ...typographyMap.badgeSmall, color: props.codeColor }}>{props.code}</span>
        </div>
        <div>
          <p style={{ ...typographyMap.bodySemibold, color: '#f1f5f9', margin: 0 }}>{props.name}</p>
          <p style={{ ...typographyMap.caption, color: '#94a3b8', margin: '2px 0 0 0' }}>{props.subtitle}</p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ ...typographyMap.bodySemibold, color: '#f1f5f9', margin: 0 }}>{props.value}</p>
        <p style={{ ...typographyMap.caption, color: props.changeColor, margin: '2px 0 0 0' }}>{props.change}</p>
      </div>
    </div>
  );
}
