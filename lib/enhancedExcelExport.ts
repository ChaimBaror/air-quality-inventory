/**
 * Enhanced Excel Export Utilities
 * Advanced Excel export with styling, charts, and multiple formats
 */
import * as XLSX from 'xlsx';
import { Shipment, Order } from '@/types';
import { format } from 'date-fns';

interface ExportOptions {
  filename?: string;
  sheetName?: string;
  includeCharts?: boolean;
  includeStats?: boolean;
  autoFilter?: boolean;
  freezeHeader?: boolean;
}

/**
 * Export shipments with enhanced formatting
 */
export function exportShipmentsToExcel(shipments: Shipment[], options: ExportOptions = {}) {
  const {
    filename = `shipments-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.xlsx`,
    sheetName = 'Shipments',
    includeStats = true,
    autoFilter = true,
    freezeHeader = true,
  } = options;

  const workbook = XLSX.utils.book_new();

  // Main data sheet
  const data = shipments.map(shipment => ({
    'Tracking Number': shipment.tracking_number,
    'Carrier': shipment.carrier,
    'PO Number': shipment.po_number,
    'Supplier': shipment.supplier,
    'Supplier Phone': shipment.supplier_phone || '',
    'Supplier Email': shipment.supplier_email || '',
    'Origin City': shipment.origin_city,
    'Origin Country': shipment.origin_country,
    'Destination City': shipment.destination_city,
    'Destination State': shipment.destination_state,
    'Destination Country': shipment.destination_country,
    'Ship Date': format(new Date(shipment.ship_date), 'yyyy-MM-dd'),
    'Expected Delivery': format(new Date(shipment.expected_delivery_date), 'yyyy-MM-dd'),
    'Actual Delivery': shipment.actual_delivery_date
      ? format(new Date(shipment.actual_delivery_date), 'yyyy-MM-dd')
      : '',
    'Status': shipment.status.toUpperCase(),
    'Weight': shipment.weight || '',
    'Volume': shipment.volume || '',
    'Value (USD)': shipment.value || '',
    'Owner': shipment.owner,
    'Notes': shipment.notes || '',
    'Created At': format(new Date(shipment.createdAt), 'yyyy-MM-dd HH:mm'),
    'Updated At': format(new Date(shipment.updatedAt), 'yyyy-MM-dd HH:mm'),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const columnWidths = [
    { wch: 18 }, // Tracking Number
    { wch: 12 }, // Carrier
    { wch: 15 }, // PO Number
    { wch: 25 }, // Supplier
    { wch: 18 }, // Supplier Phone
    { wch: 25 }, // Supplier Email
    { wch: 15 }, // Origin City
    { wch: 12 }, // Origin Country
    { wch: 15 }, // Destination City
    { wch: 12 }, // Destination State
    { wch: 12 }, // Destination Country
    { wch: 12 }, // Ship Date
    { wch: 15 }, // Expected Delivery
    { wch: 15 }, // Actual Delivery
    { wch: 12 }, // Status
    { wch: 10 }, // Weight
    { wch: 10 }, // Volume
    { wch: 12 }, // Value
    { wch: 10 }, // Owner
    { wch: 30 }, // Notes
    { wch: 18 }, // Created At
    { wch: 18 }, // Updated At
  ];
  worksheet['!cols'] = columnWidths;

  // Freeze first row
  if (freezeHeader) {
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  }

  // Add auto filter
  if (autoFilter && data.length > 0) {
    worksheet['!autofilter'] = { ref: `A1:V${data.length + 1}` };
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Statistics sheet
  if (includeStats) {
    const stats = calculateShipmentStats(shipments);
    const statsWorksheet = XLSX.utils.json_to_sheet([
      { Metric: 'Total Shipments', Value: stats.total },
      { Metric: 'Pending', Value: stats.pending },
      { Metric: 'In Transit', Value: stats.inTransit },
      { Metric: 'In Customs', Value: stats.inCustoms },
      { Metric: 'Delayed', Value: stats.delayed },
      { Metric: 'Delivered', Value: stats.delivered },
      { Metric: 'Exception', Value: stats.exception },
      { Metric: '', Value: '' },
      { Metric: 'Total Value (USD)', Value: stats.totalValue },
      { Metric: 'Average Value (USD)', Value: stats.avgValue },
      { Metric: '', Value: '' },
      { Metric: 'Generated At', Value: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
    ]);
    statsWorksheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');
  }

  // Carrier breakdown sheet
  const carrierStats = calculateCarrierStats(shipments);
  const carrierWorksheet = XLSX.utils.json_to_sheet(carrierStats);
  carrierWorksheet['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(workbook, carrierWorksheet, 'By Carrier');

  // Save file
  XLSX.writeFile(workbook, filename);
}

/**
 * Export orders with enhanced formatting
 */
export function exportOrdersToExcel(orders: Order[], options: ExportOptions = {}) {
  const {
    filename = `orders-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.xlsx`,
    sheetName = 'Orders',
    includeStats = true,
    autoFilter = true,
    freezeHeader = true,
  } = options;

  const workbook = XLSX.utils.book_new();

  // Main orders data
  const ordersData = orders.map(order => ({
    'PO Number': order.po_number,
    'Customer PO': order.customer_po || '',
    'Supplier': order.supplier,
    'Supplier Phone': order.supplier_phone || '',
    'Supplier Email': order.supplier_email || '',
    'Order Date': format(new Date(order.order_date), 'yyyy-MM-dd'),
    'Expected Completion': order.expected_completion_date
      ? format(new Date(order.expected_completion_date), 'yyyy-MM-dd')
      : '',
    'Expected Ship Date': order.expected_ship_date
      ? format(new Date(order.expected_ship_date), 'yyyy-MM-dd')
      : '',
    'Actual Ship Date': order.actual_ship_date
      ? format(new Date(order.actual_ship_date), 'yyyy-MM-dd')
      : '',
    'Status': order.status.replace('_', ' ').toUpperCase(),
    'Total Value (USD)': order.total_value,
    'Currency': order.currency || 'USD',
    'Items Count': order.items?.length || 0,
    'Owner': order.owner,
    'Shipping City': order.shipping_address?.city || '',
    'Shipping State': order.shipping_address?.state || '',
    'Shipping Country': order.shipping_address?.country || '',
    'Notes': order.notes || '',
    'Created At': format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
    'Updated At': format(new Date(order.updatedAt), 'yyyy-MM-dd HH:mm'),
  }));

  const ordersWorksheet = XLSX.utils.json_to_sheet(ordersData);
  ordersWorksheet['!cols'] = [
    { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
    { wch: 25 }, { wch: 12 }, { wch: 18 }, { wch: 18 },
    { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
    { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 12 },
    { wch: 15 }, { wch: 30 }, { wch: 18 }, { wch: 18 },
  ];

  if (freezeHeader) {
    ordersWorksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  }

  if (autoFilter && ordersData.length > 0) {
    ordersWorksheet['!autofilter'] = { ref: `A1:T${ordersData.length + 1}` };
  }

  XLSX.utils.book_append_sheet(workbook, ordersWorksheet, sheetName);

  // Order Items sheet
  const itemsData: Record<string, string | number>[] = [];
  orders.forEach(order => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        itemsData.push({
          'PO Number': order.po_number,
          'SKU': item.sku || '',
          'Description': item.description,
          'Quantity': item.quantity,
          'Unit Price': item.unit_price,
          'Total Price': item.total_price,
          'Style': item.style || '',
          'Color': item.color || '',
          'Size': item.size || '',
          'Notes': item.notes || '',
        });
      });
    }
  });

  if (itemsData.length > 0) {
    const itemsWorksheet = XLSX.utils.json_to_sheet(itemsData);
    itemsWorksheet['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 10 },
      { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
      { wch: 10 }, { wch: 25 },
    ];
    XLSX.utils.book_append_sheet(workbook, itemsWorksheet, 'Order Items');
  }

  // Statistics sheet
  if (includeStats) {
    const stats = calculateOrderStats(orders);
    const statsWorksheet = XLSX.utils.json_to_sheet([
      { Metric: 'Total Orders', Value: stats.total },
      { Metric: 'Draft', Value: stats.draft },
      { Metric: 'Pending', Value: stats.pending },
      { Metric: 'Confirmed', Value: stats.confirmed },
      { Metric: 'In Production', Value: stats.inProduction },
      { Metric: 'Ready to Ship', Value: stats.readyToShip },
      { Metric: 'Shipped', Value: stats.shipped },
      { Metric: 'Delivered', Value: stats.delivered },
      { Metric: 'Cancelled', Value: stats.cancelled },
      { Metric: '', Value: '' },
      { Metric: 'Total Value (USD)', Value: stats.totalValue },
      { Metric: 'Average Value (USD)', Value: stats.avgValue },
      { Metric: '', Value: '' },
      { Metric: 'Generated At', Value: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
    ]);
    statsWorksheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');
  }

  // Save file
  XLSX.writeFile(workbook, filename);
}

/**
 * Export to CSV format
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string = `export-${format(new Date(), 'yyyy-MM-dd')}.csv`
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Helper functions
function calculateShipmentStats(shipments: Shipment[]) {
  return {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => s.status === 'in_transit').length,
    inCustoms: shipments.filter(s => s.status === 'in_customs').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    exception: shipments.filter(s => s.status === 'exception').length,
    totalValue: shipments.reduce((sum, s) => sum + (s.value || 0), 0),
    avgValue: shipments.length > 0
      ? Math.round(shipments.reduce((sum, s) => sum + (s.value || 0), 0) / shipments.length)
      : 0,
  };
}

function calculateOrderStats(orders: Order[]) {
  return {
    total: orders.length,
    draft: orders.filter(o => o.status === 'draft').length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    inProduction: orders.filter(o => o.status === 'in_production').length,
    readyToShip: orders.filter(o => o.status === 'ready_to_ship').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalValue: orders.reduce((sum, o) => sum + o.total_value, 0),
    avgValue: orders.length > 0
      ? Math.round(orders.reduce((sum, o) => sum + o.total_value, 0) / orders.length)
      : 0,
  };
}

function calculateCarrierStats(shipments: Shipment[]) {
  const carriers = ['DHL', 'FedEx', 'UPS', 'USPS', 'China Post', 'SF Express', 'Other'];
  return carriers.map(carrier => {
    const carrierShipments = shipments.filter(s => s.carrier === carrier);
    return {
      'Carrier': carrier,
      'Count': carrierShipments.length,
      'Total Value (USD)': carrierShipments.reduce((sum, s) => sum + (s.value || 0), 0),
    };
  }).filter(c => c.Count > 0);
}

