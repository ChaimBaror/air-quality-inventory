'use client';

import { Box, Typography, Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { mockSamples, getStatusCounts, getFactoryStats, getDueSoonCount } from '@/lib/data';
import WeeklyNotificationGenerator from './WeeklyNotificationGenerator';
import StatusCardsGrid from './dashboard/StatusCardsGrid';
import FactoryChart from './dashboard/FactoryChart';

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const statusCounts = getStatusCounts(mockSamples);
  const factoryStats = getFactoryStats(mockSamples);
  const dueSoonCount = getDueSoonCount(mockSamples);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
              mb: 1,
            }}
          >
            {t('title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              maxWidth: '600px',
            }}
          >
            {t('subtitle') || 'Monitor and manage your sample inventory with real-time insights'}
          </Typography>
        </Box>
        <StatusCardsGrid statusCounts={statusCounts} dueSoonCount={dueSoonCount} />

        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
          }}
        >
          <WeeklyNotificationGenerator />
          <FactoryChart factoryStats={factoryStats} />
        </Box>
      </Container>
    </Box>
  );
}

