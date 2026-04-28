import type { CSSProperties } from 'react';
import type { BaseNode, SizeVariant } from './types';

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

// Size variant configurations for different components
export interface SizeConfig {
  padding?: string;
  fontSize?: string;
  height?: string;
  width?: string;
  minWidth?: string;
  borderRadius?: string;
  iconSize?: number;
  gap?: string;
}

export const sizeConfigs: Record<SizeVariant, Record<string, SizeConfig>> = {
  sm: {
    button: { padding: '8px 12px', fontSize: '12px', borderRadius: '6px', iconSize: 14 },
    input: { padding: '8px 10px', fontSize: '12px', borderRadius: '8px' },
    text: { fontSize: '12px' },
    container: { padding: '8px', gap: '4px' },
    checkbox: { padding: '6px', fontSize: '12px' },
  },
  md: {
    button: { padding: '12px 20px', fontSize: '14px', borderRadius: '10px', iconSize: 18 },
    input: { padding: '12px 14px', fontSize: '14px', borderRadius: '10px' },
    text: { fontSize: '14px' },
    container: { padding: '12px', gap: '8px' },
    checkbox: { padding: '10px', fontSize: '14px' },
  },
  lg: {
    button: { padding: '16px 28px', fontSize: '16px', borderRadius: '12px', iconSize: 22 },
    input: { padding: '16px 18px', fontSize: '16px', borderRadius: '12px' },
    text: { fontSize: '16px' },
    container: { padding: '16px', gap: '12px' },
    checkbox: { padding: '14px', fontSize: '16px' },
  },
  full: {
    button: { padding: '16px', fontSize: '16px', borderRadius: '16px', width: '100%' },
    input: { padding: '14px 16px', fontSize: '14px', borderRadius: '12px', width: '100%' },
    text: { fontSize: '18px' },
    container: { padding: '16px', gap: '12px', width: '100%' },
    checkbox: { padding: '16px', fontSize: '16px' },
  },
};

export function getSizeStyle(
  node: BaseNode,
  componentType: string
): CSSProperties {
  const size = (node.props?.size as SizeVariant) ?? 'md';
  const config = sizeConfigs[size]?.[componentType];

  if (!config) return {};

  const style: CSSProperties = {};
  if (config.padding) style.padding = config.padding;
  if (config.fontSize) style.fontSize = config.fontSize;
  if (config.height) style.height = config.height;
  if (config.width) style.width = config.width;
  if (config.minWidth) style.minWidth = config.minWidth;
  if (config.borderRadius) style.borderRadius = config.borderRadius;
  if (config.gap) style.gap = config.gap;

  return style;
}
