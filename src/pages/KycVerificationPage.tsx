import { DynamicRenderer } from '../renderer/DynamicRenderer';
import kycVerificationJson from '../json/kycVerification.json';
import type { UINode } from '../renderer/types';

export function KycVerificationPage() {
  return <DynamicRenderer node={kycVerificationJson as UINode} />;
}
