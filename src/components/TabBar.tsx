import type { CSSProperties } from 'react';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

interface Tab {
  key: string;
  label: string;
}

interface TabBarProps {
  stateKey: string;
  defaultValue?: string;
  tabs: Tab[];
  containerStyle?: CSSProperties;
  activeStyle?: CSSProperties;
  inactiveStyle?: CSSProperties;
  activeTextStyle?: CSSProperties;
  inactiveTextStyle?: CSSProperties;
}

export function TabBar({ node }: { node: UINode }) {
  const { getString, setValue } = useUIState();
  const props = (node.props ?? {}) as TabBarProps;

  const current = getString(props.stateKey) || props.defaultValue || props.tabs[0]?.key || '';

  // Initialize default on first render
  if (!getString(props.stateKey) && props.defaultValue) {
    setValue(props.stateKey, props.defaultValue);
  }

  return (
    <div style={{ display: 'flex', gap: '8px', ...props.containerStyle }}>
      {props.tabs.map((tab) => {
        const isActive = current === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setValue(props.stateKey, tab.key)}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              ...(isActive ? props.activeStyle : props.inactiveStyle),
            }}
          >
            <span style={isActive ? props.activeTextStyle : props.inactiveTextStyle}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
