// Shipment Status Types
export type ShipmentStatus = 'pending' | 'in_transit' | 'in_customs' | 'delayed' | 'delivered' | 'exception';

// Carrier Types
export type Carrier = 'DHL' | 'FedEx' | 'UPS' | 'USPS' | 'China Post' | 'SF Express' | 'Other';

// Shipment Interface - Main data structure for tracking shipments from China to USA
export interface Shipment {
  id: string; // unique identifier
  tracking_number: string; // Tracking number from carrier
  carrier: Carrier; // Shipping carrier
  po_number: string; // Purchase Order number
  supplier: string; // Supplier/Factory name in China
  supplier_phone?: string; // Supplier phone number (for WhatsApp)
  supplier_email?: string; // Supplier email
  origin_city: string; // Origin city in China (e.g., "Guangzhou", "Shenzhen")
  origin_country: string; // "China"
  destination_city: string; // Destination city in USA (e.g., "Los Angeles", "New York")
  destination_state: string; // Destination state (e.g., "CA", "NY")
  destination_country: string; // "USA"
  ship_date: Date; // Date when shipment was sent
  expected_delivery_date: Date; // Expected delivery date
  actual_delivery_date?: Date; // Actual delivery date (when delivered)
  status: ShipmentStatus; // Current status
  weight?: string; // Weight (e.g., "50kg", "100lbs")
  volume?: string; // Volume (e.g., "2m³", "70ft³")
  value?: number; // Declared value in USD
  owner: string; // Person responsible (e.g., "TOMMY", "SARAH")
  whatsapp_sent_date?: Date; // When WhatsApp message was sent
  notes?: string; // Additional notes
  createdAt: Date; // When record was created
  updatedAt: Date; // Last update timestamp
  history?: HistoryEntry[]; // Status change history
  images?: string[]; // Photos of shipment/packaging
}

// Legacy Sample interface (for backward compatibility)
export type SampleStatus = 'overdue' | 'expected_this_week' | 'under_review' | 'completed';
export type SampleStage = 'PP Sample' | '1st Fit' | '2nd Fit' | 'TOP Sample' | 'BULK Sample' | 'SHIPMENT Sample' | string;

export interface Sample {
  id: string;
  factory: string;
  po_number: string;
  customer_po: string;
  sample_stage: SampleStage;
  sample_size: string;
  due_date: Date;
  date_received?: Date;
  status: SampleStatus;
  owner: string;
  factory_email: string;
  reminder_sent_date?: Date;
  notes?: string;
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

// Statistics interfaces
export interface SupplierStats {
  supplierName: string;
  totalShipments: number;
  inTransit: number;
  delayed: number;
  delivered: number;
  inCustoms: number;
}

export interface FactoryStats {
  factoryName: string;
  totalSamples: number;
  overdue: number;
  expectedThisWeek: number;
  underReview: number;
}

