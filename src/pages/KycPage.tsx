import { DynamicRenderer } from '../renderer/DynamicRenderer';
import kycJson from '../json/kyc.json';
import type { UINode } from '../renderer/types';

export function KycPage() {
  return <DynamicRenderer node={kycJson as UINode} />;
}
