'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  TextField,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Shipment } from '@/types';
import { generateShipmentNotification } from '@/lib/shipmentUtils';

interface SendNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  shipments: Shipment[];
  selectedShipments?: Shipment[];
}

type NotificationMethod = 'whatsapp' | 'email' | 'both';
type SelectionType = 'all' | 'selected' | 'by_supplier' | 'by_status' | 'by_owner';
type ScheduleType = 'once' | 'weekly';

export default function SendNotificationDialog({
  open,
  onClose,
  shipments,
  selectedShipments = [],
}: SendNotificationDialogProps) {
  const t = useTranslations('notifications');
  const [method, setMethod] = useState<NotificationMethod>('whatsapp');
  const [selectionType, setSelectionType] = useState<SelectionType>('selected');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('once');
  const [scheduleDay, setScheduleDay] = useState<string>('wednesday');
  const [scheduleTime, setScheduleTime] = useState<string>('09:00');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const suppliers = Array.from(new Set(shipments.map(s => s.supplier))).sort();
  const owners = Array.from(new Set(shipments.map(s => s.owner))).sort();
  const statuses = ['pending', 'in_transit', 'in_customs', 'delayed', 'delivered', 'exception'];

  const getTargetShipments = (): Shipment[] => {
    switch (selectionType) {
      case 'all':
        return shipments;
      case 'selected':
        return selectedShipments;
      case 'by_supplier':
        return shipments.filter(s => s.supplier === selectedSupplier);
      case 'by_status':
        return shipments.filter(s => s.status === selectedStatus);
      case 'by_owner':
        return shipments.filter(s => s.owner === selectedOwner);
      default:
        return [];
    }
  };

  const targetShipments = getTargetShipments();
  const targetCount = targetShipments.length;

  const [error, setError] = useState<string | null>(null);
  const [emailResults, setEmailResults] = useState<{ success: number; failed: number } | null>(null);

  const handleSend = async () => {
    if (targetCount === 0) {
      setError('No shipments selected');
      return;
    }

    // Filter shipments with email addresses for email sending
    const shipmentsWithEmail = targetShipments.filter(s => s.supplier_email);
    const shipmentsWithoutEmail = targetShipments.filter(s => !s.supplier_email);
    
    if ((method === 'email' || method === 'both') && shipmentsWithEmail.length === 0) {
      setError('No shipments with email addresses found. Please select shipments that have supplier email addresses.');
      return;
    }

    setSending(true);
    setSuccess(false);
    setError(null);
    setEmailResults(null);

    try {
      if (scheduleType === 'weekly') {
        // Save schedule configuration
        const scheduleConfig = {
          method,
          selectionType,
          selectedSupplier,
          selectedStatus,
          selectedOwner,
          day: scheduleDay,
          time: scheduleTime,
          customMessage,
        };
        localStorage.setItem('notificationSchedule', JSON.stringify(scheduleConfig));
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSending(false);
          setSuccess(false);
        }, 2000);
      } else {
        // Send immediately
        let emailSuccessCount = 0;
        let emailFailedCount = 0;

        // Handle WhatsApp notifications
        if (method === 'whatsapp' || method === 'both') {
          const shipmentsWithPhone = targetShipments.filter(s => s.supplier_phone);
          shipmentsWithPhone.forEach((shipment) => {
            const phoneNumber = shipment.supplier_phone?.replace(/[^0-9+]/g, '') || '';
            if (phoneNumber) {
              const message = customMessage || generateShipmentNotification(shipment);
              window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
            }
          });
        }

        // Handle email notifications using batch API
        if ((method === 'email' || method === 'both') && shipmentsWithEmail.length > 0) {
          try {
            const response = await fetch('/api/shipments/email/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                shipments: shipmentsWithEmail,
                customMessage: customMessage || undefined,
                subject: emailSubject || undefined,
                sentBy: shipmentsWithEmail[0]?.owner || 'System',
              }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
              throw new Error(data.error || 'Failed to send some emails');
            }

            emailSuccessCount = data.successCount || 0;
            emailFailedCount = data.failedCount || 0;

            // Show warning if some shipments don't have emails
            if (shipmentsWithoutEmail.length > 0) {
              setError(`${shipmentsWithoutEmail.length} shipment(s) skipped - no email address`);
            }
          } catch (emailError) {
            console.error('Error sending emails:', emailError);
            setError(emailError instanceof Error ? emailError.message : 'Failed to send emails');
            emailFailedCount = shipmentsWithEmail.length;
          }
        }

        setEmailResults({ success: emailSuccessCount, failed: emailFailedCount });
        setSuccess(true);
        
        setTimeout(() => {
          onClose();
          setSending(false);
          setSuccess(false);
          setError(null);
          setEmailResults(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 2, fontSize: '1.5rem' }}>
        {t('sendNotifications') || 'Send Notifications'}
      </DialogTitle>
      <DialogContent>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {scheduleType === 'weekly' 
              ? 'Schedule configured successfully!' 
              : emailResults 
                ? `Notifications sent! ${emailResults.success} email(s) sent successfully${emailResults.failed > 0 ? `, ${emailResults.failed} failed` : ''}.`
                : 'Notifications sent successfully!'}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Notification Method */}
        <Box sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            {t('notificationMethod') || 'Notification Method'}
          </FormLabel>
          <RadioGroup
            value={method}
            onChange={(e) => setMethod(e.target.value as NotificationMethod)}
            row
          >
            <FormControlLabel
              value="whatsapp"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon sx={{ color: '#25D366' }} />
                  <span>WhatsApp</span>
                </Box>
              }
            />
            <FormControlLabel
              value="email"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#6366f1' }} />
                  <span>Email</span>
                </Box>
              }
            />
            <FormControlLabel
              value="both"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />
                  <EmailIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                  <span>Both</span>
                </Box>
              }
            />
          </RadioGroup>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Selection Type */}
        <Box sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            {t('selectShipments') || 'Select Shipments'}
          </FormLabel>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Selection Type</InputLabel>
            <Select
              value={selectionType}
              onChange={(e) => setSelectionType(e.target.value as SelectionType)}
              label="Selection Type"
            >
              <MenuItem value="selected">
                Selected ({selectedShipments.length})
              </MenuItem>
              <MenuItem value="all">All Shipments ({shipments.length})</MenuItem>
              <MenuItem value="by_supplier">By Supplier</MenuItem>
              <MenuItem value="by_status">By Status</MenuItem>
              <MenuItem value="by_owner">By Owner</MenuItem>
            </Select>
          </FormControl>

          {selectionType === 'by_supplier' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                label="Supplier"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier} value={supplier}>
                    {supplier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectionType === 'by_status' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectionType === 'by_owner' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Owner</InputLabel>
              <Select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                label="Owner"
              >
                {owners.map((owner) => (
                  <MenuItem key={owner} value={owner}>
                    {owner}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${targetCount} shipments selected`}
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            {(method === 'email' || method === 'both') && (
              <>
                <Chip
                  label={`${targetShipments.filter(s => s.supplier_email).length} with email`}
                  color={targetShipments.filter(s => s.supplier_email).length > 0 ? 'success' : 'warning'}
                  sx={{ fontWeight: 500 }}
                />
                {targetShipments.filter(s => !s.supplier_email).length > 0 && (
                  <Chip
                    label={`${targetShipments.filter(s => !s.supplier_email).length} without email`}
                    color="warning"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Schedule */}
        <Box sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            {t('schedule') || 'Schedule'}
          </FormLabel>
          <RadioGroup
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
          >
            <FormControlLabel
              value="once"
              control={<Radio />}
              label="Send Now"
            />
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  <span>Schedule Weekly</span>
                </Box>
              }
            />
          </RadioGroup>

          {scheduleType === 'weekly' && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  label="Day"
                >
                  <MenuItem value="monday">Monday</MenuItem>
                  <MenuItem value="tuesday">Tuesday</MenuItem>
                  <MenuItem value="wednesday">Wednesday</MenuItem>
                  <MenuItem value="thursday">Thursday</MenuItem>
                  <MenuItem value="friday">Friday</MenuItem>
                  <MenuItem value="saturday">Saturday</MenuItem>
                  <MenuItem value="sunday">Sunday</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Time</InputLabel>
                <Select
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  label="Time"
                >
                  <MenuItem value="09:00">9:00 AM</MenuItem>
                  <MenuItem value="10:00">10:00 AM</MenuItem>
                  <MenuItem value="11:00">11:00 AM</MenuItem>
                  <MenuItem value="12:00">12:00 PM</MenuItem>
                  <MenuItem value="14:00">2:00 PM</MenuItem>
                  <MenuItem value="15:00">3:00 PM</MenuItem>
                  <MenuItem value="16:00">4:00 PM</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Email Subject (only show for email method) */}
        {(method === 'email' || method === 'both') && (
          <Box sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              {t('emailSubject') || 'Email Subject (Optional)'}
            </FormLabel>
            <TextField
              fullWidth
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Leave empty to use default subject..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              helperText="Default: 'Delayed Shipment Reminder - [Tracking] / PO [PO Number]'"
            />
          </Box>
        )}

        {/* Custom Message */}
        <Box sx={{ mb: 2 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            {t('customMessage') || 'Custom Message (Optional)'}
          </FormLabel>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter custom message or leave empty to use default..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={sending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={sending || targetCount === 0}
          startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            },
          }}
        >
          {sending ? 'Sending...' : scheduleType === 'weekly' ? 'Schedule' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

