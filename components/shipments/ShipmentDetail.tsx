'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  Grid,
  Link,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Shipment } from '@/types';
import { formatDate, getStatusColor, getStatusLabel, getTrackingUrl } from '@/lib/shipmentUtils';
import WhatsAppButton from './WhatsAppButton';

interface ShipmentDetailProps {
  shipment: Shipment;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export default function ShipmentDetail({ shipment, open, onClose, onEdit }: ShipmentDetailProps) {
  const t = useTranslations('shipmentDetail');

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 600, md: 700 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          boxShadow: '-8px 0 48px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          height: '100%',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            pb: 3,
            borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            {t('title') || 'Shipment Details'}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              '&:hover': {
                backgroundColor: '#ef4444',
                color: 'white',
                transform: 'rotate(90deg) scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Shipment Info */}
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 16px 48px rgba(99, 102, 241, 0.15)',
            },
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {shipment.tracking_number}
                </Typography>
                <Chip
                  label={getStatusLabel(shipment.status)}
                  sx={{
                    backgroundColor: getStatusColor(shipment.status),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: '32px',
                  }}
                />
              </Box>
              <Link
                href={getTrackingUrl(shipment)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#6366f1',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Track on {shipment.carrier} →
              </Link>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('poNumber') || 'PO Number'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {shipment.po_number}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('carrier') || 'Carrier'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {shipment.carrier}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" color="text.secondary">
                {t('supplier') || 'Supplier'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {shipment.supplier}
              </Typography>
              {shipment.supplier_phone && (
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                  {shipment.supplier_phone}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('origin') || 'Origin'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {shipment.origin_city}, {shipment.origin_country}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('destination') || 'Destination'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {shipment.destination_city}, {shipment.destination_state}, {shipment.destination_country}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('shipDate') || 'Ship Date'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {formatDate(shipment.ship_date)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('expectedDelivery') || 'Expected Delivery'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {formatDate(shipment.expected_delivery_date)}
              </Typography>
            </Grid>

            {shipment.actual_delivery_date && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('actualDelivery') || 'Actual Delivery'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, color: '#10b981', fontWeight: 600 }}>
                  {formatDate(shipment.actual_delivery_date)}
                </Typography>
              </Grid>
            )}

            {shipment.weight && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('weight') || 'Weight'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {shipment.weight}
                </Typography>
              </Grid>
            )}

            {shipment.value && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('value') || 'Value'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                  ${shipment.value.toLocaleString()}
                </Typography>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t('owner') || 'Owner'}
              </Typography>
              <Chip
                label={shipment.owner}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                }}
              />
            </Grid>

            {shipment.notes && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('notes') || 'Notes'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  {shipment.notes}
                </Typography>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <WhatsAppButton shipment={shipment} variant="button" size="medium" />
                {onEdit && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={onEdit}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      '&:hover': {
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      },
                    }}
                  >
                    Edit Shipment
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* History */}
        {shipment.history && shipment.history.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              {t('history') || 'History'}
            </Typography>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(226, 232, 240, 0.6)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2 }}>
                {shipment.history.map((entry) => (
                  <Box
                    key={entry.id}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #e2e8f0',
                      '&:last-child': { mb: 0, pb: 0, borderBottom: 'none' },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {entry.action}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {formatDate(entry.timestamp)} {entry.user ? `- ${entry.user}` : ''}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

