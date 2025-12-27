'use client';

import { Box, Skeleton, Stack } from '@mui/material';

/**
 * Loading Skeleton Components
 * Display skeleton screens while loading data
 */

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={60}
          animation="wave"
          sx={{ borderRadius: 1 }}
        />
      ))}
    </Stack>
  );
}

export function CardSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
      <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 1 }} />
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box>
      {/* Status Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={120}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
      
      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Skeleton variant="rectangular" height={300} animation="wave" sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={300} animation="wave" sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
}

export function DetailSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
      
      <Stack spacing={2}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="70%" height={24} />
          </Box>
        ))}
      </Stack>
      
      <Skeleton variant="rectangular" height={200} sx={{ mt: 3, borderRadius: 1 }} />
    </Box>
  );
}

