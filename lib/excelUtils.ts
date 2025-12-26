import * as XLSX from 'xlsx';
import { Sample } from '@/types';
import { formatDate, getDueDate, getFactoryName, getPONumber } from './utils';

/**
 * Export samples to Excel
 */
export const exportToExcel = (samples: Sample[], filename: string = 'samples') => {
  // Prepare data for table
  const data = samples.map((sample) => ({
    Factory: getFactoryName(sample),
    'PO Number': getPONumber(sample),
    'Customer PO': sample.customer_po || '',
    'Sample Stage': sample.sample_stage || sample.sampleType || '',
    'Sample Size': sample.sample_size || '',
    'Due Date': formatDate(getDueDate(sample)),
    'Date Received': formatDate(sample.date_received || sample.receivedDate),
    Status: getStatusLabel(sample.status),
    Owner: sample.owner || '',
    'Factory Email': sample.factory_email || sample.supplierEmail || '',
    'Reminder Sent Date': formatDate(sample.reminder_sent_date),
    Notes: sample.notes || '',
    // Legacy fields for backward compatibility
    PO: getPONumber(sample),
    Style: sample.style || '',
    'Factory Name': getFactoryName(sample),
    'Sample Type': sample.sample_stage || sample.sampleType || '',
    'Expected Date': formatDate(getDueDate(sample)),
    'Received Date': formatDate(sample.date_received || sample.receivedDate),
    'Created Date': formatDate(sample.createdAt),
    'Updated Date': formatDate(sample.updatedAt),
  }));

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Samples');

  // Download file
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Import samples from Excel
 */
export const importFromExcel = (file: File): Promise<Sample[]> => {
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

        // Convert to Sample objects
        const samples: Sample[] = jsonData.map((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          const dueDate = parseDate(rowData['Due Date'] || rowData['Expected Date']);
          const receivedDate = parseDate(rowData['Date Received'] || rowData['Received Date']);
          const reminderSentDate = parseDate(rowData['Reminder Sent Date']);
          const createdAt = parseDate(rowData['Created Date']) || new Date();
          const updatedAt = parseDate(rowData['Updated Date']) || new Date();

          return {
            id: `imported-${Date.now()}-${index}`,
            factory: String(rowData['Factory'] || rowData['Factory Name'] || ''),
            po_number: String(rowData['PO Number'] || rowData['PO'] || rowData['PO#'] || ''),
            customer_po: String(rowData['Customer PO'] || rowData['customer_po'] || ''),
            sample_stage: String(rowData['Sample Stage'] || rowData['Sample Type'] || 'PP Sample'),
            sample_size: String(rowData['Sample Size'] || rowData['sample_size'] || ''),
            due_date: dueDate || new Date(),
            date_received: receivedDate || undefined,
            status: getStatusFromLabel(String(rowData['Status'] || 'Under Review')) as 'overdue' | 'expected_this_week' | 'under_review' | 'completed',
            owner: String(rowData['Owner'] || rowData['owner'] || ''),
            factory_email: String(rowData['Factory Email'] || rowData['factory_email'] || rowData['supplierEmail'] || ''),
            reminder_sent_date: reminderSentDate || undefined,
            notes: String(rowData['Notes'] || rowData['notes'] || ''),
            // Legacy fields for backward compatibility
            po: String(rowData['PO Number'] || rowData['PO'] || rowData['PO#'] || ''),
            style: String(rowData['Style'] || rowData['style'] || ''),
            factoryName: String(rowData['Factory'] || rowData['Factory Name'] || ''),
            sampleType: String(rowData['Sample Stage'] || rowData['Sample Type'] || 'PP'),
            expectedDate: dueDate || new Date(),
            receivedDate: receivedDate || undefined,
            supplierEmail: String(rowData['Factory Email'] || rowData['factory_email'] || rowData['supplierEmail'] || ''),
            createdAt,
            updatedAt,
            images: [],
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

        resolve(samples);
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
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    overdue: 'Overdue',
    expected_this_week: 'Expected This Week',
    under_review: 'Under Review',
    completed: 'Completed',
  };
  return labels[status] || status;
};

const getStatusFromLabel = (label: string): string => {
  const statusMap: Record<string, string> = {
    'Overdue': 'overdue',
    'Expected This Week': 'expected_this_week',
    'Under Review': 'under_review',
    'Completed': 'completed',
  };
  return statusMap[label] || 'under_review';
};

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

