'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';

const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

const COLORS = {
  overdue: '#ef4444',
  expectedThisWeek: '#f59e0b',
  underReview: '#3b82f6',
  completed: '#10b981',
};

interface FactoryStat {
  factoryName: string;
  totalSamples: number;
  overdue: number;
  expectedThisWeek: number;
}

interface FactoryChartProps {
  factoryStats: FactoryStat[];
}

export default function FactoryChart({ factoryStats }: FactoryChartProps) {
  const t = useTranslations('dashboard');

  const chartData = factoryStats.map((factory) => ({
    name: factory.factoryName,
    value: factory.totalSamples,
    overdue: factory.overdue,
  }));

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            color: '#1e293b',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            letterSpacing: '-0.01em',
          }}
        >
          {t('factoryDistribution')}
        </Typography>
        <Box sx={{ width: '100%', height: { xs: 300, sm: 400 } }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={chartData.length > 3 ? 100 : 120}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: '#f8fafc',
            borderRadius: 2,
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '1.125rem',
            }}
          >
            {t('additionalDetails')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {factoryStats.map((factory) => (
              <Box
                key={factory.factoryName}
                sx={{
                  p: 2.5,
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    color: '#1e293b',
                    fontSize: '1rem',
                  }}
                >
                  {factory.factoryName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${factory.totalSamples} ${factory.totalSamples === 1 ? 'sample' : 'samples'}`}
                    size="small"
                    sx={{
                      backgroundColor: '#e0e7ff',
                      color: '#6366f1',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: '28px',
                    }}
                  />
                  {factory.overdue > 0 && (
                    <Chip
                      label={`${factory.overdue} ${t('overdue')}`}
                      size="small"
                      sx={{
                        backgroundColor: `${COLORS.overdue}15`,
                        color: COLORS.overdue,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '28px',
                        border: `1px solid ${COLORS.overdue}30`,
                      }}
                    />
                  )}
                  {factory.expectedThisWeek > 0 && (
                    <Chip
                      label={`${factory.expectedThisWeek} ${t('expectedThisWeek')}`}
                      size="small"
                      sx={{
                        backgroundColor: `${COLORS.expectedThisWeek}15`,
                        color: COLORS.expectedThisWeek,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: '28px',
                        border: `1px solid ${COLORS.expectedThisWeek}30`,
                      }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

