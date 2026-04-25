import { DynamicRenderer } from '../renderer/DynamicRenderer';
import connectJson from '../json/connectPortfolio.json';
import type { UINode } from '../renderer/types';

export function ConnectPortfolioPage() {
  return <DynamicRenderer node={connectJson as UINode} />;
}
