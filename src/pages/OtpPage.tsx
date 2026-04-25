import { DynamicRenderer } from '../renderer/DynamicRenderer';
import otpJson from '../json/otp.json';
import type { UINode } from '../renderer/types';

export function OtpPage() {
  return <DynamicRenderer node={otpJson as UINode} />;
}
