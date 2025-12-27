import { Shipment, SupplierStats } from '@/types';
import { addDays, subDays } from 'date-fns';

// Mock shipment data - In production this will come from DB or API
export const mockShipments: Shipment[] = [
  {
    id: '1',
    tracking_number: 'DHL1234567890',
    carrier: 'DHL',
    po_number: 'PO-2024-001',
    supplier: 'Guangzhou Textile Factory',
    supplier_phone: '+86-138-0013-8000',
    supplier_email: 'guangzhou@factory.com',
    origin_city: 'Guangzhou',
    origin_country: 'China',
    destination_city: 'Los Angeles',
    destination_state: 'CA',
    destination_country: 'USA',
    ship_date: subDays(new Date(), 10),
    expected_delivery_date: addDays(new Date(), 5),
    status: 'in_transit',
    weight: '250kg',
    volume: '5m³',
    value: 15000,
    owner: 'TOMMY',
    notes: 'Fragile items - handle with care',
    createdAt: subDays(new Date(), 12),
    updatedAt: subDays(new Date(), 1),
    history: [
      {
        id: 'h1',
        timestamp: subDays(new Date(), 12),
        action: 'Shipment created',
        user: 'TOMMY',
      },
      {
        id: 'h2',
        timestamp: subDays(new Date(), 10),
        action: 'Shipped from Guangzhou',
        user: 'System',
      },
    ],
  },
  {
    id: '2',
    tracking_number: 'FEDEX9876543210',
    carrier: 'FedEx',
    po_number: 'PO-2024-002',
    supplier: 'Shenzhen Electronics Co.',
    supplier_phone: '+86-139-0013-9000',
    supplier_email: 'shenzhen@electronics.com',
    origin_city: 'Shenzhen',
    origin_country: 'China',
    destination_city: 'New York',
    destination_state: 'NY',
    destination_country: 'USA',
    ship_date: subDays(new Date(), 5),
    expected_delivery_date: addDays(new Date(), 3),
    status: 'in_customs',
    weight: '180kg',
    volume: '3.5m³',
    value: 22000,
    owner: 'SARAH',
    whatsapp_sent_date: subDays(new Date(), 2),
    notes: 'Customs clearance in progress',
    createdAt: subDays(new Date(), 8),
    updatedAt: subDays(new Date(), 1),
    history: [
      {
        id: 'h3',
        timestamp: subDays(new Date(), 8),
        action: 'Shipment created',
        user: 'SARAH',
      },
      {
        id: 'h4',
        timestamp: subDays(new Date(), 5),
        action: 'Shipped from Shenzhen',
        user: 'System',
      },
      {
        id: 'h5',
        timestamp: subDays(new Date(), 2),
        action: 'Arrived at customs',
        user: 'System',
      },
    ],
  },
  {
    id: '3',
    tracking_number: 'UPS5556667778',
    carrier: 'UPS',
    po_number: 'PO-2024-003',
    supplier: 'Shanghai Manufacturing Ltd.',
    supplier_phone: '+86-137-0013-7000',
    supplier_email: 'shanghai@manufacturing.com',
    origin_city: 'Shanghai',
    origin_country: 'China',
    destination_city: 'Chicago',
    destination_state: 'IL',
    destination_country: 'USA',
    ship_date: subDays(new Date(), 15),
    expected_delivery_date: subDays(new Date(), 2),
    status: 'delayed',
    weight: '320kg',
    volume: '7m³',
    value: 18000,
    owner: 'TOMMY',
    notes: 'Weather delay - expected to arrive soon',
    createdAt: subDays(new Date(), 18),
    updatedAt: subDays(new Date(), 1),
    history: [
      {
        id: 'h6',
        timestamp: subDays(new Date(), 18),
        action: 'Shipment created',
        user: 'TOMMY',
      },
      {
        id: 'h7',
        timestamp: subDays(new Date(), 15),
        action: 'Shipped from Shanghai',
        user: 'System',
      },
      {
        id: 'h8',
        timestamp: subDays(new Date(), 3),
        action: 'Status changed to delayed',
        user: 'System',
        changes: { status: { old: 'in_transit', new: 'delayed' } },
      },
    ],
  },
  {
    id: '4',
    tracking_number: 'DHL1112223334',
    carrier: 'DHL',
    po_number: 'PO-2024-004',
    supplier: 'Dongguan Trading Co.',
    supplier_phone: '+86-136-0013-6000',
    supplier_email: 'dongguan@trading.com',
    origin_city: 'Dongguan',
    origin_country: 'China',
    destination_city: 'Miami',
    destination_state: 'FL',
    destination_country: 'USA',
    ship_date: subDays(new Date(), 20),
    expected_delivery_date: subDays(new Date(), 5),
    actual_delivery_date: subDays(new Date(), 3),
    status: 'delivered',
    weight: '150kg',
    volume: '2.5m³',
    value: 12000,
    owner: 'SARAH',
    notes: 'Delivered successfully',
    createdAt: subDays(new Date(), 22),
    updatedAt: subDays(new Date(), 3),
    history: [
      {
        id: 'h9',
        timestamp: subDays(new Date(), 22),
        action: 'Shipment created',
        user: 'SARAH',
      },
      {
        id: 'h10',
        timestamp: subDays(new Date(), 20),
        action: 'Shipped from Dongguan',
        user: 'System',
      },
      {
        id: 'h11',
        timestamp: subDays(new Date(), 3),
        action: 'Delivered to Miami',
        user: 'System',
      },
    ],
  },
  {
    id: '5',
    tracking_number: 'SF1234567890',
    carrier: 'SF Express',
    po_number: 'PO-2024-005',
    supplier: 'Ningbo Logistics Inc.',
    supplier_phone: '+86-135-0013-5000',
    supplier_email: 'ningbo@logistics.com',
    origin_city: 'Ningbo',
    origin_country: 'China',
    destination_city: 'Seattle',
    destination_state: 'WA',
    destination_country: 'USA',
    ship_date: addDays(new Date(), 2),
    expected_delivery_date: addDays(new Date(), 8),
    status: 'pending',
    weight: '200kg',
    volume: '4m³',
    value: 16000,
    owner: 'TOMMY',
    notes: 'Scheduled for pickup',
    createdAt: subDays(new Date(), 2),
    updatedAt: subDays(new Date(), 1),
    history: [
      {
        id: 'h12',
        timestamp: subDays(new Date(), 2),
        action: 'Shipment created',
        user: 'TOMMY',
      },
    ],
  },
];

// Helper functions
export const getStatusCounts = (shipments: Shipment[]) => {
  return {
    pending: shipments.filter((s) => s.status === 'pending').length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    inCustoms: shipments.filter((s) => s.status === 'in_customs').length,
    delayed: shipments.filter((s) => s.status === 'delayed').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    exception: shipments.filter((s) => s.status === 'exception').length,
  };
};

// Get shipments that are delayed (past expected delivery date)
export const getDelayedCount = (shipments: Shipment[]): number => {
  const today = new Date();
  return shipments.filter((shipment) => {
    if (shipment.status === 'delivered') return false;
    const expectedDate = shipment.expected_delivery_date;
    if (!expectedDate) return false;
    const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
    return date < today;
  }).length;
};

// Get shipments arriving soon (within 7 days)
export const getArrivingSoonCount = (shipments: Shipment[]): number => {
  const today = new Date();
  const nextWeek = addDays(today, 7);
  return shipments.filter((shipment) => {
    if (shipment.status === 'delivered' || shipment.status === 'pending') return false;
    const expectedDate = shipment.expected_delivery_date;
    if (!expectedDate) return false;
    const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
    return date >= today && date <= nextWeek;
  }).length;
};

export const getSupplierStats = (shipments: Shipment[]): SupplierStats[] => {
  const supplierMap = new Map<string, SupplierStats>();
  
  shipments.forEach((shipment) => {
    if (!supplierMap.has(shipment.supplier)) {
      supplierMap.set(shipment.supplier, {
        supplierName: shipment.supplier,
        totalShipments: 0,
        inTransit: 0,
        delayed: 0,
        delivered: 0,
        inCustoms: 0,
      });
    }
    
    const stats = supplierMap.get(shipment.supplier)!;
    stats.totalShipments++;
    
    if (shipment.status === 'in_transit') stats.inTransit++;
    else if (shipment.status === 'delayed') stats.delayed++;
    else if (shipment.status === 'delivered') stats.delivered++;
    else if (shipment.status === 'in_customs') stats.inCustoms++;
  });
  
  return Array.from(supplierMap.values());
};

// Get unique owners from shipments
export const getOwners = (shipments: Shipment[]): string[] => {
  const owners = new Set<string>();
  shipments.forEach((shipment) => {
    if (shipment.owner) {
      owners.add(shipment.owner);
    }
  });
  return Array.from(owners).sort();
};

