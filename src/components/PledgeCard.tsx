import type { CSSProperties } from 'react';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

interface PledgeCardProps {
  value: string;
  title: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  ltv: string;
  ltvValue: string;
  rate: string;
  rateValue: string;
  note: string;
  selectionKey: string;
  containerStyle?: CSSProperties;
  selectedStyle?: CSSProperties;
  headerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  badgeStyle?: CSSProperties;
  rowStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  ltvValueStyle?: CSSProperties;
  rateValueStyle?: CSSProperties;
  noteStyle?: CSSProperties;
  onClick?: () => void;
}

export function PledgeCard({ node }: { node: UINode }) {
  const { isSelected, toggleSelection } = useUIState();
  const props = (node.props ?? {}) as unknown as PledgeCardProps;

  const selected = isSelected(props.selectionKey, props.value);

  const handleClick = () => {
    toggleSelection(props.selectionKey, props.value);
    props.onClick?.();
  };

  const finalStyle: CSSProperties = {
    ...props.containerStyle,
    ...(selected ? props.selectedStyle : {}),
    cursor: 'pointer',
    transition: 'border-color 0.2s, background-color 0.2s',
  };

  return (
    <div onClick={handleClick} style={finalStyle}>
      <div style={props.headerStyle}>
        <p style={props.titleStyle}>{props.title}</p>
        <span style={{ ...props.badgeStyle, color: props.badgeColor, backgroundColor: props.badgeBg }}>
          {props.badge}
        </span>
      </div>

      <div style={props.rowStyle}>
        <p style={props.labelStyle}>{props.ltv}</p>
        <p style={props.ltvValueStyle}>{props.ltvValue}</p>
      </div>

      <div style={props.rowStyle}>
        <p style={props.labelStyle}>{props.rate}</p>
        <p style={props.rateValueStyle}>{props.rateValue}</p>
      </div>

      <p style={props.noteStyle}>{props.note}</p>
    </div>
  );
}
