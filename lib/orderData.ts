import { Order, OrderStats, OrderStatus } from '@/types';
import { addDays, subDays } from 'date-fns';

// Mock order data - In production this will come from DB or API
export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    po_number: 'PO-2024-001',
    customer_po: 'CUST-PO-2024-001',
    supplier: 'Guangzhou Textile Factory',
    supplier_phone: '+86-138-0013-8000',
    supplier_email: 'guangzhou@factory.com',
    order_date: subDays(new Date(), 30),
    expected_completion_date: addDays(new Date(), 10),
    expected_ship_date: addDays(new Date(), 15),
    status: 'in_production',
    total_value: 15000,
    currency: 'USD',
    items: [
      {
        id: 'item-1',
        sku: 'SKU-001',
        description: 'Cotton T-Shirt - Blue',
        quantity: 500,
        unit_price: 8.50,
        total_price: 4250,
        style: 'STYLE-001',
        color: 'Blue',
        size: 'M',
      },
      {
        id: 'item-2',
        sku: 'SKU-002',
        description: 'Cotton T-Shirt - Red',
        quantity: 500,
        unit_price: 8.50,
        total_price: 4250,
        style: 'STYLE-001',
        color: 'Red',
        size: 'M',
      },
      {
        id: 'item-3',
        sku: 'SKU-003',
        description: 'Cotton T-Shirt - White',
        quantity: 500,
        unit_price: 8.50,
        total_price: 4250,
        style: 'STYLE-001',
        color: 'White',
        size: 'M',
      },
      {
        id: 'item-4',
        sku: 'SKU-004',
        description: 'Cotton T-Shirt - Black',
        quantity: 500,
        unit_price: 8.50,
        total_price: 4250,
        style: 'STYLE-001',
        color: 'Black',
        size: 'M',
      },
    ],
    shipping_address: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      address: '123 Main St, Los Angeles, CA 90001',
    },
    owner: 'TOMMY',
    notes: 'Priority order - need to ship ASAP',
    createdAt: subDays(new Date(), 30),
    updatedAt: subDays(new Date(), 2),
    related_shipments: ['1'],
    history: [
      {
        id: 'h1',
        timestamp: subDays(new Date(), 30),
        action: 'Order created',
        user: 'TOMMY',
      },
      {
        id: 'h2',
        timestamp: subDays(new Date(), 25),
        action: 'Order confirmed by supplier',
        user: 'System',
      },
      {
        id: 'h3',
        timestamp: subDays(new Date(), 20),
        action: 'Production started',
        user: 'System',
      },
    ],
  },
  {
    id: 'ord-2',
    po_number: 'PO-2024-002',
    customer_po: 'CUST-PO-2024-002',
    supplier: 'Shenzhen Electronics Co.',
    supplier_phone: '+86-139-0013-9000',
    supplier_email: 'shenzhen@electronics.com',
    order_date: subDays(new Date(), 25),
    expected_completion_date: addDays(new Date(), 5),
    expected_ship_date: addDays(new Date(), 8),
    status: 'confirmed',
    total_value: 22000,
    currency: 'USD',
    items: [
      {
        id: 'item-5',
        sku: 'SKU-101',
        description: 'Wireless Headphones - Black',
        quantity: 1000,
        unit_price: 12.00,
        total_price: 12000,
        style: 'STYLE-101',
        color: 'Black',
      },
      {
        id: 'item-6',
        sku: 'SKU-102',
        description: 'Wireless Headphones - White',
        quantity: 1000,
        unit_price: 12.00,
        total_price: 12000,
        style: 'STYLE-101',
        color: 'White',
      },
    ],
    shipping_address: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      address: '456 Broadway, New York, NY 10013',
    },
    owner: 'SARAH',
    notes: 'Standard order',
    createdAt: subDays(new Date(), 25),
    updatedAt: subDays(new Date(), 20),
    related_shipments: ['2'],
    history: [
      {
        id: 'h4',
        timestamp: subDays(new Date(), 25),
        action: 'Order created',
        user: 'SARAH',
      },
      {
        id: 'h5',
        timestamp: subDays(new Date(), 20),
        action: 'Order confirmed',
        user: 'System',
      },
    ],
  },
  {
    id: 'ord-3',
    po_number: 'PO-2024-003',
    supplier: 'Shanghai Manufacturing Ltd.',
    supplier_phone: '+86-137-0013-7000',
    supplier_email: 'shanghai@manufacturing.com',
    order_date: subDays(new Date(), 40),
    expected_completion_date: subDays(new Date(), 5),
    expected_ship_date: subDays(new Date(), 2),
    actual_ship_date: subDays(new Date(), 1),
    status: 'shipped',
    total_value: 18000,
    currency: 'USD',
    items: [
      {
        id: 'item-7',
        sku: 'SKU-201',
        description: 'Leather Jacket - Brown',
        quantity: 200,
        unit_price: 45.00,
        total_price: 9000,
        style: 'STYLE-201',
        color: 'Brown',
      },
      {
        id: 'item-8',
        sku: 'SKU-202',
        description: 'Leather Jacket - Black',
        quantity: 200,
        unit_price: 45.00,
        total_price: 9000,
        style: 'STYLE-201',
        color: 'Black',
      },
    ],
    shipping_address: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      address: '789 Michigan Ave, Chicago, IL 60611',
    },
    owner: 'TOMMY',
    notes: 'Delivered on time',
    createdAt: subDays(new Date(), 40),
    updatedAt: subDays(new Date(), 1),
    related_shipments: ['3'],
    history: [
      {
        id: 'h6',
        timestamp: subDays(new Date(), 40),
        action: 'Order created',
        user: 'TOMMY',
      },
      {
        id: 'h7',
        timestamp: subDays(new Date(), 35),
        action: 'Order confirmed',
        user: 'System',
      },
      {
        id: 'h8',
        timestamp: subDays(new Date(), 20),
        action: 'Production completed',
        user: 'System',
      },
      {
        id: 'h9',
        timestamp: subDays(new Date(), 1),
        action: 'Order shipped',
        user: 'System',
      },
    ],
  },
  {
    id: 'ord-4',
    po_number: 'PO-2024-004',
    supplier: 'Dongguan Trading Co.',
    supplier_phone: '+86-136-0013-6000',
    supplier_email: 'dongguan@trading.com',
    order_date: subDays(new Date(), 50),
    expected_completion_date: subDays(new Date(), 10),
    expected_ship_date: subDays(new Date(), 5),
    actual_ship_date: subDays(new Date(), 8),
    status: 'delivered',
    total_value: 12000,
    currency: 'USD',
    items: [
      {
        id: 'item-9',
        sku: 'SKU-301',
        description: 'Denim Jeans - Blue',
        quantity: 300,
        unit_price: 20.00,
        total_price: 6000,
        style: 'STYLE-301',
        color: 'Blue',
      },
      {
        id: 'item-10',
        sku: 'SKU-302',
        description: 'Denim Jeans - Black',
        quantity: 300,
        unit_price: 20.00,
        total_price: 6000,
        style: 'STYLE-301',
        color: 'Black',
      },
    ],
    shipping_address: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      address: '321 Ocean Dr, Miami, FL 33139',
    },
    owner: 'SARAH',
    notes: 'Order completed successfully',
    createdAt: subDays(new Date(), 50),
    updatedAt: subDays(new Date(), 3),
    related_shipments: ['4'],
    history: [
      {
        id: 'h10',
        timestamp: subDays(new Date(), 50),
        action: 'Order created',
        user: 'SARAH',
      },
      {
        id: 'h11',
        timestamp: subDays(new Date(), 8),
        action: 'Order shipped',
        user: 'System',
      },
      {
        id: 'h12',
        timestamp: subDays(new Date(), 3),
        action: 'Order delivered',
        user: 'System',
      },
    ],
  },
  {
    id: 'ord-5',
    po_number: 'PO-2024-005',
    supplier: 'Ningbo Logistics Inc.',
    supplier_phone: '+86-135-0013-5000',
    supplier_email: 'ningbo@logistics.com',
    order_date: subDays(new Date(), 5),
    expected_completion_date: addDays(new Date(), 20),
    expected_ship_date: addDays(new Date(), 25),
    status: 'pending',
    total_value: 16000,
    currency: 'USD',
    items: [
      {
        id: 'item-11',
        sku: 'SKU-401',
        description: 'Running Shoes - White',
        quantity: 400,
        unit_price: 25.00,
        total_price: 10000,
        style: 'STYLE-401',
        color: 'White',
      },
      {
        id: 'item-12',
        sku: 'SKU-402',
        description: 'Running Shoes - Black',
        quantity: 240,
        unit_price: 25.00,
        total_price: 6000,
        style: 'STYLE-401',
        color: 'Black',
      },
    ],
    shipping_address: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      address: '654 Pike St, Seattle, WA 98101',
    },
    owner: 'TOMMY',
    notes: 'New order - awaiting confirmation',
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 5),
    history: [
      {
        id: 'h13',
        timestamp: subDays(new Date(), 5),
        action: 'Order created',
        user: 'TOMMY',
      },
    ],
  },
];

// Helper functions
export const getOrderStatusCounts = (orders: Order[]) => {
  const counts: Record<OrderStatus, number> = {
    draft: 0,
    pending: 0,
    confirmed: 0,
    in_production: 0,
    ready_to_ship: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((order) => {
    counts[order.status]++;
  });

  return counts;
};

export const getOrderStats = (orders: Order[]): OrderStats => {
  const byStatus = getOrderStatusCounts(orders);
  const totalValue = orders.reduce((sum, order) => sum + (order.total_value || 0), 0);
  
  const bySupplier: Record<string, number> = {};
  orders.forEach((order) => {
    if (!bySupplier[order.supplier]) {
      bySupplier[order.supplier] = 0;
    }
    bySupplier[order.supplier] += order.total_value || 0;
  });

  return {
    totalOrders: orders.length,
    byStatus,
    totalValue,
    bySupplier,
  };
};

// Get unique owners from orders
export const getOrderOwners = (orders: Order[]): string[] => {
  const owners = new Set<string>();
  orders.forEach((order) => {
    if (order.owner) {
      owners.add(order.owner);
    }
  });
  return Array.from(owners).sort();
};

// Get orders by status
export const getOrdersByStatus = (orders: Order[], status: OrderStatus): Order[] => {
  return orders.filter((order) => order.status === status);
};

// Get overdue orders (past expected completion date)
export const getOverdueOrders = (orders: Order[]): Order[] => {
  const today = new Date();
  return orders.filter((order) => {
    if (order.status === 'delivered' || order.status === 'cancelled' || order.status === 'shipped') {
      return false;
    }
    const expectedDate = order.expected_completion_date;
    if (!expectedDate) return false;
    const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
    return date < today;
  });
};

