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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Order, OrderStatus, OrderItem } from '@/types';

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
}

export default function CreateOrderDialog({ open, onClose, onSave }: CreateOrderDialogProps) {
  const t = useTranslations('orders');
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    po_number: '',
    customer_po: '',
    supplier: '',
    supplier_phone: '',
    supplier_email: '',
    order_date: new Date(),
    status: 'draft' as OrderStatus,
    total_value: 0,
    currency: 'USD',
    owner: '',
    items: [],
  });

  const [items, setItems] = useState<OrderItem[]>([]);

  const handleSave = () => {
    // Calculate total from items
    const totalValue = items.reduce((sum, item) => sum + item.total_price, 0);

    const order: Order = {
      id: `order-${Date.now()}`,
      po_number: newOrder.po_number || '',
      customer_po: newOrder.customer_po,
      supplier: newOrder.supplier || '',
      supplier_phone: newOrder.supplier_phone,
      supplier_email: newOrder.supplier_email,
      order_date: newOrder.order_date || new Date(),
      expected_completion_date: newOrder.expected_completion_date,
      expected_ship_date: newOrder.expected_ship_date,
      status: newOrder.status || 'draft',
      total_value: totalValue || newOrder.total_value || 0,
      currency: newOrder.currency || 'USD',
      items: items.length > 0 ? items : undefined,
      shipping_address: newOrder.shipping_address,
      owner: newOrder.owner || '',
      notes: newOrder.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date(),
          action: 'Order created',
          user: newOrder.owner || 'System',
        },
      ],
    };

    onSave(order);
    // Reset form
    setNewOrder({
      po_number: '',
      customer_po: '',
      supplier: '',
      supplier_phone: '',
      supplier_email: '',
      order_date: new Date(),
      status: 'draft' as OrderStatus,
      total_value: 0,
      currency: 'USD',
      owner: '',
      items: [],
    });
    setItems([]);
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}-${items.length}`,
      sku: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof OrderItem, value: unknown) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        // Recalculate total_price if quantity or unit_price changed
        if (field === 'quantity' || field === 'unit_price') {
          updated.total_price = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
        {t('createOrder') || 'Create New Order'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('poNumber') || 'PO Number'}
                value={newOrder.po_number}
                onChange={(e) => setNewOrder({ ...newOrder, po_number: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('customerPo') || 'Customer PO'}
                value={newOrder.customer_po || ''}
                onChange={(e) => setNewOrder({ ...newOrder, customer_po: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('supplier') || 'Supplier'}
                value={newOrder.supplier}
                onChange={(e) => setNewOrder({ ...newOrder, supplier: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('supplierEmail') || 'Supplier Email'}
                type="email"
                value={newOrder.supplier_email || ''}
                onChange={(e) => setNewOrder({ ...newOrder, supplier_email: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('supplierPhone') || 'Supplier Phone'}
                value={newOrder.supplier_phone || ''}
                onChange={(e) => setNewOrder({ ...newOrder, supplier_phone: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('status') || 'Status'}</InputLabel>
                <Select
                  value={newOrder.status}
                  label={t('status') || 'Status'}
                  onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as OrderStatus })}
                >
                  <MenuItem value="draft">{t('status.draft') || 'Draft'}</MenuItem>
                  <MenuItem value="pending">{t('status.pending') || 'Pending'}</MenuItem>
                  <MenuItem value="confirmed">{t('status.confirmed') || 'Confirmed'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('owner') || 'Owner'}
                value={newOrder.owner}
                onChange={(e) => setNewOrder({ ...newOrder, owner: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={t('orderDate') || 'Order Date'}
                type="date"
                value={newOrder.order_date ? new Date(newOrder.order_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewOrder({ ...newOrder, order_date: new Date(e.target.value) })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('items') || 'Order Items'}
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addItem}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              >
                {t('addItem') || 'Add Item'}
              </Button>
            </Box>

            {items.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  backgroundColor: '#f8fafc',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t('item') || 'Item'} {index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeItem(item.id)}
                    sx={{ color: '#ef4444' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="SKU"
                      value={item.sku || ''}
                      onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label={t('description') || 'Description'}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={t('quantity') || 'Quantity'}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={t('unitPrice') || 'Unit Price'}
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label={t('totalPrice') || 'Total Price'}
                      type="number"
                      value={item.total_price}
                      disabled
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            {items.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed #e2e8f0', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  {t('noItems') || 'No items added yet'}
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  {t('addFirstItem') || 'Add First Item'}
                </Button>
              </Box>
            )}
          </Box>

          <TextField
            label={t('notes') || 'Notes'}
            value={newOrder.notes || ''}
            onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {t('cancel') || 'Cancel'}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!newOrder.po_number || !newOrder.supplier || !newOrder.owner}
        >
          {t('create') || 'Create Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

