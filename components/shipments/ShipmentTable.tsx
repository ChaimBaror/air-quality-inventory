'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Typography,
  Link,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Shipment } from '@/types';
import { formatDate, getStatusColor, getStatusLabel, isDelayed, isArrivingSoon, getTrackingUrl } from '@/lib/shipmentUtils';
import WhatsAppButton from './WhatsAppButton';

interface ShipmentTableProps {
  shipments: Shipment[];
  onView: (shipment: Shipment) => void;
  onEdit?: (shipment: Shipment) => void;
  selectedShipments?: Set<string>;
  onSelectShipment?: (shipmentId: string, checked: boolean) => void;
}

export default function ShipmentTable({ 
  shipments, 
  onView, 
  onEdit,
  selectedShipments = new Set(),
  onSelectShipment,
}: ShipmentTableProps) {
  const t = useTranslations('shipments');

  const getRowColor = (shipment: Shipment) => {
    if (isDelayed(shipment)) return '#fee2e2';
    if (isArrivingSoon(shipment)) return '#fef3c7';
    return 'transparent';
  };


  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#f8fafc',
              '& .MuiTableCell-head': {
                fontWeight: 600,
                color: '#475569',
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #e2e8f0',
                py: 2,
                whiteSpace: 'nowrap',
              },
            }}
          >
            {onSelectShipment && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedShipments.size > 0 && selectedShipments.size < shipments.length}
                  checked={selectedShipments.size === shipments.length && shipments.length > 0}
                  onChange={(e) => {
                    shipments.forEach(s => onSelectShipment(s.id, e.target.checked));
                  }}
                />
              </TableCell>
            )}
            <TableCell>{t('columns.trackingNumber') || 'Tracking #'}</TableCell>
            <TableCell>{t('columns.carrier') || 'Carrier'}</TableCell>
            <TableCell>{t('columns.poNumber') || 'PO #'}</TableCell>
            <TableCell>{t('columns.supplier') || 'Supplier'}</TableCell>
            <TableCell>{t('columns.origin') || 'Origin'}</TableCell>
            <TableCell>{t('columns.destination') || 'Destination'}</TableCell>
            <TableCell>{t('columns.status') || 'Status'}</TableCell>
            <TableCell>{t('columns.expectedDelivery') || 'Expected Delivery'}</TableCell>
            <TableCell>{t('columns.owner') || 'Owner'}</TableCell>
            <TableCell align="center">{t('columns.actions') || 'Actions'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map((shipment, index) => (
            <TableRow
              key={shipment.id}
              sx={{
                backgroundColor: getRowColor(shipment),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                borderLeft: '4px solid transparent',
                borderLeftColor: isDelayed(shipment) ? '#ef4444' : isArrivingSoon(shipment) ? '#f59e0b' : 'transparent',
                animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
                '@keyframes fadeIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(10px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  '& .MuiTableCell-root': {
                    color: '#1e293b',
                  },
                },
                '& .MuiTableCell-root': {
                  color: '#475569',
                  borderColor: '#e2e8f0',
                  transition: 'color 0.2s ease',
                  py: 2,
                },
              }}
              onClick={() => onView(shipment)}
            >
              {onSelectShipment && (
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedShipments.has(shipment.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectShipment(shipment.id, e.target.checked);
                    }}
                  />
                </TableCell>
              )}
              <TableCell>
                <Link
                  href={getTrackingUrl(shipment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    color: '#6366f1',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {shipment.tracking_number}
                </Link>
              </TableCell>
              <TableCell>
                <Chip
                  label={shipment.carrier}
                  size="small"
                  sx={{
                    backgroundColor: '#e0e7ff',
                    color: '#6366f1',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>{shipment.po_number}</TableCell>
              <TableCell>{shipment.supplier}</TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {shipment.origin_city}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {shipment.origin_country}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {shipment.destination_city}, {shipment.destination_state}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {shipment.destination_country}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(shipment.status)}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(shipment.status),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>
                {formatDate(shipment.expected_delivery_date)}
                {isDelayed(shipment) && (
                  <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', mt: 0.5 }}>
                    Delayed
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={shipment.owner}
                  size="small"
                  sx={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <WhatsAppButton shipment={shipment} />
                  {onEdit && (
                    <Tooltip title={t('edit') || 'Edit'} arrow placement="top">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(shipment);
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            transform: 'scale(1.15)',
                          },
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t('viewDetails') || 'View Details'} arrow placement="top">
                    <IconButton
                      size="small"
                      color="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(shipment);
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'scale(1.15)',
                          color: 'primary.main',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

