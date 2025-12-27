import * as XLSX from 'xlsx';
import { Shipment } from '@/types';
import { formatDate } from './shipmentUtils';

/**
 * Export shipments to Excel
 */
export const exportShipmentsToExcel = (shipments: Shipment[], filename: string = 'shipments') => {
  // Prepare data for table
  const data = shipments.map((shipment) => ({
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
    'Ship Date': formatDate(shipment.ship_date),
    'Expected Delivery Date': formatDate(shipment.expected_delivery_date),
    'Actual Delivery Date': formatDate(shipment.actual_delivery_date),
    'Status': shipment.status,
    'Weight': shipment.weight || '',
    'Volume': shipment.volume || '',
    'Value (USD)': shipment.value || '',
    'Owner': shipment.owner,
    'WhatsApp Sent Date': formatDate(shipment.whatsapp_sent_date),
    'Notes': shipment.notes || '',
  }));

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shipments');

  // Download file
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Import shipments from Excel
 */
export const importShipmentsFromExcel = (file: File): Promise<Shipment[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Convert to Shipment objects
        const shipments: Shipment[] = jsonData.map((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          const shipDate = parseDate(rowData['Ship Date']);
          const expectedDate = parseDate(rowData['Expected Delivery Date']);
          const actualDate = parseDate(rowData['Actual Delivery Date']);
          const whatsappDate = parseDate(rowData['WhatsApp Sent Date']);
          const createdAt = new Date();
          const updatedAt = new Date();

          return {
            id: `imported-${Date.now()}-${index}`,
            tracking_number: String(rowData['Tracking Number'] || rowData['tracking_number'] || ''),
            carrier: (rowData['Carrier'] || rowData['carrier'] || 'DHL') as 'DHL' | 'FedEx' | 'UPS' | 'USPS' | 'China Post' | 'SF Express' | 'Other',
            po_number: String(rowData['PO Number'] || rowData['po_number'] || ''),
            supplier: String(rowData['Supplier'] || rowData['supplier'] || ''),
            supplier_phone: String(rowData['Supplier Phone'] || rowData['supplier_phone'] || ''),
            supplier_email: String(rowData['Supplier Email'] || rowData['supplier_email'] || ''),
            origin_city: String(rowData['Origin City'] || rowData['origin_city'] || ''),
            origin_country: String(rowData['Origin Country'] || rowData['origin_country'] || 'China'),
            destination_city: String(rowData['Destination City'] || rowData['destination_city'] || ''),
            destination_state: String(rowData['Destination State'] || rowData['destination_state'] || ''),
            destination_country: String(rowData['Destination Country'] || rowData['destination_country'] || 'USA'),
            ship_date: shipDate || new Date(),
            expected_delivery_date: expectedDate || new Date(),
            actual_delivery_date: actualDate || undefined,
            status: (rowData['Status'] || rowData['status'] || 'pending') as 'pending' | 'in_transit' | 'in_customs' | 'delayed' | 'delivered' | 'exception',
            weight: String(rowData['Weight'] || rowData['weight'] || ''),
            volume: String(rowData['Volume'] || rowData['volume'] || ''),
            value: rowData['Value (USD)'] ? parseFloat(String(rowData['Value (USD)'])) : undefined,
            owner: String(rowData['Owner'] || rowData['owner'] || ''),
            whatsapp_sent_date: whatsappDate || undefined,
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

        resolve(shipments);
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
 * Helper functions
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

