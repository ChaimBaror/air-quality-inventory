'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import StatusCard from '../dashboard/StatusCard';

const COLORS = {
  pending: '#94a3b8',
  inTransit: '#3b82f6',
  inCustoms: '#f59e0b',
  delayed: '#ef4444',
  delivered: '#10b981',
  exception: '#ec4899',
  arrivingSoon: '#f59e0b',
};

interface StatusCounts {
  pending: number;
  inTransit: number;
  inCustoms: number;
  delayed: number;
  delivered: number;
  exception: number;
}

interface StatusCardsGridProps {
  statusCounts: StatusCounts;
  delayedCount?: number;
  arrivingSoonCount?: number;
}

export default function StatusCardsGrid({ statusCounts, delayedCount = 0, arrivingSoonCount = 0 }: StatusCardsGridProps) {
  const t = useTranslations('dashboard');

  const statusCards = [
    {
      title: t('delayed') || 'Delayed',
      count: delayedCount,
      color: COLORS.delayed,
      icon: <WarningIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('arrivingSoon') || 'Arriving Soon',
      count: arrivingSoonCount,
      color: COLORS.arrivingSoon,
      icon: <AccessTimeIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('inTransit') || 'In Transit',
      count: statusCounts.inTransit,
      color: COLORS.inTransit,
      icon: <ShippingIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('inCustoms') || 'In Customs',
      count: statusCounts.inCustoms,
      color: COLORS.inCustoms,
      icon: <ScheduleIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('pending') || 'Pending',
      count: statusCounts.pending,
      color: COLORS.pending,
      icon: <ScheduleIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('delivered') || 'Delivered',
      count: statusCounts.delivered,
      color: COLORS.delivered,
      icon: <CheckCircleIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
        gap: 3,
        mb: 5,
      }}
    >
      {statusCards.map((card) => (
        <StatusCard
          key={card.title}
          title={card.title}
          count={card.count}
          color={card.color}
          icon={card.icon}
        />
      ))}
    </Box>
  );
}

