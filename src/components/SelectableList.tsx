import type { CSSProperties } from 'react';
import { SelectableItem, type SelectableItemData } from './SelectableItem';
import type { UINode } from '../renderer/types';

export interface SelectableListProps {
  items: SelectableItemData[];
  selectedValues: string[];
  onSelectionChange?: (selected: SelectableItemData[]) => void;
  style?: CSSProperties;
}

type SelectableListNodeProps = {
  node?: UINode;
} & Partial<SelectableListProps>;

export function SelectableList({
  node,
  items: itemsProp,
  selectedValues: selectedValuesProp,
  onSelectionChange,
  style,
}: SelectableListNodeProps) {
  const nodeProps = (node?.props ?? {}) as Partial<SelectableListProps>;

  const items = itemsProp ?? nodeProps.items ?? [];
  const selectedValues = selectedValuesProp ?? nodeProps.selectedValues ?? [];
  const resolvedOnChange = onSelectionChange ?? nodeProps.onSelectionChange;
  const resolvedStyle = style ?? node?.style;

  const toggle = (item: SelectableItemData) => {
    if (item.disabled) return;

    const next = selectedValues.includes(item.value)
      ? selectedValues.filter((v) => v !== item.value)
      : [...selectedValues, item.value];

    const selectedItems = items.filter((i) => next.includes(i.value));
    resolvedOnChange?.(selectedItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...resolvedStyle }}>
      {items.map((item) => (
        <SelectableItem
          key={item.value}
          {...item}
          checked={selectedValues.includes(item.value)}
          onClick={() => toggle(item)}
        />
      ))}
    </div>
  );
}