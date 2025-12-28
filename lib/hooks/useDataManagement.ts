/**
 * Custom Hooks for Common Operations
 * Reusable hooks for filtering, pagination, and sorting
 */

import { useState, useMemo, useCallback } from 'react';
import { applyShipmentFilters, applyOrderFilters, sortData } from '@/lib/filterUtils';
import { paginate } from '@/lib/pagination';
import { Shipment, Order } from '@/types';
import { ShipmentFilters, OrderFilters } from '@/components/common/AdvancedFilters';

/**
 * Hook for managing shipments with filtering, sorting, and pagination
 */
export function useShipments(initialShipments: Shipment[]) {
  const [shipments] = useState<Shipment[]>(initialShipments);
  const [filters, setFilters] = useState<ShipmentFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<keyof Shipment>('ship_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Apply filters
  const filteredShipments = useMemo(() => {
    return applyShipmentFilters(shipments, filters);
  }, [shipments, filters]);

  // Apply sorting
  const sortedShipments = useMemo(() => {
    return sortData(filteredShipments, sortField, sortDirection);
  }, [filteredShipments, sortField, sortDirection]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    return paginate(sortedShipments, page, pageSize);
  }, [sortedShipments, page, pageSize]);

  const handleSort = useCallback((field: keyof Shipment) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return {
    shipments: paginatedData.data,
    pagination: paginatedData.pagination,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    sortDirection,
    handleSort,
    resetFilters,
    totalFiltered: filteredShipments.length,
    totalAll: shipments.length,
  };
}

/**
 * Hook for managing orders with filtering, sorting, and pagination
 */
export function useOrders(initialOrders: Order[]) {
  const [orders] = useState<Order[]>(initialOrders);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<keyof Order>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Apply filters
  const filteredOrders = useMemo(() => {
    return applyOrderFilters(orders, filters);
  }, [orders, filters]);

  // Apply sorting
  const sortedOrders = useMemo(() => {
    return sortData(filteredOrders, sortField, sortDirection);
  }, [filteredOrders, sortField, sortDirection]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    return paginate(sortedOrders, page, pageSize);
  }, [sortedOrders, page, pageSize]);

  const handleSort = useCallback((field: keyof Order) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const resetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  return {
    orders: paginatedData.data,
    pagination: paginatedData.pagination,
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField,
    sortDirection,
    handleSort,
    resetFilters,
    totalFiltered: filteredOrders.length,
    totalAll: orders.length,
  };
}

/**
 * Hook for managing loading states
 */
export function useLoadingState(initialState: boolean = false) {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
  };
}

/**
 * Hook for debounced search
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  });

  return debouncedValue;
}

/**
 * Hook for local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}


