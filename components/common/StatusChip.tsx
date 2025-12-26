'use client';

import { Chip, alpha } from '@mui/material';
import { SampleStatus } from '@/types';

const STATUS_COLORS: Record<SampleStatus, string> = {
  overdue: '#ef4444',
  expected_this_week: '#f59e0b',
  under_review: '#3b82f6',
  completed: '#10b981',
};

interface StatusChipProps {
  status: SampleStatus;
  label: string;
  size?: 'small' | 'medium';
}

export default function StatusChip({ status, label, size = 'small' }: StatusChipProps) {
  const color = STATUS_COLORS[status];
  
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: color,
        color: 'white',
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        height: size === 'small' ? '28px' : '32px',
        borderRadius: 2,
        boxShadow: `0 2px 8px ${alpha(color, 0.3)}`,
        border: `1px solid ${alpha(color, 0.5)}`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: `0 4px 12px ${alpha(color, 0.4)}`,
          backgroundColor: color,
        },
      }}
    />
  );
}

