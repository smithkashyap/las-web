import { DynamicRenderer } from '../renderer/DynamicRenderer';
import portfolioJson from '../json/portfolio.json';
import type { UINode } from '../renderer/types';

export function PortfolioPage() {
  return <DynamicRenderer node={portfolioJson as UINode} />;
}
