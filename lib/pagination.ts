/**
 * Pagination Utilities
 * Helper functions for implementing pagination
 */

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Paginate an array of data
 */
export function paginate<T>(
  data: T[],
  page: number,
  pageSize: number
): PaginatedData<T> {
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

/**
 * Get pagination range for display
 * Returns array of page numbers to show in pagination controls
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  if (currentPage <= halfVisible) {
    endPage = maxVisible;
  }

  if (currentPage >= totalPages - halfVisible) {
    startPage = totalPages - maxVisible + 1;
  }

  const pages: (number | string)[] = [];

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Calculate offset for server-side pagination
 */
export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Hook for managing pagination state
 */
export function usePagination(initialPageSize: number = 20) {
  return {
    page: 1,
    pageSize: initialPageSize,
  };
}

