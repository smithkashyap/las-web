import { useUIState } from '../state/uiState';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import type { UINode } from '../renderer/types';

export function StateSwitch({ node }: { node: UINode }) {
  const { getBoolean } = useUIState();
  const props = (node.props ?? {}) as {
    stateKey: string;
    whenTrue: UINode;
    whenFalse: UINode;
  };

  const value = getBoolean(props.stateKey);
  const child = value ? props.whenTrue : props.whenFalse;

  return <DynamicRenderer node={child} />;
}
