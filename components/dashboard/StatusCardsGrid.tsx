'use client';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import StatusCard from './StatusCard';

const COLORS = {
  overdue: '#ef4444',
  dueSoon: '#f59e0b',
  expectedThisWeek: '#f59e0b',
  underReview: '#3b82f6',
  completed: '#10b981',
};

interface StatusCounts {
  overdue: number;
  expectedThisWeek: number;
  underReview: number;
  completed: number;
  dueSoon?: number;
}

interface StatusCardsGridProps {
  statusCounts: StatusCounts;
  dueSoonCount?: number;
}

export default function StatusCardsGrid({ statusCounts, dueSoonCount = 0 }: StatusCardsGridProps) {
  const t = useTranslations('dashboard');

  const statusCards = [
    {
      title: t('overdue') || 'Overdue',
      count: statusCounts.overdue,
      color: COLORS.overdue,
      icon: <WarningIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('dueSoon') || 'Due Soon',
      count: dueSoonCount,
      color: COLORS.dueSoon,
      icon: <AccessTimeIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('expectedThisWeek') || 'Expected This Week',
      count: statusCounts.expectedThisWeek,
      color: COLORS.expectedThisWeek,
      icon: <ScheduleIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('underReview') || 'Under Review',
      count: statusCounts.underReview,
      color: COLORS.underReview,
      icon: <SearchIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: 'white' }} />,
    },
    {
      title: t('completed') || 'Completed',
      count: statusCounts.completed,
      color: COLORS.completed,
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
          lg: 'repeat(5, 1fr)',
        },
        gap: 3,
        mb: 5,
      }}
    >
      {statusCards.map((card, index) => (
        <StatusCard
          key={card.title}
          title={card.title}
          count={card.count}
          color={card.color}
          icon={card.icon}
          index={index}
        />
      ))}
    </Box>
  );
}

