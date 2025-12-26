export type SampleStatus = 'overdue' | 'expected_this_week' | 'under_review' | 'completed';

export type SampleStage = 'PP Sample' | '1st Fit' | '2nd Fit' | 'TOP Sample' | 'BULK Sample' | 'SHIPMENT Sample' | string;

export interface Sample {
  id: string; // unique identifier
  factory: string; // Factory name
  po_number: string; // PO number
  customer_po: string; // Customer PO
  sample_stage: SampleStage; // Sample stage (e.g., "PP Sample", "1st Fit")
  sample_size: string; // Sample size
  due_date: Date; // ISO-8601 Date
  date_received?: Date; // ISO-8601 Date
  status: SampleStatus;
  owner: string; // Owner name (e.g., "TOMMY")
  factory_email: string; // Factory email address
  reminder_sent_date?: Date; // ISO-8601 Date - when reminder was sent
  notes?: string;
  // Legacy fields for backward compatibility (will be deprecated)
  po?: string;
  style?: string;
  factoryName?: string;
  sampleType?: string;
  expectedDate?: Date;
  receivedDate?: Date;
  supplierEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  images?: string[];
  history?: HistoryEntry[];
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  user?: string;
  changes?: Record<string, { old: any; new: any }>;
}

export interface FactoryStats {
  factoryName: string;
  totalSamples: number;
  overdue: number;
  expectedThisWeek: number;
  underReview: number;
}

