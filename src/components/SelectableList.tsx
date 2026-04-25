import { useEffect, useState } from 'react';
import { SelectableItem, type SelectableItemData } from './SelectableItem';
import { useUIState } from '../state/uiState';
import type { UINode } from '../renderer/types';

interface SelectableListProps {
  items: SelectableItemData[];
  defaultSelected?: string[];
  selectionKey?: string;
  onSelectionChange?: (selected: SelectableItemData[]) => void;
}

export function SelectableList({ node }: { node: UINode }) {
  const { setSelections } = useUIState();
  const props = (node.props ?? {}) as SelectableListProps;
  const items = props.items ?? [];
  const selectionKey = props.selectionKey;

  const eligibleItems = items.filter((i) => !i.disabled);
  const defaultSelected = props.defaultSelected ?? eligibleItems.map((i) => i.value);

  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));

  // Sync initial selection to uiState on mount
  useEffect(() => {
    if (selectionKey) {
      setSelections(selectionKey, defaultSelected);
    }
    // Fire initial onSelectionChange so totals are correct on mount
    const initialItems = items.filter((i) => defaultSelected.includes(i.value));
    props.onSelectionChange?.(initialItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (item: SelectableItemData) => {
    if (item.disabled) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item.value)) {
        next.delete(item.value);
      } else {
        next.add(item.value);
      }

      const nextValues = Array.from(next);
      const selectedItems = items.filter((i) => next.has(i.value));

      // Sync to uiState so Button.disabledWhenEmpty reacts
      if (selectionKey) {
        setSelections(selectionKey, nextValues);
      }

      props.onSelectionChange?.(selectedItems);

      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...node.style }}>
      {items.map((item) => (
        <SelectableItem
          key={item.value}
          {...item}
          checked={selected.has(item.value)}
          onClick={() => toggle(item)}
        />
      ))}
    </div>
  );
}
