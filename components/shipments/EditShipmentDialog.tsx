'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Shipment, Carrier, ShipmentStatus } from '@/types';

interface EditShipmentDialogProps {
  open: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onSave: (shipment: Shipment) => void;
}

export default function EditShipmentDialog({
  open,
  onClose,
  shipment,
  onSave,
}: EditShipmentDialogProps) {
  const t = useTranslations('shipmentDetail');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Shipment>>(() => {
    if (shipment) {
      return {
        tracking_number: shipment.tracking_number,
        carrier: shipment.carrier,
        po_number: shipment.po_number,
        supplier: shipment.supplier,
        supplier_phone: shipment.supplier_phone,
        supplier_email: shipment.supplier_email,
        origin_city: shipment.origin_city,
        origin_country: shipment.origin_country,
        destination_city: shipment.destination_city,
        destination_state: shipment.destination_state,
        destination_country: shipment.destination_country,
        ship_date: shipment.ship_date,
        expected_delivery_date: shipment.expected_delivery_date,
        actual_delivery_date: shipment.actual_delivery_date,
        status: shipment.status,
        weight: shipment.weight,
        volume: shipment.volume,
        value: shipment.value,
        owner: shipment.owner,
        notes: shipment.notes,
      };
    }
    return {};
  });

  useEffect(() => {
    if (open && shipment) {
      setFormData({
        tracking_number: shipment.tracking_number,
        carrier: shipment.carrier,
        po_number: shipment.po_number,
        supplier: shipment.supplier,
        supplier_phone: shipment.supplier_phone,
        supplier_email: shipment.supplier_email,
        origin_city: shipment.origin_city,
        origin_country: shipment.origin_country,
        destination_city: shipment.destination_city,
        destination_state: shipment.destination_state,
        destination_country: shipment.destination_country,
        ship_date: shipment.ship_date,
        expected_delivery_date: shipment.expected_delivery_date,
        actual_delivery_date: shipment.actual_delivery_date,
        status: shipment.status,
        weight: shipment.weight,
        volume: shipment.volume,
        value: shipment.value,
        owner: shipment.owner,
        notes: shipment.notes,
      });
    }
  }, [open, shipment]);

  const handleSave = async () => {
    if (!shipment) return;

    setSaving(true);
    try {
      const updatedShipment: Shipment = {
        ...shipment,
        ...formData,
        updatedAt: new Date(),
        history: [
          ...(shipment.history || []),
          {
            id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            action: 'Shipment updated',
            user: 'Current User',
            changes: Object.keys(formData).reduce((acc, key) => {
              const oldValue = (shipment as unknown as Record<string, unknown>)[key];
              const newValue = (formData as Record<string, unknown>)[key];
              if (oldValue !== newValue) {
                acc[key] = { old: oldValue, new: newValue };
              }
              return acc;
            }, {} as Record<string, { old: unknown; new: unknown }>),
          },
        ],
      };
      onSave(updatedShipment);
      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error saving shipment:', error);
      setSaving(false);
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!shipment) return null;

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
        {t('editShipment') || 'Edit Shipment'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tracking Number"
                value={formData.tracking_number || ''}
                onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Carrier</InputLabel>
                <Select
                  value={formData.carrier || ''}
                  onChange={(e) => setFormData({ ...formData, carrier: e.target.value as Carrier })}
                  label="Carrier"
                >
                  <MenuItem value="DHL">DHL</MenuItem>
                  <MenuItem value="FedEx">FedEx</MenuItem>
                  <MenuItem value="UPS">UPS</MenuItem>
                  <MenuItem value="USPS">USPS</MenuItem>
                  <MenuItem value="China Post">China Post</MenuItem>
                  <MenuItem value="SF Express">SF Express</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="PO Number"
                value={formData.po_number || ''}
                onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Supplier"
                value={formData.supplier || ''}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Supplier Phone"
                value={formData.supplier_phone || ''}
                onChange={(e) => setFormData({ ...formData, supplier_phone: e.target.value })}
                placeholder="+86-138-0013-8000"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Supplier Email"
                type="email"
                value={formData.supplier_email || ''}
                onChange={(e) => setFormData({ ...formData, supplier_email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Origin City"
                value={formData.origin_city || ''}
                onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Origin Country"
                value={formData.origin_country || ''}
                onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Destination City"
                value={formData.destination_city || ''}
                onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Destination State"
                value={formData.destination_state || ''}
                onChange={(e) => setFormData({ ...formData, destination_state: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Destination Country"
                value={formData.destination_country || ''}
                onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Ship Date"
                type="date"
                value={formatDateForInput(formData.ship_date)}
                onChange={(e) => setFormData({ ...formData, ship_date: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Expected Delivery Date"
                type="date"
                value={formatDateForInput(formData.expected_delivery_date)}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Actual Delivery Date"
                type="date"
                value={formatDateForInput(formData.actual_delivery_date)}
                onChange={(e) => setFormData({ ...formData, actual_delivery_date: e.target.value ? new Date(e.target.value) : undefined })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ShipmentStatus })}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_transit">In Transit</MenuItem>
                  <MenuItem value="in_customs">In Customs</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="exception">Exception</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Weight"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="250kg"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Volume"
                value={formData.volume || ''}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                placeholder="5m³"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Value (USD)"
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Owner"
                value={formData.owner || ''}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            },
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

