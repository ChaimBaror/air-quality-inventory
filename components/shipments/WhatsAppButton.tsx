'use client';

import { Button, Tooltip, IconButton } from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { Shipment } from '@/types';
import { formatDate } from '@/lib/utils';

interface WhatsAppButtonProps {
  shipment: Shipment;
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

export default function WhatsAppButton({ shipment, variant = 'icon', size = 'small' }: WhatsAppButtonProps) {
  const generateWhatsAppMessage = (shipment: Shipment): string => {
    const statusText = {
      pending: 'is pending pickup',
      in_transit: 'is in transit',
      in_customs: 'is in customs',
      delayed: 'is delayed',
      delivered: 'has been delivered',
      exception: 'has an exception',
    }[shipment.status] || 'is being processed';

    const origin = `${shipment.origin_city}, ${shipment.origin_country}`;
    const destination = `${shipment.destination_city}, ${shipment.destination_state}, ${shipment.destination_country}`;
    const expectedDate = formatDate(shipment.expected_delivery_date);
    const trackingLink = `https://www.${shipment.carrier.toLowerCase()}.com/track/${shipment.tracking_number}`;

    return `Hi ${shipment.supplier},

Regarding shipment ${shipment.tracking_number} for PO ${shipment.po_number}:

Status: ${statusText}
Origin: ${origin}
Destination: ${destination}
Expected Delivery: ${expectedDate}
Tracking: ${trackingLink}

${shipment.notes ? `Notes: ${shipment.notes}` : ''}

Please update status if needed.

Thank you.`;
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = shipment.supplier_phone?.replace(/[^0-9+]/g, '') || '';
    const message = encodeURIComponent(generateWhatsAppMessage(shipment));
    
    if (phoneNumber) {
      // Open WhatsApp Web/App with pre-filled message
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    } else {
      // If no phone number, just copy message to clipboard
      navigator.clipboard.writeText(generateWhatsAppMessage(shipment));
      alert('Message copied to clipboard! Phone number not available.');
    }
  };

  if (variant === 'button') {
    return (
      <Button
        variant="contained"
        startIcon={<WhatsAppIcon />}
        onClick={handleWhatsAppClick}
        size={size}
        sx={{
          backgroundColor: '#25D366',
          color: 'white',
          '&:hover': {
            backgroundColor: '#20BA5A',
          },
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Send WhatsApp
      </Button>
    );
  }

  return (
    <Tooltip title="Send WhatsApp Message" arrow placement="top">
      <IconButton
        size={size}
        onClick={handleWhatsAppClick}
        sx={{
          color: '#25D366',
          '&:hover': {
            backgroundColor: '#25D36615',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <WhatsAppIcon />
      </IconButton>
    </Tooltip>
  );
}

