import { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'N/A';
    return format(dateObj, 'MMM dd, yyyy');
  } catch {
    return 'N/A';
  }
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'N/A';
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'N/A';
  }
};

/**
 * Get status color for MUI Chip
 */
export const getOrderStatusColor = (status: OrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'draft':
      return 'default';
    case 'pending':
      return 'info';
    case 'confirmed':
      return 'primary';
    case 'in_production':
      return 'warning';
    case 'ready_to_ship':
      return 'secondary';
    case 'shipped':
      return 'info';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Get status label for display
 */
export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    draft: 'Draft',
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_production: 'In Production',
    ready_to_ship: 'Ready to Ship',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

/**
 * Check if order is overdue
 */
export const isOrderOverdue = (order: Order): boolean => {
  if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'shipped') {
    return false;
  }
  const expectedDate = order.expected_completion_date;
  if (!expectedDate) return false;
  const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
  return date < new Date();
};

/**
 * Check if order is due soon (within 7 days)
 */
export const isOrderDueSoon = (order: Order): boolean => {
  if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'shipped') {
    return false;
  }
  const expectedDate = order.expected_completion_date;
  if (!expectedDate) return false;
  const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  return date >= today && date <= nextWeek;
};

/**
 * Format currency value
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Calculate total items quantity
 */
export const getTotalItemsQuantity = (order: Order): number => {
  if (!order.items || order.items.length === 0) return 0;
  return order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

