import type { CSSProperties } from 'react';

const INTER = "'Inter', sans-serif";
const GILROY = "'Gilroy', sans-serif";

export const typographyMap: Record<string, CSSProperties> = {
  h1: {
    fontSize: '28px',
    fontWeight: 700,
    fontFamily: GILROY,
  },
  h2: {
    fontSize: '24px',
    fontWeight: 600,
    fontFamily: INTER,
  },
  h2Large: {
    fontSize: '28px',
    fontWeight: 600,
    fontFamily: INTER,
  },
  h3: {
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: INTER,
  },
   h4: {
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: INTER,
  },
  body: {
    fontSize: '14px',
    fontWeight: 400,
    fontFamily: INTER,
  },
  bodySmall: {
    fontSize: '13px',
    fontWeight: 400,
    fontFamily: INTER,
  },
  bodyMedium: {
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: INTER,
  },
  bodySemibold: {
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: INTER,
  },
  caption: {
    fontSize: '12px',
    fontWeight: 300,
    fontFamily: INTER,
  },
  captionMedium: {
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: INTER,
  },
  label: {
    fontSize: '14px',
    fontWeight: 400,
    fontFamily: INTER,
  },
  badge: {
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: INTER,
  },
  badgeSmall: {
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: INTER,
  },
  sectionHeader: {
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: INTER,
    letterSpacing: '0.05em',
  },
  button: {
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: INTER,
  },
  icon: {
    fontSize: '48px',
  },
  emoji: {
    fontSize: '24px',
  },
  checkmark: {
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: INTER,
  },
};
