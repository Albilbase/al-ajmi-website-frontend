'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const CELL_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: '120px',
  maxWidth: '280px',
};

const TEXT_STYLE = {
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '#64748b',
  fontSize: '0.9rem',
};

const COPY_BTN_STYLE = {
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  background: 'white',
  color: '#64748b',
  cursor: 'pointer',
  transition: 'all 0.15s',
};

export default function CopyableCell({
  value,
  dir = 'auto',
  minWidth,
  maxWidth,
  monospace = false,
}) {
  const [copied, setCopied] = useState(false);
  const text = value === null || value === undefined ? '' : String(value).trim();

  if (!text || text === '-') {
    return <span style={{ color: '#94a3b8' }}>-</span>;
  }

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const cellStyle = {
    ...CELL_STYLE,
    ...(minWidth ? { minWidth } : {}),
    ...(maxWidth ? { maxWidth } : {}),
  };

  const textStyle = {
    ...TEXT_STYLE,
    direction: dir,
    textAlign: dir === 'ltr' ? 'left' : 'inherit',
    ...(monospace ? { fontFamily: 'monospace' } : {}),
  };

  return (
    <div style={cellStyle} title={text}>
      <span style={textStyle}>{text}</span>
      <button
        type="button"
        onClick={handleCopy}
        style={COPY_BTN_STYLE}
        title="Copy"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#DC143C';
          e.currentTarget.style.color = '#DC143C';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.color = copied ? '#16a34a' : '#64748b';
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export const TABLE_HEADER_STYLE = {
  padding: '1rem',
  color: '#1e293b',
  fontWeight: '600',
  position: 'sticky',
  top: 0,
  background: '#f8fafc',
  zIndex: 1,
  borderBottom: '2px solid #e2e8f0',
};

export const EMAIL_COLUMN_HEADER_STYLE = {
  ...TABLE_HEADER_STYLE,
  minWidth: '280px',
};

export const TABLE_CELL_STYLE = {
  padding: '1rem',
  verticalAlign: 'middle',
};
