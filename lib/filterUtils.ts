/**
 * Advanced filtering utilities
 * Helper functions for applying filters to data
 */

import { Shipment, Order } from '@/types';
import { ShipmentFilters, OrderFilters } from '@/components/common/AdvancedFilters';
import { isWithinInterval, parseISO } from 'date-fns';

/**
 * Apply filters to shipments array
 */
export function applyShipmentFilters(
  shipments: Shipment[],
  filters: ShipmentFilters
): Shipment[] {
  let filtered = [...shipments];

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(s => filters.status!.includes(s.status));
  }

  // Carrier filter
  if (filters.carrier && filters.carrier.length > 0) {
    filtered = filtered.filter(s => filters.carrier!.includes(s.carrier));
  }

  // Owner filter
  if (filters.owner && filters.owner.length > 0) {
    filtered = filtered.filter(s => filters.owner!.includes(s.owner));
  }

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter(s => {
      const shipDate = new Date(s.ship_date);
      const from = filters.dateFrom ? parseISO(filters.dateFrom) : new Date(0);
      const to = filters.dateTo ? parseISO(filters.dateTo) : new Date(9999, 11, 31);
      
      return isWithinInterval(shipDate, { start: from, end: to });
    });
  }

  // Search term filter
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const term = filters.searchTerm.toLowerCase().trim();
    filtered = filtered.filter(s =>
      s.tracking_number.toLowerCase().includes(term) ||
      s.po_number.toLowerCase().includes(term) ||
      s.supplier.toLowerCase().includes(term) ||
      (s.supplier_email && s.supplier_email.toLowerCase().includes(term)) ||
      (s.notes && s.notes.toLowerCase().includes(term))
    );
  }

  return filtered;
}

/**
 * Apply filters to orders array
 */
export function applyOrderFilters(
  orders: Order[],
  filters: OrderFilters
): Order[] {
  let filtered = [...orders];

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(o => filters.status!.includes(o.status));
  }

  // Supplier filter
  if (filters.supplier && filters.supplier.length > 0) {
    filtered = filtered.filter(o => filters.supplier!.includes(o.supplier));
  }

  // Owner filter
  if (filters.owner && filters.owner.length > 0) {
    filtered = filtered.filter(o => filters.owner!.includes(o.owner));
  }

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter(o => {
      const orderDate = new Date(o.order_date);
      const from = filters.dateFrom ? parseISO(filters.dateFrom) : new Date(0);
      const to = filters.dateTo ? parseISO(filters.dateTo) : new Date(9999, 11, 31);
      
      return isWithinInterval(orderDate, { start: from, end: to });
    });
  }

  // Search term filter
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const term = filters.searchTerm.toLowerCase().trim();
    filtered = filtered.filter(o =>
      o.po_number.toLowerCase().includes(term) ||
      (o.customer_po && o.customer_po.toLowerCase().includes(term)) ||
      o.supplier.toLowerCase().includes(term) ||
      (o.supplier_email && o.supplier_email.toLowerCase().includes(term)) ||
      (o.notes && o.notes.toLowerCase().includes(term))
    );
  }

  return filtered;
}

/**
 * Get unique values from array for filter options
 */
export function getUniqueValues<T, K extends keyof T>(
  data: T[],
  key: K
): Array<T[K]> {
  const unique = Array.from(new Set(data.map(item => item[key])));
  return unique.filter(Boolean) as Array<T[K]>;
}

/**
 * Sort data by field
 */
export function sortData<T>(
  data: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}


