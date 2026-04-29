import { typographyMap } from '../renderer/typography';

export interface SelectableItemData {
  value: string;
  code: string;
  codeBg: string;
  codeColor: string;
  name: string;
  subtitle: string;
  displayValue: string;
  eligibleAmount: number;
  loanAmount: number;
  disabled?: boolean;
  disabledReason?: string;
}

interface SelectableItemProps extends SelectableItemData {
  checked: boolean;
  onClick: () => void;
}

export function SelectableItem({
  code, codeBg, codeColor, name, subtitle, displayValue,
  disabled, disabledReason, checked, onClick,
}: SelectableItemProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        borderRadius: '16px',
        border: checked ? '1px solid #3b82f6' : '1px solid #1e293b',
        backgroundColor: checked ? 'rgba(59,130,246,0.08)' : '#111827',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 0.2s, background-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Checkbox */}
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: checked ? '2px solid #3b82f6' : '2px solid #374151',
            backgroundColor: checked ? '#3b82f6' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {checked && (
            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, lineHeight: 1 }}>✓</span>
          )}
        </div>

        {/* Logo */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: codeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ ...typographyMap.badgeSmall, color: codeColor }}>{code}</span>
        </div>

        {/* Text */}
        <div>
          <p style={{ ...typographyMap.bodySemibold, color: disabled ? '#94a3b8' : '#f1f5f9', margin: 0 }}>{name}</p>
          <p style={{ ...typographyMap.bodySmall, color: disabled ? '#ef4444' : '#f1f5f9', margin: '2px 0 0 0' }}>
            {disabled ? disabledReason : subtitle}
          </p>
        </div>
      </div>

      <p style={{ ...typographyMap.bodySemibold, color: disabled ? '#94a3b8' : '#f1f5f9', margin: 0 }}>
        {displayValue}
      </p>
    </div>
  );
}
