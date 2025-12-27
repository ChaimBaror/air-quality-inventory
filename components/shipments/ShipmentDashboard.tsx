'use client';

import { Box, Typography, Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { mockShipments, getStatusCounts, getDelayedCount, getArrivingSoonCount, getSupplierStats } from '@/lib/shipmentData';
import StatusCardsGrid from './StatusCardsGrid';
import SupplierChart from './SupplierChart';
import DelayedShipmentsNotifications from './DelayedShipmentsNotifications';

export default function ShipmentDashboard() {
  const t = useTranslations('dashboard');
  const statusCounts = getStatusCounts(mockShipments);
  const delayedCount = getDelayedCount(mockShipments);
  const arrivingSoonCount = getArrivingSoonCount(mockShipments);
  const supplierStats = getSupplierStats(mockShipments);

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
            {t('title') || 'Shipment Dashboard'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.9375rem', sm: '1rem' },
              maxWidth: '600px',
            }}
          >
            {t('subtitle') || 'Monitor and track shipments from China to USA'}
          </Typography>
        </Box>
        <StatusCardsGrid 
          statusCounts={statusCounts} 
          delayedCount={delayedCount}
          arrivingSoonCount={arrivingSoonCount}
        />

        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
          }}
        >
          <DelayedShipmentsNotifications />
          <SupplierChart supplierStats={supplierStats} />
        </Box>
      </Container>
    </Box>
  );
}

