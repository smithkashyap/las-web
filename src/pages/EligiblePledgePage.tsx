import { useCallback, useMemo, useState } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import eligiblePledgeJson from '../json/eligiblePledge.json';
import type { UINode } from '../renderer/types';
import type { SelectableItemData } from '../components/SelectableItem';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function findSelectableList(node: UINode): UINode | null {
  if (node.type === 'selectable-list') return node;
  for (const child of node.children ?? []) {
    const match = findSelectableList(child);
    if (match) return match;
  }
  return null;
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

export function EligiblePledgePage() {
  const items = useMemo(() => {
    const listNode = findSelectableList(eligiblePledgeJson as UINode);
    return ((listNode?.props as { items?: SelectableItemData[] } | undefined)?.items ?? []);
  }, []);

  const defaultSelectedItems = useMemo(
    () => items.filter((item) => !item.disabled),
    [items],
  );

  const initialTotals = useMemo(
    () => sumAmounts(defaultSelectedItems),
    [defaultSelectedItems],
  );

  const [eligibleTotal, setEligibleTotal] = useState(initialTotals.eligibleTotal);
  const [loanTotal, setLoanTotal] = useState(initialTotals.loanTotal);
  const [selectedCount, setSelectedCount] = useState(defaultSelectedItems.length);

  const handleSelectionChange = useCallback((selected: SelectableItemData[]) => {
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

  const nodeWithCallback = useMemo(() => {
    const inject = (node: UINode): UINode => {
      if (node.type === 'selectable-list') {
        return {
          ...node,
          props: {
            ...(node.props ?? {}),
            items,
            onSelectionChange: handleSelectionChange,
          },
        };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(inject),
        };
      }

      return node;
    };

    return inject(eligiblePledgeJson as UINode);
  }, [handleSelectionChange, items]);

  return <DynamicRenderer node={nodeWithCallback} scope={scope} />;
}
