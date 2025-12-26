'use client';

import { Card, CardContent, Box, Typography, alpha } from '@mui/material';
import { ReactElement } from 'react';

interface StatusCardProps {
  title: string;
  count: number;
  color: string;
  icon: ReactElement;
  index: number;
}

export default function StatusCard({ title, count, color, icon, index }: StatusCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                mb: 1.5,
                fontWeight: 500,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: '#1e293b',
              }}
            >
              {count}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.1),
              borderRadius: 2,
              p: { xs: 1.25, sm: 1.5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ml: 2,
              '& svg': {
                color: color,
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

