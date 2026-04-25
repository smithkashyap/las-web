import { useMemo, useState } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import eligiblePledgeJson from '../json/eligiblePledge.json';
import type { UINode } from '../renderer/types';
import type { SelectableItemData } from '../components/SelectableItem';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function EligiblePledgePage() {

  const items = useMemo(() => {
    const findList = (node: any): any => {
      if (node.type === 'selectable-list') return node;
      if (node.children) {
        for (const child of node.children) {
          const res = findList(child);
          if (res) return res;
        }
      }
      return null;
    };

    const listNode = findList(eligiblePledgeJson);
    return listNode?.props?.items ?? [];
  }, []);


  const [totals, setTotals] = useState(() => ({
    eligibleTotal: items.reduce((s: number, i: any) => s + (i.eligibleAmount || 0), 0),
    loanTotal: items.reduce((s: number, i: any) => s + (i.loanAmount || 0), 0),
  }));


  const handleSelectionChange = (selected: SelectableItemData[]) => {
    setTotals({
      eligibleTotal: selected.reduce((s, i) => s + i.eligibleAmount, 0),
      loanTotal: selected.reduce((s, i) => s + i.loanAmount, 0),
    });
  };

  const scope = useMemo(
    () => ({
      eligibleTotal: fmt(totals.eligibleTotal),
      loanTotal: fmt(totals.loanTotal),
    }),
    [totals],
  );


  const nodeWithCallback = useMemo(() => {
    const inject = (node: UINode): UINode => {
      if (node.type === 'selectable-list') {
        return {
          ...node,
          props: {
            ...(node.props ?? {}),
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
  }, [handleSelectionChange]);

  return <DynamicRenderer node={nodeWithCallback} scope={scope} />;
}