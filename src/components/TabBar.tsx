import { useEffect, type CSSProperties } from 'react';
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
  disableSingleTab?: boolean;
}

export function TabBar({ node }: { node: UINode }) {
  const { getString, setValue } = useUIState();
  const props = (node.props ?? {}) as TabBarProps;

  // Initialize default value once — no mutation during render
  useEffect(() => {
    const existing = getString(props.stateKey);
    if (!existing && props.defaultValue) {
      setValue(props.stateKey, props.defaultValue);
    }
  }, [props.stateKey, props.defaultValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const current =
    getString(props.stateKey) ??
    props.defaultValue ??
    props.tabs[0]?.key ??
    '';

  const isSingle = props.tabs.length === 1 || props.disableSingleTab === true;

  const handleClick = (key: string) => {
    if (isSingle) return;
    if (key !== current) setValue(props.stateKey, key);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', ...props.containerStyle }}>
      {props.tabs.map((tab) => {
        const isActive = current === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            style={{
              flex: 1,
              border: 'none',
              cursor: isSingle ? 'default' : 'pointer',
              opacity: isSingle ? 0.7 : 1,
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
