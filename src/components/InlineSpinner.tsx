import React from 'react';
import { theme } from '../renderer/styles';

const InlineSpinner: React.FC = () => {
    return (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    border: `3px solid ${theme.border}`,
                    borderTop: `3px solid ${theme.primary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default InlineSpinner;