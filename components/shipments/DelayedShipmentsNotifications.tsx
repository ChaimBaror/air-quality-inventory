'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { mockShipments } from '@/lib/shipmentData';
import { Shipment } from '@/types';
import { formatDate, isDelayed } from '@/lib/shipmentUtils';

export default function DelayedShipmentsNotifications() {
  const t = useTranslations('notifications');
  const tCommon = useTranslations('common');
  const [shipments] = useState<Shipment[]>(mockShipments);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<Array<{ shipment: Shipment; result: { success: boolean; error?: string } }>>([]);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());
  const [previewDialog, setPreviewDialog] = useState(false);

  // Find delayed shipments
  const delayedShipments = useMemo(() => {
    return shipments.filter(shipment => isDelayed(shipment));
  }, [shipments]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShipments(new Set(delayedShipments.map(s => s.id)));
    } else {
      setSelectedShipments(new Set());
    }
  };

  const handleSelectShipment = (shipmentId: string, checked: boolean) => {
    setSelectedShipments(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(shipmentId);
      } else {
        newSet.delete(shipmentId);
      }
      return newSet;
    });
  };

  const handleSendEmails = async () => {
    const shipmentsToSend = delayedShipments.filter(s => selectedShipments.has(s.id));
    
    if (shipmentsToSend.length === 0) {
      alert(t('selectAtLeastOneShipment') || 'Please select at least one shipment');
      return;
    }

    setSending(true);
    setResults([]);

    try {
      const response = await fetch('/api/shipments/email/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipments: shipmentsToSend,
          customMessage: customMessage || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t('failedToSendEmails') || 'Failed to send emails');
      }

      setResults(data.results || []);
      setPreviewDialog(true);
    } catch (error) {
      console.error('Error sending emails:', error);
      const errorMessage = error instanceof Error ? error.message : (t('unknownError') || 'Unknown error');
      alert(`${t('errorSendingEmails') || 'Error sending emails'}: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  const successCount = results.filter(r => r.result.success).length;
  const failedCount = results.filter(r => !r.result.success).length;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <WarningIcon sx={{ fontSize: 40, color: '#ef4444' }} />
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                letterSpacing: '-0.01em',
              }}
            >
              {t('delayedShipmentsTitle') || 'Delayed Shipments Notifications'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.9375rem',
              }}
            >
              {t('delayedShipmentsDescription') || 'Send email notifications to suppliers for delayed shipments'}
            </Typography>
          </Box>
        </Box>

        {delayedShipments.length === 0 ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('noDelayedShipments') || 'No delayed shipments found. All shipments are on time!'}
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip
                label={t('delayedShipmentsCount', { count: delayedShipments.length }) || `${delayedShipments.length} delayed shipments`}
                color="error"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2.5,
                  px: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedShipments.size === delayedShipments.length && delayedShipments.length > 0}
                    indeterminate={selectedShipments.size > 0 && selectedShipments.size < delayedShipments.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                }
                label={t('selectAll', { count: selectedShipments.size }) || `Select All (${selectedShipments.size} selected)`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('customMessage') || 'Custom Message (Optional)'}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={t('customMessagePlaceholder') || "Enter a custom message to include in all emails..."}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <List sx={{ maxHeight: 400, overflow: 'auto', mb: 3 }}>
              {delayedShipments.map((shipment) => (
                <ListItem
                  key={shipment.id}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: '#fef2f2',
                    '&:hover': {
                      backgroundColor: '#fee2e2',
                    },
                  }}
                >
                  <Checkbox
                    checked={selectedShipments.has(shipment.id)}
                    onChange={(e) => handleSelectShipment(shipment.id, e.target.checked)}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {shipment.tracking_number}
                        </Typography>
                        <Chip
                          label={shipment.carrier}
                          size="small"
                          sx={{
                            backgroundColor: '#e0e7ff',
                            color: '#6366f1',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                          {t('poLabel') || 'PO:'} {shipment.po_number} | {t('supplierLabel') || 'Supplier:'} {shipment.supplier}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
                          {t('expectedLabel') || 'Expected:'} {formatDate(shipment.expected_delivery_date)} | 
                          {shipment.supplier_email ? ` ${t('emailLabel') || 'Email:'} ${shipment.supplier_email}` : ` ${t('noEmailLabel') || 'No email'}`}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {shipment.supplier_email ? (
                      <Chip
                        icon={<EmailIcon />}
                        label={t('emailAvailable') || 'Email Available'}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      <Chip
                        label={t('noEmail') || 'No Email'}
                        size="small"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              fullWidth
              startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              onClick={handleSendEmails}
              disabled={sending || selectedShipments.size === 0}
              sx={{
                borderRadius: 3,
                py: 2,
                fontWeight: 600,
                fontSize: '0.9375rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {sending 
                ? (t('sendingEmails') || 'Sending Emails...')
                : t('sendEmailsToSelected', { count: selectedShipments.size, plural: selectedShipments.size !== 1 ? 's' : '' }) || `Send Emails to ${selectedShipments.size} Selected Shipment${selectedShipments.size !== 1 ? 's' : ''}`}
            </Button>
          </>
        )}
      </CardContent>

      {/* Results Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 2, fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t('emailResults') || 'Email Results'}</span>
          <IconButton onClick={() => setPreviewDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('sentFailed', { successCount, failedCount }) || `Sent: ${successCount} | Failed: ${failedCount}`}
              </Typography>
            </Alert>
          </Box>
          <List>
            {results.map(({ shipment, result }) => (
              <ListItem
                key={shipment.id}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: result.success ? '#f0fdf4' : '#fef2f2',
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {shipment.tracking_number}
                      </Typography>
                      {result.success ? (
                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                      ) : (
                        <WarningIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                      {result.success 
                        ? (t('emailSentSuccessfully', { email: shipment.supplier_email }) || `Email sent successfully to ${shipment.supplier_email}`)
                        : (t('emailError', { error: result.error || t('unknownError') || 'Unknown error' }) || `Error: ${result.error || 'Unknown error'}`)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setPreviewDialog(false)} variant="contained">
            {tCommon('close') || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

