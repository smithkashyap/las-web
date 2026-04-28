import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAction } from '../utils/handleAction';
import { useUIState } from '../state/uiState';
import type { UINode, Action } from '../renderer/types';

interface ProviderItemProps {
  name: string;
  code: string;
  color: string;
  status: 'connected' | 'not_connected';
  action?: Action;
  containerStyle?: CSSProperties;
  activeContainerStyle?: CSSProperties;
  logoStyle?: CSSProperties;
  codeTextStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  subtitleStyle?: CSSProperties;
  connectedText?: string;
  notConnectedText?: string;
  actionStyle?: CSSProperties;
  actionLabel?: string;
  successIconStyle?: CSSProperties;
  onClick?: () => void;
}

export function ProviderItem({ node }: { node: UINode }) {
  const navigate = useNavigate();
  const { setValue } = useUIState();
  const props = (node.props ?? {}) as unknown as ProviderItemProps;

  const isConnected = props.status === 'connected';

  const containerStyle: CSSProperties = {
    ...props.containerStyle,
    ...(isConnected ? props.activeContainerStyle : {}),
    cursor: props.onClick ? 'pointer' : undefined,
  };

  return (
    <div onClick={props.onClick} style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ ...props.logoStyle, backgroundColor: props.color }}>
          <span style={props.codeTextStyle}>{props.code}</span>
        </div>
        <div>
          <p style={props.titleStyle}>{props.name}</p>
          <p style={props.subtitleStyle}>
            {isConnected ? props.connectedText ?? 'Connected' : props.notConnectedText ?? 'Tap to connect'}
          </p>
        </div>
      </div>

      {isConnected ? (
        <span style={props.successIconStyle}>✓</span>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); props.action && handleAction(props.action, navigate, setValue); }}
          style={props.actionStyle}
        >
          {props.actionLabel ?? 'Link'}
        </button>
      )}
    </div>
  );
}
