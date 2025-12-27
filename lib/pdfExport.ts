/**
 * PDF Export Utilities
 * Generate PDF reports for shipments and orders
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Shipment, Order } from '@/types';
import { format } from 'date-fns';

/**
 * Export shipments to PDF
 */
export function exportShipmentsToPDF(shipments: Shipment[], filename?: string) {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(18);
  doc.text('Shipments Report', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  // Add summary
  const totalShipments = shipments.length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const inTransit = shipments.filter(s => s.status === 'in_transit').length;
  const delayed = shipments.filter(s => s.status === 'delayed').length;
  
  doc.setFontSize(10);
  doc.text(`Total Shipments: ${totalShipments} | Delivered: ${delivered} | In Transit: ${inTransit} | Delayed: ${delayed}`, 14, 38);
  
  // Prepare table data
  const tableData = shipments.map(shipment => [
    shipment.tracking_number,
    shipment.carrier,
    shipment.po_number,
    shipment.supplier,
    format(new Date(shipment.ship_date), 'MMM dd, yyyy'),
    format(new Date(shipment.expected_delivery_date), 'MMM dd, yyyy'),
    shipment.status.toUpperCase(),
    shipment.value ? `$${shipment.value.toLocaleString()}` : '-',
    shipment.owner,
  ]);
  
  // Add table
  autoTable(doc, {
    head: [[
      'Tracking #',
      'Carrier',
      'PO Number',
      'Supplier',
      'Ship Date',
      'Expected Delivery',
      'Status',
      'Value',
      'Owner',
    ]],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      6: { // Status column
        cellWidth: 20,
        halign: 'center',
      },
      7: { // Value column
        halign: 'right',
      },
    },
  });
  
  // Save the PDF
  const fileName = filename || `shipments-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}

/**
 * Export orders to PDF
 */
export function exportOrdersToPDF(orders: Order[], filename?: string) {
  const doc = new jsPDF('landscape');
  
  // Add title
  doc.setFontSize(18);
  doc.text('Orders Report', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  // Add summary
  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + order.total_value, 0);
  const confirmed = orders.filter(o => o.status === 'confirmed').length;
  const inProduction = orders.filter(o => o.status === 'in_production').length;
  
  doc.setFontSize(10);
  doc.text(`Total Orders: ${totalOrders} | Total Value: $${totalValue.toLocaleString()} | Confirmed: ${confirmed} | In Production: ${inProduction}`, 14, 38);
  
  // Prepare table data
  const tableData = orders.map(order => [
    order.po_number,
    order.customer_po || '-',
    order.supplier,
    format(new Date(order.order_date), 'MMM dd, yyyy'),
    order.expected_completion_date ? format(new Date(order.expected_completion_date), 'MMM dd, yyyy') : '-',
    order.status.replace('_', ' ').toUpperCase(),
    `$${order.total_value.toLocaleString()}`,
    order.items?.length || 0,
    order.owner,
  ]);
  
  // Add table
  autoTable(doc, {
    head: [[
      'PO Number',
      'Customer PO',
      'Supplier',
      'Order Date',
      'Expected Completion',
      'Status',
      'Total Value',
      'Items',
      'Owner',
    ]],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    columnStyles: {
      5: { // Status column
        cellWidth: 25,
      },
      6: { // Value column
        halign: 'right',
      },
      7: { // Items column
        halign: 'center',
      },
    },
  });
  
  // Save the PDF
  const fileName = filename || `orders-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}

/**
 * Export single shipment details to PDF
 */
export function exportShipmentDetailToPDF(shipment: Shipment, filename?: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Shipment Details', 14, 22);
  
  // Add tracking number
  doc.setFontSize(14);
  doc.text(`Tracking: ${shipment.tracking_number}`, 14, 35);
  
  let yPos = 50;
  
  // Shipment Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Shipment Information:', 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const details = [
    ['PO Number:', shipment.po_number],
    ['Carrier:', shipment.carrier],
    ['Status:', shipment.status.toUpperCase()],
    ['Owner:', shipment.owner],
    ['Ship Date:', format(new Date(shipment.ship_date), 'PPP')],
    ['Expected Delivery:', format(new Date(shipment.expected_delivery_date), 'PPP')],
    ['Actual Delivery:', shipment.actual_delivery_date ? format(new Date(shipment.actual_delivery_date), 'PPP') : 'Not delivered yet'],
  ];
  
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Supplier Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Supplier Information:', 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const supplierDetails = [
    ['Supplier:', shipment.supplier],
    ['Phone:', shipment.supplier_phone || '-'],
    ['Email:', shipment.supplier_email || '-'],
  ];
  
  supplierDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Location Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Location Information:', 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const locationDetails = [
    ['Origin:', `${shipment.origin_city}, ${shipment.origin_country}`],
    ['Destination:', `${shipment.destination_city}, ${shipment.destination_state}, ${shipment.destination_country}`],
  ];
  
  locationDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Package Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Package Information:', 14, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const packageDetails = [
    ['Weight:', shipment.weight || '-'],
    ['Volume:', shipment.volume || '-'],
    ['Value:', shipment.value ? `$${shipment.value.toLocaleString()} USD` : '-'],
  ];
  
  packageDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPos);
    yPos += 7;
  });
  
  // Notes
  if (shipment.notes) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 14, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(shipment.notes, 180);
    doc.text(splitNotes, 14, yPos);
  }
  
  // Save the PDF
  const fileName = filename || `shipment-${shipment.tracking_number}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}

