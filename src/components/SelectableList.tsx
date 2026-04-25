import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { SelectableItem, type SelectableItemData } from './SelectableItem';
import type { UINode } from '../renderer/types';

export interface SelectableListProps {
  items: SelectableItemData[];
  onSelectionChange?: (selected: SelectableItemData[]) => void;
  style?: CSSProperties;
}

type SelectableListNodeProps = {
  node?: UINode;
} & Partial<SelectableListProps>;

export function SelectableList({ node, items: itemsProp, onSelectionChange, style }: SelectableListNodeProps) {
  const nodeProps = (node?.props ?? {}) as Partial<SelectableListProps>;
  const items = itemsProp ?? nodeProps.items ?? [];
  const resolvedStyle = style ?? node?.style;

  const defaultSelected = useMemo(
    () => items.filter((item) => !item.disabled).map((item) => item.value),
    [items],
  );

  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));

  useEffect(() => {
    const nextSelected = new Set(defaultSelected);
    setSelected(nextSelected);
    onSelectionChange?.(items.filter((item) => nextSelected.has(item.value)));
  }, [defaultSelected, items, onSelectionChange]);

  const toggle = (item: SelectableItemData) => {
    if (item.disabled) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item.value)) {
        next.delete(item.value);
      } else {
        next.add(item.value);
      }

      const selectedItems = items.filter((i) => next.has(i.value));
      onSelectionChange?.(selectedItems);

      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...resolvedStyle }}>
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
