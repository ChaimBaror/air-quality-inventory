'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Order, EmailHistoryEntry } from '@/types';
import { formatDate, getOrderStatusColor, getOrderStatusLabel, formatCurrency, formatDateTime } from '@/lib/orderUtils';
import SendOrderEmailDialog from './SendOrderEmailDialog';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onEdit?: (order: Order) => void;
}

export default function OrderDetail({ order, onClose, onEdit }: OrderDetailProps) {
  const t = useTranslations('orderDetail');
  const tOrders = useTranslations('orders');
  const [emailDialog, setEmailDialog] = useState(false);
  const [orderWithHistory, setOrderWithHistory] = useState<Order>(order);

  const handleEmailSent = (emailHistory: EmailHistoryEntry) => {
    // Add email to history
    setOrderWithHistory({
      ...orderWithHistory,
      email_history: [
        ...(orderWithHistory.email_history || []),
        emailHistory,
      ],
    });
  };

  return (
    <Drawer
      anchor="right"
      open={true}
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
            {t('title') || 'Order Details'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {orderWithHistory.supplier_email && (
              <IconButton
                onClick={() => setEmailDialog(true)}
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  '&:hover': {
                    backgroundColor: '#10b981',
                    color: 'white',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                title={tOrders('sendEmail') || 'Send Email'}
              >
                <EmailIcon />
              </IconButton>
            )}
            {onEdit && (
              <IconButton
                onClick={() => onEdit(orderWithHistory)}
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                  '&:hover': {
                    backgroundColor: '#6366f1',
                    color: 'white',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <EditIcon />
              </IconButton>
            )}
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
        </Box>

        {/* Order Info */}
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {orderWithHistory.po_number}
                </Typography>
                <Chip
                  label={getOrderStatusLabel(orderWithHistory.status)}
                  color={getOrderStatusColor(orderWithHistory.status)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: '32px',
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('customerPo') || 'Customer PO'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {orderWithHistory.customer_po || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('supplier') || 'Supplier'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {orderWithHistory.supplier}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('orderDate') || 'Order Date'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {formatDate(orderWithHistory.order_date)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('expectedCompletion') || 'Expected Completion'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {formatDate(orderWithHistory.expected_completion_date)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('expectedShipDate') || 'Expected Ship Date'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {formatDate(orderWithHistory.expected_ship_date)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('actualShipDate') || 'Actual Ship Date'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {formatDate(orderWithHistory.actual_ship_date)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('totalValue') || 'Total Value'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5, color: '#10b981' }}>
                {formatCurrency(orderWithHistory.total_value, orderWithHistory.currency)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                {t('owner') || 'Owner'}
              </Typography>
              <Chip
                label={orderWithHistory.owner}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 600,
                }}
              />
            </Grid>

            {orderWithHistory.shipping_address && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  {t('shippingAddress') || 'Shipping Address'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {orderWithHistory.shipping_address.address || ''}
                  {orderWithHistory.shipping_address.city}, {orderWithHistory.shipping_address.state}
                  {orderWithHistory.shipping_address.country}
                </Typography>
              </Grid>
            )}

            {orderWithHistory.notes && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  {t('notes') || 'Notes'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {orderWithHistory.notes}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Order Items */}
        {orderWithHistory.items && orderWithHistory.items.length > 0 && (
          <Card
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              {t('items') || 'Order Items'} ({orderWithHistory.items.length})
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>{t('sku') || 'SKU'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t('description') || 'Description'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{t('quantity') || 'Quantity'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{t('unitPrice') || 'Unit Price'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{t('total') || 'Total'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderWithHistory.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.sku || 'N/A'}</TableCell>
                      <TableCell>
                        {item.description}
                        {item.style && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>
                            {t('style') || 'Style'}: {item.style} {item.color && `| ${t('color') || 'Color'}: ${item.color}`} {item.size && `| ${t('size') || 'Size'}: ${item.size}`}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unit_price, orderWithHistory.currency)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(item.total_price, orderWithHistory.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell colSpan={4} sx={{ fontWeight: 700, textAlign: 'right' }}>
                      {t('total') || 'Total'}:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {formatCurrency(orderWithHistory.total_value, orderWithHistory.currency)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* History */}
        {orderWithHistory.history && orderWithHistory.history.length > 0 && (
          <Card
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              {t('history') || 'History'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orderWithHistory.history.map((entry) => (
                <Box
                  key={entry.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    borderLeft: '3px solid #6366f1',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {entry.action}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {formatDate(entry.timestamp)} {entry.user && `by ${entry.user}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Email History */}
        {orderWithHistory.email_history && orderWithHistory.email_history.length > 0 && (
          <Card
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmailIcon sx={{ color: '#10b981' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {tOrders('emailHistory') || 'Email History'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orderWithHistory.email_history.map((email) => (
                <Box
                  key={email.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: email.status === 'sent' ? '#f0fdf4' : '#fef2f2',
                    borderLeft: `3px solid ${email.status === 'sent' ? '#10b981' : '#ef4444'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {email.subject}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        {tOrders('to') || 'To'}: {email.recipient}
                      </Typography>
                    </Box>
                    <Chip
                      label={email.status === 'sent' ? (tOrders('sent') || 'Sent') : (tOrders('failed') || 'Failed')}
                      size="small"
                      color={email.status === 'sent' ? 'success' : 'error'}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    {formatDateTime(email.timestamp)} {email.sentBy && `by ${email.sentBy}`}
                  </Typography>
                  {email.error && (
                    <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', mt: 0.5 }}>
                      {tOrders('error') || 'Error'}: {email.error}
                    </Typography>
                  )}
                  {email.messageId && (
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      ID: {email.messageId}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Send Email Dialog */}
        <SendOrderEmailDialog
          open={emailDialog}
          order={orderWithHistory}
          onClose={() => setEmailDialog(false)}
          onSent={handleEmailSent}
        />
      </Box>
    </Drawer>
  );
}

