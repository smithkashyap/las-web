import type { CSSProperties } from 'react';
import type { SizeVariant } from './types';

// ── Dark theme tokens ──
export const theme = {
  // Backgrounds
  background: '#121212',
  surface: '#161616',
  surface2: '#232323',

  // Borders
  border: '#3A4048',

  // Text
  textPrimary: '#FBFBFB',
  textSecondary: '#878787',
  muted: '#6D6D6D',

  // Brand
  primary: '#00A9EB',
  primary2: '#2596FF',

  // Semantic
  success: '#28A745',
  danger: '#B93333',
  warning: '#FDBE17',

  // Neutral
  white: '#FFFFFF',
  transparent: 'transparent',

  // Alpha overlays (rgba → hex-alpha)
  primaryAlpha5: '#00A9EB0D',   // primary 5%
  primaryAlpha10: '#00A9EB1A',  // primary 10%
  primaryAlpha15: '#00A9EB26',  // primary 15%
  primaryAlpha3: '#00A9EB08',   // primary 3%
  successAlpha15: '#28A74526',  // success 15%
  dangerAlpha15: '#B9333326',   // danger 15%
  warningAlpha15: '#FDBE1726',  // warning 15%
} as const;

export type ThemeColor = keyof typeof theme;

// ── Variant styles ──
type VariantStyleMap = Record<string, CSSProperties>;

const buttonVariants: VariantStyleMap = {
  primary: {
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary2})`,
    color: theme.white,
    border: 'none',
    borderRadius: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondary: {
    backgroundColor: theme.surface2,
    color: theme.textPrimary,
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  ghost: {
    backgroundColor: theme.transparent,
    color: theme.textSecondary,
    border: 'none',
    cursor: 'pointer',
  },
  icon: {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '0',
  },
  info: {
    backgroundColor: theme.primaryAlpha5,
    border: `1px solid ${theme.primary}`,
    borderRadius: '12px',
    color: theme.primary,
    cursor: 'default',
  },
  success: {
    backgroundColor: theme.successAlpha15,
    border: `1px solid ${theme.success}`,
    borderRadius: '12px',
    color: theme.success,
    cursor: 'default',
  },
  danger: {
    backgroundColor: theme.dangerAlpha15,
    border: `1px solid ${theme.danger}`,
    borderRadius: '12px',
    color: theme.danger,
    cursor: 'default',
  },
  warning: {
    backgroundColor: theme.warningAlpha15,
    border: `1px solid ${theme.warning}`,
    borderRadius: '12px',
    color: theme.warning,
    cursor: 'default',
  },
  muted: {
    backgroundColor: theme.transparent,
    color: theme.muted,
    border: 'none',
    cursor: 'default',
  },
};

const inputVariants: VariantStyleMap = {
  primary: {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: theme.background,
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    color: theme.textPrimary,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  surface: {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    color: theme.textPrimary,
    outline: 'none',
  },
};

const containerVariants: VariantStyleMap = {
  card: {
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '100vh',
    backgroundColor: theme.background,
  },
  surface: {
    backgroundColor: theme.surface,
    borderRadius: '12px',
    padding: '16px',
  },
  surface2: {
    backgroundColor: theme.surface2,
    borderRadius: '12px',
    padding: '16px',
  },
  info: {
    borderRadius: '12px',
    border: `1px solid ${theme.primary}`,
    backgroundColor: theme.primaryAlpha5,
    padding: '12px 16px',
    textAlign: 'center',
  },
  success: {
    backgroundColor: theme.successAlpha15,
    padding: '4px 10px',
    borderRadius: '8px',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const textVariants: VariantStyleMap = {
  h1: {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.textPrimary,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '24px',
    fontWeight: 600,
    color: theme.textPrimary,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    color: theme.textPrimary,
    lineHeight: 1.4,
  },
  body: {
    fontSize: '14px',
    fontWeight: 400,
    color: theme.textPrimary,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '14px',
    fontWeight: 400,
    color: theme.textSecondary,
    lineHeight: 1.5,
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    color: theme.textSecondary,
    lineHeight: 1.4,
  },
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  link: {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.primary,
    cursor: 'pointer',
    textDecoration: 'none',
  },
};

const checkboxVariants: VariantStyleMap = {
  primary: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
};

const spinnerVariants: VariantStyleMap = {
  primary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: theme.background,
  },
};

const imageVariants: VariantStyleMap = {
  primary: {
    maxWidth: '100%',
    height: 'auto',
  },
  avatar: {
    borderRadius: '50%',
    objectFit: 'cover',
  },
};

// ── Size styles ──
const buttonSizes: VariantStyleMap = {
  sm: { padding: '8px 12px', fontSize: '12px', borderRadius: '8px' },
  md: { padding: '12px 20px', fontSize: '14px', borderRadius: '12px' },
  lg: { padding: '16px', fontSize: '16px', borderRadius: '16px', width: '100%' },
  full: { padding: '16px', fontSize: '16px', borderRadius: '16px', width: '100%' },
};

const inputSizes: VariantStyleMap = {
  sm: { padding: '8px 10px', fontSize: '12px', borderRadius: '8px' },
  md: { padding: '12px 14px', fontSize: '14px', borderRadius: '10px' },
  lg: { padding: '16px 18px', fontSize: '16px', borderRadius: '12px' },
  full: { padding: '14px 16px', fontSize: '14px', borderRadius: '12px', width: '100%' },
};

const containerSizes: VariantStyleMap = {
  sm: { padding: '8px', gap: '4px' },
  md: { padding: '12px', gap: '8px' },
  lg: { padding: '16px', gap: '12px' },
  full: { padding: '16px', gap: '12px', width: '100%', height: '100%' },
};

const textSizes: VariantStyleMap = {
  sm: { fontSize: '12px' },
  md: { fontSize: '14px' },
  lg: { fontSize: '16px' },
  full: { fontSize: '18px' },
};

const checkboxSizes: VariantStyleMap = {
  sm: { padding: '6px', fontSize: '12px' },
  md: { padding: '10px', fontSize: '14px' },
  lg: { padding: '14px', fontSize: '16px' },
  full: { padding: '16px', fontSize: '16px' },
};

// ── Registries ──
const variantStyles: Record<string, VariantStyleMap> = {
  button: buttonVariants,
  input: inputVariants,
  container: containerVariants,
  text: textVariants,
  checkbox: checkboxVariants,
  spinner: spinnerVariants,
  image: imageVariants,
};

const sizeStyles: Record<string, VariantStyleMap> = {
  button: buttonSizes,
  input: inputSizes,
  container: containerSizes,
  text: textSizes,
  checkbox: checkboxSizes,
};

// ── Public API ──

export function getVariantStyle(type: string, variant: string): CSSProperties {
  return variantStyles[type]?.[variant] ?? {};
}

export function getSizeStyleFn(type: string, size: string): CSSProperties {
  return sizeStyles[type]?.[size] ?? {};
}

/**
 * Resolve all styles for a node.
 * Merge order: base → variant → size → node.style (or responsive override)
 */
export function resolveNodeStyle(
  node: { type?: string; props?: Record<string, unknown>; style?: CSSProperties; responsive?: { mobile?: { style?: CSSProperties }; tablet?: { style?: CSSProperties }; desktop?: { style?: CSSProperties } } },
  componentType: string,
  baseStyle: CSSProperties = {}
): CSSProperties {
  const variant = node.props?.variant as string | undefined;
  const size = node.props?.size as SizeVariant | undefined;

  const variantStyle = variant ? getVariantStyle(componentType, variant) : {};
  const sizeStyle = size ? getSizeStyleFn(componentType, size) : {};

  let overrideStyle: CSSProperties = node.style ?? {};
  if (node.responsive) {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    const mobileStyle = node.responsive.mobile?.style ?? {};
    const deviceStyle = node.responsive[device]?.style ?? {};
    overrideStyle = { ...mobileStyle, ...deviceStyle };
  }

  return { ...baseStyle, ...variantStyle, ...sizeStyle, ...overrideStyle };
}

/** Map colorVariant prop to a theme color */
export function getTextColor(colorVariant?: string): string {
  switch (colorVariant) {
    case 'primary': return theme.textPrimary;
    case 'secondary': return theme.textSecondary;
    case 'muted': return theme.muted;
    case 'info': return theme.primary;
    case 'success': return theme.success;
    case 'danger': return theme.danger;
    case 'warning': return theme.warning;
    default: return theme.textPrimary;
  }
}
