import { Shipment, ShipmentStatus } from '@/types';
import { differenceInDays, isPast, addDays } from 'date-fns';

// Helper to get expected delivery date from shipment
export const getExpectedDeliveryDate = (shipment: Shipment): Date | null => {
  if (shipment.expected_delivery_date) {
    return shipment.expected_delivery_date instanceof Date 
      ? shipment.expected_delivery_date 
      : new Date(shipment.expected_delivery_date);
  }
  return null;
};

// Helper to get ship date from shipment
export const getShipDate = (shipment: Shipment): Date | null => {
  if (shipment.ship_date) {
    return shipment.ship_date instanceof Date 
      ? shipment.ship_date 
      : new Date(shipment.ship_date);
  }
  return null;
};

// Check if shipment is delayed
export const isDelayed = (shipment: Shipment): boolean => {
  if (shipment.status === 'delivered') return false;
  const expectedDate = getExpectedDeliveryDate(shipment);
  if (!expectedDate) return false;
  return isPast(expectedDate) && differenceInDays(expectedDate, new Date()) < 0;
};

// Check if shipment is arriving soon (within 7 days)
export const isArrivingSoon = (shipment: Shipment): boolean => {
  if (shipment.status === 'delivered' || shipment.status === 'pending') return false;
  const expectedDate = getExpectedDeliveryDate(shipment);
  if (!expectedDate) return false;
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const date = expectedDate instanceof Date ? expectedDate : new Date(expectedDate);
  return date >= today && date <= nextWeek;
};

// Get shipment status color
export const getStatusColor = (status: ShipmentStatus): string => {
  const colors: Record<ShipmentStatus, string> = {
    pending: '#94a3b8',
    in_transit: '#3b82f6',
    in_customs: '#f59e0b',
    delayed: '#ef4444',
    delivered: '#10b981',
    exception: '#ec4899',
  };
  return colors[status] || '#94a3b8';
};

// Get shipment status label
export const getStatusLabel = (status: ShipmentStatus): string => {
  const labels: Record<ShipmentStatus, string> = {
    pending: 'Pending',
    in_transit: 'In Transit',
    in_customs: 'In Customs',
    delayed: 'Delayed',
    delivered: 'Delivered',
    exception: 'Exception',
  };
  return labels[status] || status;
};

// Format date helper
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Get tracking URL for carrier
export const getTrackingUrl = (shipment: Shipment): string => {
  const tracking = shipment.tracking_number;
  const carrier = shipment.carrier.toLowerCase();
  const urls: Record<string, string> = {
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${tracking}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${tracking}`,
    'ups': `https://www.ups.com/track?tracknum=${tracking}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`,
    'china post': `https://track.aftership.com/china-post/${tracking}`,
    'sf express': `https://www.sf-express.com/us/en/dynamic_function/waybill/#search/bill-number/${tracking}`,
  };
  return urls[carrier] || `https://www.google.com/search?q=${carrier}+tracking+${tracking}`;
};

// Generate notification message for shipment
export const generateShipmentNotification = (shipment: Shipment): string => {
  const statusText = getStatusLabel(shipment.status);
  const origin = `${shipment.origin_city}, ${shipment.origin_country}`;
  const destination = `${shipment.destination_city}, ${shipment.destination_state}, ${shipment.destination_country}`;
  const expectedDate = formatDate(shipment.expected_delivery_date);
  const trackingLink = getTrackingUrl(shipment);

  return `Shipment Update - ${shipment.tracking_number}

PO: ${shipment.po_number}
Status: ${statusText}
Origin: ${origin}
Destination: ${destination}
Expected Delivery: ${expectedDate}
Tracking: ${trackingLink}

${shipment.notes ? `Notes: ${shipment.notes}` : ''}`;
};

