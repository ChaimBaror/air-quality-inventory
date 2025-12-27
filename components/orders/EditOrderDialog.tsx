'use client';

import { useState, useEffect } from 'react';
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

interface EditOrderDialogProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSave: (order: Order) => void;
}

export default function EditOrderDialog({ open, order, onClose, onSave }: EditOrderDialogProps) {
  const t = useTranslations('orders');
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [items, setItems] = useState<OrderItem[]>(order.items || []);

  useEffect(() => {
    setEditedOrder(order);
    setItems(order.items || []);
  }, [order]);

  const handleSave = () => {
    // Recalculate total from items
    const totalValue = items.length > 0
      ? items.reduce((sum, item) => sum + item.total_price, 0)
      : editedOrder.total_value;

    onSave({
      ...editedOrder,
      items: items.length > 0 ? items : undefined,
      total_value: totalValue,
      updatedAt: new Date(),
      history: [
        ...(editedOrder.history || []),
        {
          id: `h-${Date.now()}`,
          timestamp: new Date(),
          action: 'Order updated',
          user: editedOrder.owner,
        },
      ],
    });
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
        {t('editOrder') || 'Edit Order'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            label={t('poNumber') || 'PO Number'}
            value={editedOrder.po_number}
            onChange={(e) => setEditedOrder({ ...editedOrder, po_number: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label={t('customerPo') || 'Customer PO'}
            value={editedOrder.customer_po || ''}
            onChange={(e) => setEditedOrder({ ...editedOrder, customer_po: e.target.value })}
            fullWidth
          />

          <TextField
            label={t('supplier') || 'Supplier'}
            value={editedOrder.supplier}
            onChange={(e) => setEditedOrder({ ...editedOrder, supplier: e.target.value })}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>{t('status') || 'Status'}</InputLabel>
            <Select
              value={editedOrder.status}
              label={t('status') || 'Status'}
              onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value as OrderStatus })}
            >
              <MenuItem value="draft">{t('status.draft') || 'Draft'}</MenuItem>
              <MenuItem value="pending">{t('status.pending') || 'Pending'}</MenuItem>
              <MenuItem value="confirmed">{t('status.confirmed') || 'Confirmed'}</MenuItem>
              <MenuItem value="in_production">{t('status.inProduction') || 'In Production'}</MenuItem>
              <MenuItem value="ready_to_ship">{t('status.readyToShip') || 'Ready to Ship'}</MenuItem>
              <MenuItem value="shipped">{t('status.shipped') || 'Shipped'}</MenuItem>
              <MenuItem value="delivered">{t('status.delivered') || 'Delivered'}</MenuItem>
              <MenuItem value="cancelled">{t('status.cancelled') || 'Cancelled'}</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('orderDate') || 'Order Date'}
                type="date"
                value={editedOrder.order_date ? new Date(editedOrder.order_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedOrder({ ...editedOrder, order_date: new Date(e.target.value) })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('expectedCompletion') || 'Expected Completion'}
                type="date"
                value={editedOrder.expected_completion_date ? new Date(editedOrder.expected_completion_date).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedOrder({ 
                  ...editedOrder, 
                  expected_completion_date: e.target.value ? new Date(e.target.value) : undefined 
                })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('supplierEmail') || 'Supplier Email'}
                type="email"
                value={editedOrder.supplier_email || ''}
                onChange={(e) => setEditedOrder({ ...editedOrder, supplier_email: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('supplierPhone') || 'Supplier Phone'}
                value={editedOrder.supplier_phone || ''}
                onChange={(e) => setEditedOrder({ ...editedOrder, supplier_phone: e.target.value })}
                fullWidth
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="SKU"
                      value={item.sku || ''}
                      onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={t('description') || 'Description'}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      fullWidth
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
              <Box sx={{ textAlign: 'center', py: 2, border: '2px dashed #e2e8f0', borderRadius: 2 }}>
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

            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {t('totalValue') || 'Total Value'}: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: editedOrder.currency || 'USD',
                }).format(items.reduce((sum, item) => sum + item.total_price, 0))}
              </Typography>
            </Box>
          </Box>

          <TextField
            label={t('notes') || 'Notes'}
            value={editedOrder.notes || ''}
            onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
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
        <Button onClick={handleSave} variant="contained">
          {t('save') || 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

