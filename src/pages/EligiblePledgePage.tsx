import { useMemo } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import eligiblePledgeJson from '../json/eligiblePledge.json';
import type { UINode } from '../renderer/types';
import { useUIState } from '../state/uiState';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export function EligiblePledgePage() {
  const { getSelections, getString } = useUIState();

  const selectedValues = getSelections('pledgeAssets');
  const itemMapRaw = getString('pledgeAssetsItemMap');

  const { eligibleTotal, loanTotal } = useMemo(() => {
    if (!itemMapRaw) return { eligibleTotal: 0, loanTotal: 0 };
    try {
      const map = JSON.parse(itemMapRaw) as Record<string, { eligibleAmount: number; loanAmount: number }>;
      let eligible = 0;
      let loan = 0;
      for (const value of selectedValues) {
        const item = map[value];
        if (item) {
          eligible += item.eligibleAmount;
          loan += item.loanAmount;
        }
      }
      return { eligibleTotal: eligible, loanTotal: loan };
    } catch {
      return { eligibleTotal: 0, loanTotal: 0 };
    }
  }, [selectedValues, itemMapRaw]);

  const scope = useMemo(
    () => ({
      eligibleTotal: fmt(eligibleTotal),
      loanTotal: fmt(loanTotal),
      isCtaDisabled: selectedValues.length === 0,
    }),
    [eligibleTotal, loanTotal, selectedValues.length],
  );

  return <DynamicRenderer node={eligiblePledgeJson as UINode} scope={scope} />;
}
