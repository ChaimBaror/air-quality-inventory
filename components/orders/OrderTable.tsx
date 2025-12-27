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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Order } from '@/types';
import { formatDate, getOrderStatusColor, getOrderStatusLabel, isOrderOverdue, isOrderDueSoon, formatCurrency, getTotalItemsQuantity } from '@/lib/orderUtils';

interface OrderTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onEdit?: (order: Order) => void;
  selectedOrders?: Set<string>;
  onSelectOrder?: (orderId: string, checked: boolean) => void;
}

export default function OrderTable({ 
  orders, 
  onView, 
  onEdit,
  selectedOrders = new Set(),
  onSelectOrder,
}: OrderTableProps) {
  const t = useTranslations('orders');

  const getRowColor = (order: Order) => {
    if (isOrderOverdue(order)) return '#fee2e2';
    if (isOrderDueSoon(order)) return '#fef3c7';
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
            {onSelectOrder && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedOrders.size > 0 && selectedOrders.size < orders.length}
                  checked={selectedOrders.size === orders.length && orders.length > 0}
                  onChange={(e) => {
                    orders.forEach(o => onSelectOrder(o.id, e.target.checked));
                  }}
                />
              </TableCell>
            )}
            <TableCell>{t('columns.poNumber') || 'PO #'}</TableCell>
            <TableCell>{t('columns.customerPo') || 'Customer PO'}</TableCell>
            <TableCell>{t('columns.supplier') || 'Supplier'}</TableCell>
            <TableCell>{t('columns.orderDate') || 'Order Date'}</TableCell>
            <TableCell>{t('columns.expectedCompletion') || 'Expected Completion'}</TableCell>
            <TableCell>{t('columns.status') || 'Status'}</TableCell>
            <TableCell>{t('columns.totalValue') || 'Total Value'}</TableCell>
            <TableCell>{t('columns.items') || 'Items'}</TableCell>
            <TableCell>{t('columns.owner') || 'Owner'}</TableCell>
            <TableCell align="center">{t('columns.actions') || 'Actions'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={order.id}
              sx={{
                backgroundColor: getRowColor(order),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                borderLeft: '4px solid transparent',
                borderLeftColor: isOrderOverdue(order) ? '#ef4444' : isOrderDueSoon(order) ? '#f59e0b' : 'transparent',
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
              onClick={() => onView(order)}
            >
              {onSelectOrder && (
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedOrders.has(order.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order.id, e.target.checked);
                    }}
                  />
                </TableCell>
              )}
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {order.po_number}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {order.customer_po || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {order.supplier}
                </Typography>
              </TableCell>
              <TableCell>{formatDate(order.order_date)}</TableCell>
              <TableCell>
                {formatDate(order.expected_completion_date)}
                {isOrderOverdue(order) && (
                  <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', mt: 0.5 }}>
                    Overdue
                  </Typography>
                )}
                {isOrderDueSoon(order) && (
                  <Typography variant="caption" sx={{ color: '#f59e0b', display: 'block', mt: 0.5 }}>
                    Due Soon
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={getOrderStatusLabel(order.status)}
                  size="small"
                  color={getOrderStatusColor(order.status)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {formatCurrency(order.total_value, order.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {getTotalItemsQuantity(order)} {t('items') || 'items'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={order.owner}
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
                  {onEdit && (
                    <Tooltip title={t('edit') || 'Edit'} arrow placement="top">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(order);
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
                        onView(order);
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

