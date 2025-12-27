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
  email_history?: EmailHistoryEntry[]; // Email sending history
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

// Order Status Types
export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'in_production' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled';

// Order Interface - Purchase Orders from suppliers
export interface Order {
  id: string; // unique identifier
  po_number: string; // Purchase Order number
  customer_po?: string; // Customer PO number
  supplier: string; // Supplier/Factory name
  supplier_phone?: string; // Supplier phone number
  supplier_email?: string; // Supplier email
  order_date: Date; // Date when order was placed
  expected_completion_date?: Date; // Expected production completion date
  expected_ship_date?: Date; // Expected shipping date
  actual_ship_date?: Date; // Actual shipping date
  status: OrderStatus; // Current order status
  total_value: number; // Total order value in USD
  currency?: string; // Currency code (default: USD)
  items?: OrderItem[]; // Order line items
  shipping_address?: {
    city: string;
    state: string;
    country: string;
    address?: string;
  };
  owner: string; // Person responsible (e.g., "TOMMY", "SARAH")
  notes?: string; // Additional notes
  createdAt: Date; // When record was created
  updatedAt: Date; // Last update timestamp
  history?: HistoryEntry[]; // Status change history
  images?: string[]; // Photos of order/products
  related_shipments?: string[]; // IDs of related shipments
  email_history?: EmailHistoryEntry[]; // Email sending history
}

// Email History Entry
export interface EmailHistoryEntry {
  id: string;
  timestamp: Date;
  recipient: string; // Email address
  subject: string;
  status: 'sent' | 'failed';
  messageId?: string;
  error?: string;
  sentBy?: string; // User who sent the email
}

// Order Item Interface
export interface OrderItem {
  id: string;
  sku?: string; // Product SKU
  description: string; // Item description
  quantity: number; // Quantity ordered
  unit_price: number; // Price per unit
  total_price: number; // Total price for this item
  style?: string; // Style number
  color?: string; // Color
  size?: string; // Size
  notes?: string; // Item-specific notes
}

// Order Statistics
export interface OrderStats {
  totalOrders: number;
  byStatus: Record<OrderStatus, number>;
  totalValue: number;
  bySupplier: Record<string, number>;
}

