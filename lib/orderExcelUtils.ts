import * as XLSX from 'xlsx';
import { Order, OrderItem } from '@/types';
import { formatDate } from './orderUtils';

/**
 * Export orders to Excel
 */
export const exportOrdersToExcel = (orders: Order[], filename: string = 'orders') => {
  // Prepare data for main orders table
  const ordersData = orders.map((order) => ({
    'PO Number': order.po_number,
    'Customer PO': order.customer_po || '',
    'Supplier': order.supplier,
    'Supplier Phone': order.supplier_phone || '',
    'Supplier Email': order.supplier_email || '',
    'Order Date': formatDate(order.order_date),
    'Expected Completion Date': formatDate(order.expected_completion_date),
    'Expected Ship Date': formatDate(order.expected_ship_date),
    'Actual Ship Date': formatDate(order.actual_ship_date),
    'Status': order.status,
    'Total Value (USD)': order.total_value,
    'Currency': order.currency || 'USD',
    'Owner': order.owner,
    'Shipping City': order.shipping_address?.city || '',
    'Shipping State': order.shipping_address?.state || '',
    'Shipping Country': order.shipping_address?.country || '',
    'Shipping Address': order.shipping_address?.address || '',
    'Notes': order.notes || '',
  }));

  // Create workbook with multiple sheets
  const wb = XLSX.utils.book_new();
  
  // Add orders sheet
  const ordersWs = XLSX.utils.json_to_sheet(ordersData);
  XLSX.utils.book_append_sheet(wb, ordersWs, 'Orders');

  // Add order items sheet if any orders have items
  const itemsData: Array<Record<string, unknown>> = [];
  orders.forEach((order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        itemsData.push({
          'PO Number': order.po_number,
          'SKU': item.sku || '',
          'Description': item.description,
          'Style': item.style || '',
          'Color': item.color || '',
          'Size': item.size || '',
          'Quantity': item.quantity,
          'Unit Price': item.unit_price,
          'Total Price': item.total_price,
          'Item Notes': item.notes || '',
        });
      });
    }
  });

  if (itemsData.length > 0) {
    const itemsWs = XLSX.utils.json_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, itemsWs, 'Order Items');
  }

  // Download file
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Import orders from Excel
 */
export const importOrdersFromExcel = (file: File): Promise<Order[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read orders sheet (first sheet or sheet named 'Orders')
        const ordersSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('order') && !name.toLowerCase().includes('item')
        ) || workbook.SheetNames[0];
        
        const ordersWorksheet = workbook.Sheets[ordersSheetName];
        const ordersJsonData = XLSX.utils.sheet_to_json(ordersWorksheet);

        // Read items sheet if exists
        const itemsSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('item')
        );
        
        let itemsJsonData: Array<Record<string, unknown>> = [];
        if (itemsSheetName) {
          const itemsWorksheet = workbook.Sheets[itemsSheetName];
          itemsJsonData = XLSX.utils.sheet_to_json(itemsWorksheet);
        }

        // Convert to Order objects
        const orders: Order[] = ordersJsonData.map((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          const orderDate = parseDate(rowData['Order Date'] || rowData['order_date']);
          const expectedCompletion = parseDate(rowData['Expected Completion Date'] || rowData['expected_completion_date']);
          const expectedShip = parseDate(rowData['Expected Ship Date'] || rowData['expected_ship_date']);
          const actualShip = parseDate(rowData['Actual Ship Date'] || rowData['actual_ship_date']);
          const createdAt = new Date();
          const updatedAt = new Date();

          const poNumber = String(rowData['PO Number'] || rowData['po_number'] || rowData['PO'] || '');
          
          // Find items for this order
          const orderItems: OrderItem[] = itemsJsonData
            .filter((itemRow: unknown) => {
              const itemData = itemRow as Record<string, unknown>;
              const itemPo = String(itemData['PO Number'] || itemData['po_number'] || itemData['PO'] || '');
              return itemPo === poNumber;
            })
            .map((itemRow: unknown, itemIndex: number) => {
              const itemData = itemRow as Record<string, unknown>;
              return {
                id: `item-${Date.now()}-${index}-${itemIndex}`,
                sku: String(itemData['SKU'] || itemData['sku'] || ''),
                description: String(itemData['Description'] || itemData['description'] || ''),
                quantity: Number(itemData['Quantity'] || itemData['quantity'] || 0),
                unit_price: Number(itemData['Unit Price'] || itemData['unit_price'] || 0),
                total_price: Number(itemData['Total Price'] || itemData['total_price'] || 0),
                style: String(itemData['Style'] || itemData['style'] || ''),
                color: String(itemData['Color'] || itemData['color'] || ''),
                size: String(itemData['Size'] || itemData['size'] || ''),
                notes: String(itemData['Item Notes'] || itemData['item_notes'] || itemData['Notes'] || ''),
              };
            });

          // Calculate total value if items exist
          const calculatedTotal = orderItems.length > 0
            ? orderItems.reduce((sum, item) => sum + item.total_price, 0)
            : Number(rowData['Total Value (USD)'] || rowData['total_value'] || 0);

          return {
            id: `imported-${Date.now()}-${index}`,
            po_number: poNumber,
            customer_po: String(rowData['Customer PO'] || rowData['customer_po'] || ''),
            supplier: String(rowData['Supplier'] || rowData['supplier'] || ''),
            supplier_phone: String(rowData['Supplier Phone'] || rowData['supplier_phone'] || ''),
            supplier_email: String(rowData['Supplier Email'] || rowData['supplier_email'] || ''),
            order_date: orderDate || new Date(),
            expected_completion_date: expectedCompletion || undefined,
            expected_ship_date: expectedShip || undefined,
            actual_ship_date: actualShip || undefined,
            status: (rowData['Status'] || rowData['status'] || 'pending') as Order['status'],
            total_value: calculatedTotal,
            currency: String(rowData['Currency'] || rowData['currency'] || 'USD'),
            items: orderItems.length > 0 ? orderItems : undefined,
            shipping_address: (rowData['Shipping City'] || rowData['Shipping State']) ? {
              city: String(rowData['Shipping City'] || rowData['shipping_city'] || ''),
              state: String(rowData['Shipping State'] || rowData['shipping_state'] || ''),
              country: String(rowData['Shipping Country'] || rowData['shipping_country'] || 'USA'),
              address: String(rowData['Shipping Address'] || rowData['shipping_address'] || ''),
            } : undefined,
            owner: String(rowData['Owner'] || rowData['owner'] || ''),
            notes: String(rowData['Notes'] || rowData['notes'] || ''),
            createdAt,
            updatedAt,
            history: [
              {
                id: `h-${Date.now()}-${index}`,
                timestamp: createdAt,
                action: 'Imported from Excel',
                user: 'System',
              },
            ],
          };
        });

        resolve(orders);
      } catch (error) {
        reject(new Error(`Error reading file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Helper function to parse dates from Excel
 */
const parseDate = (dateValue: unknown): Date | null => {
  if (!dateValue) return null;

  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // If it's a number (Excel date serial number)
  if (typeof dateValue === 'number') {
    // Excel date serial number - days since 1900-01-01
    const excelEpoch = new Date(1900, 0, 1);
    const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
    return date;
  }

  // If it's a string
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};

