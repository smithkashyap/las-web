import { useUIState } from '../state/uiState';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import type { UINode } from '../renderer/types';

interface ValueSwitchProps {
  stateKey: string;
  cases: Record<string, UINode>;
  defaultCase?: UINode;
}

export function ValueSwitch({ node }: { node: UINode }) {
  const { getString } = useUIState();
  const props = (node.props ?? {}) as ValueSwitchProps;

  const value = getString(props.stateKey);
  const child = props.cases[value] ?? props.defaultCase;

  if (!child) return null;
  return <DynamicRenderer node={child} />;
}
