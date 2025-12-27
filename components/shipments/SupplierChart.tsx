'use client';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import { SupplierStats } from '@/types';

const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

interface SupplierChartProps {
  supplierStats: SupplierStats[];
}

export default function SupplierChart({ supplierStats }: SupplierChartProps) {
  const t = useTranslations('dashboard');

  const chartData = supplierStats.map((supplier) => ({
    name: supplier.supplierName,
    value: supplier.totalShipments,
    inTransit: supplier.inTransit,
    delayed: supplier.delayed,
    delivered: supplier.delivered,
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
            fontWeight: 600,
            color: '#1e293b',
            mb: 3,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            letterSpacing: '-0.01em',
          }}
        >
          {t('supplierDistribution') || 'Shipment Distribution by Supplier'}
        </Typography>
        {supplierStats.length > 0 ? (
          <>
            <Box sx={{ height: 400, mb: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: '#1e293b',
                  fontSize: '1rem',
                }}
              >
                {t('additionalDetails') || 'Additional Details:'}
              </Typography>
              {supplierStats.map((supplier, index) => (
                <Box
                  key={supplier.supplierName}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                    {supplier.supplierName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${supplier.totalShipments} ${supplier.totalShipments === 1 ? 'shipment' : 'shipments'}`}
                      size="small"
                      sx={{
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    {supplier.inTransit > 0 && (
                      <Chip
                        label={`${supplier.inTransit} ${t('inTransit') || 'In Transit'}`}
                        size="small"
                        sx={{
                          backgroundColor: '#3b82f615',
                          color: '#3b82f6',
                          fontWeight: 600,
                          border: '1px solid #3b82f630',
                        }}
                      />
                    )}
                    {supplier.delayed > 0 && (
                      <Chip
                        label={`${supplier.delayed} ${t('delayed') || 'Delayed'}`}
                        size="small"
                        sx={{
                          backgroundColor: '#ef444415',
                          color: '#ef4444',
                          fontWeight: 600,
                          border: '1px solid #ef444430',
                        }}
                      />
                    )}
                    {supplier.delivered > 0 && (
                      <Chip
                        label={`${supplier.delivered} ${t('delivered') || 'Delivered'}`}
                        size="small"
                        sx={{
                          backgroundColor: '#10b98115',
                          color: '#10b981',
                          fontWeight: 600,
                          border: '1px solid #10b98130',
                        }}
                      />
                    )}
                    {supplier.inCustoms > 0 && (
                      <Chip
                        label={`${supplier.inCustoms} ${t('inCustoms') || 'In Customs'}`}
                        size="small"
                        sx={{
                          backgroundColor: '#f59e0b15',
                          color: '#f59e0b',
                          fontWeight: 600,
                          border: '1px solid #f59e0b30',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              No supplier data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

