import type { CSSProperties } from 'react';
import type { BaseNode } from './types';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function getDeviceType(width: number): DeviceType {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function resolveResponsiveStyle(node: BaseNode): CSSProperties {
  if (!node.responsive) return node.style ?? {};

  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const device = getDeviceType(width);

  const baseStyle: CSSProperties = node.responsive.mobile?.style ?? {};
  const deviceStyle: CSSProperties = node.responsive[device]?.style ?? {};

  return { ...baseStyle, ...deviceStyle };
}
