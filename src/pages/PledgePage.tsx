import { DynamicRenderer } from '../renderer/DynamicRenderer';
import pledgeJson from '../json/pledge.json';
import type { UINode } from '../renderer/types';

export function PledgePage() {
  return <DynamicRenderer node={pledgeJson as UINode} />;
}
