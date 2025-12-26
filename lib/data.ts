import { Sample, FactoryStats } from '@/types';
import { addDays, subDays } from 'date-fns';

// Mock data - In production this will come from DB or API
export const mockSamples: Sample[] = [
  {
    id: '1',
    factory: 'Factory A - Guangzhou',
    po_number: 'PO-2024-001',
    customer_po: 'CUST-PO-001',
    sample_stage: 'PP Sample',
    sample_size: 'M',
    due_date: subDays(new Date(), 5),
    status: 'overdue',
    owner: 'TOMMY',
    factory_email: 'factory-a-guangzhou@example.com',
    reminder_sent_date: subDays(new Date(), 2),
    notes: 'Waiting for color approval',
    // Legacy fields for backward compatibility
    po: 'PO-2024-001',
    style: 'STYLE-123',
    factoryName: 'Factory A - Guangzhou',
    sampleType: 'PP',
    expectedDate: subDays(new Date(), 5),
    receivedDate: undefined,
    supplierEmail: 'factory-a-guangzhou@example.com',
    createdAt: subDays(new Date(), 20),
    updatedAt: subDays(new Date(), 5),
    images: [],
    history: [
      {
        id: 'h1',
        timestamp: subDays(new Date(), 20),
        action: 'Sample created',
        user: 'Admin',
      },
      {
        id: 'h2',
        timestamp: subDays(new Date(), 5),
        action: 'Status updated',
        changes: { status: { old: 'under_review', new: 'overdue' } },
      },
    ],
  },
  {
    id: '2',
    factory: 'Factory B - Shenzhen',
    po_number: 'PO-2024-002',
    customer_po: 'CUST-PO-002',
    sample_stage: '1st Fit',
    sample_size: 'L',
    due_date: addDays(new Date(), 2),
    status: 'expected_this_week',
    owner: 'TOMMY',
    factory_email: 'factory-b-shenzhen@example.com',
    notes: 'First fitting sample',
    // Legacy fields
    po: 'PO-2024-002',
    style: 'STYLE-456',
    factoryName: 'Factory B - Shenzhen',
    sampleType: 'TOP',
    expectedDate: addDays(new Date(), 2),
    receivedDate: undefined,
    supplierEmail: 'factory-b-shenzhen@example.com',
    createdAt: subDays(new Date(), 15),
    updatedAt: subDays(new Date(), 1),
    images: [],
    history: [
      {
        id: 'h3',
        timestamp: subDays(new Date(), 15),
        action: 'Sample created',
        user: 'Admin',
      },
    ],
  },
  {
    id: '3',
    factory: 'Factory A - Guangzhou',
    po_number: 'PO-2024-003',
    customer_po: 'CUST-PO-003',
    sample_stage: 'BULK Sample',
    sample_size: 'XL',
    due_date: addDays(new Date(), 7),
    status: 'under_review',
    owner: 'SARAH',
    factory_email: 'factory-a-guangzhou@example.com',
    notes: 'Bulk production sample',
    // Legacy fields
    po: 'PO-2024-003',
    style: 'STYLE-789',
    factoryName: 'Factory A - Guangzhou',
    sampleType: 'BULK',
    expectedDate: addDays(new Date(), 7),
    receivedDate: undefined,
    supplierEmail: 'factory-a-guangzhou@example.com',
    createdAt: subDays(new Date(), 10),
    updatedAt: subDays(new Date(), 2),
    images: [],
    history: [
      {
        id: 'h4',
        timestamp: subDays(new Date(), 10),
        action: 'Sample created',
        user: 'Admin',
      },
    ],
  },
  {
    id: '4',
    factory: 'Factory C - Shanghai',
    po_number: 'PO-2024-004',
    customer_po: 'CUST-PO-004',
    sample_stage: 'PP Sample',
    sample_size: 'S',
    due_date: addDays(new Date(), 1),
    status: 'expected_this_week',
    owner: 'TOMMY',
    factory_email: 'factory-c-shanghai@example.com',
    notes: 'Pre-production sample',
    // Legacy fields
    po: 'PO-2024-004',
    style: 'STYLE-321',
    factoryName: 'Factory C - Shanghai',
    sampleType: 'PP',
    expectedDate: addDays(new Date(), 1),
    receivedDate: undefined,
    supplierEmail: 'factory-c-shanghai@example.com',
    createdAt: subDays(new Date(), 12),
    updatedAt: subDays(new Date(), 3),
    images: [],
    history: [
      {
        id: 'h5',
        timestamp: subDays(new Date(), 12),
        action: 'Sample created',
        user: 'Admin',
      },
    ],
  },
  {
    id: '5',
    factory: 'Factory B - Shenzhen',
    po_number: 'PO-2024-005',
    customer_po: 'CUST-PO-005',
    sample_stage: 'SHIPMENT Sample',
    sample_size: 'M',
    due_date: subDays(new Date(), 3),
    date_received: undefined,
    status: 'overdue',
    owner: 'SARAH',
    factory_email: 'factory-b-shenzhen@example.com',
    reminder_sent_date: subDays(new Date(), 1),
    notes: 'Shipment sample pending',
    // Legacy fields
    po: 'PO-2024-005',
    style: 'STYLE-654',
    factoryName: 'Factory B - Shenzhen',
    sampleType: 'SHIPMENT',
    expectedDate: subDays(new Date(), 3),
    receivedDate: undefined,
    supplierEmail: 'factory-b-shenzhen@example.com',
    createdAt: subDays(new Date(), 18),
    updatedAt: subDays(new Date(), 3),
    images: [],
    history: [
      {
        id: 'h6',
        timestamp: subDays(new Date(), 18),
        action: 'Sample created',
        user: 'Admin',
      },
    ],
  },
];

// Helper functions
export const getStatusCounts = (samples: Sample[]) => {
  return {
    overdue: samples.filter((s) => s.status === 'overdue').length,
    expectedThisWeek: samples.filter((s) => s.status === 'expected_this_week').length,
    underReview: samples.filter((s) => s.status === 'under_review').length,
    completed: samples.filter((s) => s.status === 'completed').length,
  };
};

// Get samples that are due soon (within 7 days)
export const getDueSoonCount = (samples: Sample[]): number => {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  return samples.filter((sample) => {
    const dueDate = sample.due_date || sample.expectedDate;
    if (!dueDate) return false;
    const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
    return date >= today && date <= nextWeek && sample.status !== 'completed' && sample.status !== 'overdue';
  }).length;
};

export const getFactoryStats = (samples: Sample[]) => {
  const factoryMap = new Map<string, FactoryStats>();
  
  samples.forEach((sample) => {
    const factoryName = sample.factory || sample.factoryName || 'Unknown';
    if (!factoryMap.has(factoryName)) {
      factoryMap.set(factoryName, {
        factoryName,
        totalSamples: 0,
        overdue: 0,
        expectedThisWeek: 0,
        underReview: 0,
      });
    }
    
    const stats = factoryMap.get(factoryName)!;
    stats.totalSamples++;
    
    if (sample.status === 'overdue') stats.overdue++;
    else if (sample.status === 'expected_this_week') stats.expectedThisWeek++;
    else if (sample.status === 'under_review') stats.underReview++;
  });
  
  return Array.from(factoryMap.values());
};

// Get unique owners from samples
export const getOwners = (samples: Sample[]): string[] => {
  const owners = new Set<string>();
  samples.forEach((sample) => {
    if (sample.owner) {
      owners.add(sample.owner);
    }
  });
  return Array.from(owners).sort();
};

