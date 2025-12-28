/**
 * Utilities Index
 * Central export file for all utility functions
 */

// Toast
export { showToast } from './toast';

// PDF Export
export {
  exportShipmentsToPDF,
  exportOrdersToPDF,
  exportShipmentDetailToPDF,
} from './pdfExport';

// Enhanced Excel Export
export {
  exportShipmentsToExcel,
  exportOrdersToExcel,
  exportToCSV,
} from './enhancedExcelExport';

// Pagination
export {
  paginate,
  getPaginationRange,
  getOffset,
  usePagination,
} from './pagination';
export type { PaginationState, PaginatedData } from './pagination';

// Filter Utilities
export {
  applyShipmentFilters,
  applyOrderFilters,
  getUniqueValues,
  sortData,
} from './filterUtils';

// Custom Hooks
export {
  useShipments,
  useOrders,
  useLoadingState,
  useDebounce,
  useLocalStorage,
} from './hooks/useDataManagement';

export {
  useKeyboardShortcuts,
  commonShortcuts,
} from './hooks/useKeyboardShortcuts';
export type { KeyboardShortcut } from './hooks/useKeyboardShortcuts';

// Email
export { emailConfig, getEmailTemplate, getEmailTextTemplate } from './emailConfig';

// Existing utilities (sample utilities)
export { 
  getDueDate,
  getFactoryName,
  getPONumber,
  getFactoryEmail,
  isOverdue as isSampleOverdue,
  isDueSoon,
  getSampleStatus,
  formatDate,
  generateNotificationMessage,
  copyToClipboard
} from './utils';

// Shipment utilities
export { 
  getStatusColor, 
  getStatusLabel, 
  isDelayed,
  isArrivingSoon,
  getExpectedDeliveryDate,
  getShipDate,
  getTrackingUrl,
  generateShipmentNotification,
  formatDate as formatShipmentDate
} from './shipmentUtils';

// Order utilities
export { 
  getOrderStatusColor, 
  getOrderStatusLabel, 
  isOrderOverdue, 
  isOrderDueSoon,
  formatDate as formatOrderDate,
  formatDateTime,
  formatCurrency,
  getTotalItemsQuantity
} from './orderUtils';

