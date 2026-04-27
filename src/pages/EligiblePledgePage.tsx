import { useCallback, useMemo, useState } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import eligiblePledgeJson from '../json/eligiblePledge.json';
import type { UINode } from '../renderer/types';
import type { SelectableItemData } from '../components/SelectableItem';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function sumAmounts(items: SelectableItemData[]) {
  return items.reduce(
    (totals, item) => ({
      eligibleTotal: totals.eligibleTotal + (item.eligibleAmount ?? 0),
      loanTotal: totals.loanTotal + (item.loanAmount ?? 0),
    }),
    { eligibleTotal: 0, loanTotal: 0 },
  );
}

function findSelectableListItems(node: UINode): SelectableItemData[] {
  if (node.type === 'selectable-list') {
    return ((node.props as { items?: SelectableItemData[] } | undefined)?.items ?? []);
  }
  for (const child of node.children ?? []) {
    const found = findSelectableListItems(child);
    if (found.length) return found;
  }
  return [];
}

function injectProps(
  node: UINode,
  items: SelectableItemData[],
  selectedValues: string[],
  cb: (selected: SelectableItemData[]) => void,
): UINode {
  if (node.type === 'selectable-list') {
    return { ...node, props: { ...(node.props ?? {}), items, selectedValues, onSelectionChange: cb } };
  }
  if (node.children) {
    return { ...node, children: node.children.map((child) => injectProps(child, items, selectedValues, cb)) };
  }
  return node;
}

export function EligiblePledgePage() {
  const items = useMemo(() => findSelectableListItems(eligiblePledgeJson as UINode), []);

  const defaultSelected = useMemo(() => items.filter((i) => !i.disabled), [items]);
  const defaultTotals = useMemo(() => sumAmounts(defaultSelected), [defaultSelected]);

  const [selectedValues, setSelectedValues] = useState<string[]>(
    () => defaultSelected.map((i) => i.value),
  );
  const [eligibleTotal, setEligibleTotal] = useState(defaultTotals.eligibleTotal);
  const [loanTotal, setLoanTotal] = useState(defaultTotals.loanTotal);
  const [selectedCount, setSelectedCount] = useState(defaultSelected.length);

  const handleSelectionChange = useCallback((selected: SelectableItemData[]) => {
    setSelectedValues(selected.map((i) => i.value));
    const totals = sumAmounts(selected);
    setEligibleTotal(totals.eligibleTotal);
    setLoanTotal(totals.loanTotal);
    setSelectedCount(selected.length);
  }, []);

  const scope = useMemo(
    () => ({
      eligibleTotal: fmt(eligibleTotal),
      loanTotal: fmt(loanTotal),
      isCtaDisabled: selectedCount === 0,
    }),
    [eligibleTotal, loanTotal, selectedCount],
  );

  const nodeWithProps = useMemo(
    () => injectProps(eligiblePledgeJson as UINode, items, selectedValues, handleSelectionChange),
    [items, selectedValues, handleSelectionChange],
  );

  return <DynamicRenderer node={nodeWithProps} scope={scope} />;
}
