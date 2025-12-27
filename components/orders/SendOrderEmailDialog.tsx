'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Order } from '@/types';

interface SendOrderEmailDialogProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSent?: (emailHistory: any) => void;
}

export default function SendOrderEmailDialog({ open, order, onClose, onSent }: SendOrderEmailDialogProps) {
  const t = useTranslations('orders');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [subject, setSubject] = useState<string>(`Order Update - ${order.po_number}${order.customer_po ? ` / ${order.customer_po}` : ''}`);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!order.supplier_email) {
      setError('Supplier email address is missing');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/orders/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          customMessage: customMessage || undefined,
          subject: subject || undefined,
          sentBy: order.owner,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(true);
      if (onSent && data.emailHistory) {
        onSent(data.emailHistory);
      }
      
      // Reset form after a short delay
      setTimeout(() => {
        setCustomMessage('');
        setSubject(`Order Update - ${order.po_number}${order.customer_po ? ` / ${order.customer_po}` : ''}`);
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setCustomMessage('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmailIcon sx={{ color: '#6366f1' }} />
        {t('sendEmail') || 'Send Email'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {!order.supplier_email && (
            <Alert severity="warning">
              {t('noSupplierEmail') || 'No supplier email address found for this order'}
            </Alert>
          )}

          {order.supplier_email && (
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                {t('recipient') || 'Recipient'}
              </Typography>
              <Chip
                label={order.supplier_email}
                icon={<EmailIcon />}
                sx={{
                  backgroundColor: '#e0e7ff',
                  color: '#6366f1',
                  fontWeight: 600,
                }}
              />
            </Box>
          )}

          <TextField
            label={t('emailSubject') || 'Subject'}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label={t('customMessage') || 'Custom Message (Optional)'}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder={t('emailMessagePlaceholder') || 'Add any additional notes or instructions...'}
          />

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success">
              {t('emailSentSuccess') || 'Email sent successfully!'}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={sending} variant="outlined">
          {t('cancel') || 'Cancel'}
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={sending || !order.supplier_email || !subject}
          startIcon={sending ? <CircularProgress size={20} /> : <EmailIcon />}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            },
          }}
        >
          {sending ? (t('sending') || 'Sending...') : (t('send') || 'Send Email')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

