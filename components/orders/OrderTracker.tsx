'use client';

import { useState, useMemo } from 'react';
import { Box, Card, Chip, Button, Typography, Alert, Snackbar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { 
  Download as DownloadIcon,
  Upload as UploadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { mockOrders, getOrderOwners } from '@/lib/orderData';
import { Order, OrderStatus } from '@/types';
import SearchBar from '@/components/common/SearchBar';
import OrderTable from './OrderTable';
import OrderDetail from './OrderDetail';
import EditOrderDialog from './EditOrderDialog';
import ImportOrderDialog from './ImportOrderDialog';
import CreateOrderDialog from './CreateOrderDialog';

export default function OrderTracker() {
  const t = useTranslations('orders');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [importDialog, setImportDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const owners = useMemo(() => getOrderOwners(orders), [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.po_number.toLowerCase().includes(query) ||
          (order.customer_po && order.customer_po.toLowerCase().includes(query)) ||
          order.supplier.toLowerCase().includes(query)
      );
    }

    // Filter by owner
    if (filterOwner !== 'all') {
      filtered = filtered.filter((order) => order.owner === filterOwner);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    return filtered;
  }, [orders, searchQuery, filterOwner, filterStatus]);

  const handleEdit = (order: Order) => {
    setOrderToEdit(order);
    setEditDialog(true);
  };

  const handleSave = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setEditDialog(false);
    setOrderToEdit(null);
    setSnackbar({ open: true, message: t('updateSuccess') || 'Order updated successfully!' });
  };

  const handleCreate = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCreateDialog(false);
    setSnackbar({ open: true, message: t('createSuccess') || 'Order created successfully!' });
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  const handleExport = async () => {
    try {
      const { exportOrdersToExcel } = await import('@/lib/orderExcelUtils');
      exportOrdersToExcel(filteredOrders, 'orders');
      setSnackbar({ open: true, message: t('exportSuccess') || 'Orders exported successfully!' });
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({ open: true, message: t('exportError') || 'Error exporting orders' });
    }
  };

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onClose={handleCloseDetail}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: 4 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              letterSpacing: '-0.01em',
              mb: 1,
            }}
          >
            {t('title') || 'Order Tracker'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.9375rem', sm: '1rem' },
            }}
          >
            {t('subtitle') || 'Manage and track purchase orders'}
          </Typography>
        </Box>

        {/* Filters and Actions */}
        <Card
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchBar
                placeholder={t('searchPlaceholder') || 'Search: PO, Customer PO, Supplier...'}
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{t('filterByOwner') || 'Filter by Owner'}</InputLabel>
              <Select
                value={filterOwner}
                label={t('filterByOwner') || 'Filter by Owner'}
                onChange={(e) => setFilterOwner(e.target.value)}
              >
                <MenuItem value="all">{t('allOwners') || 'All Owners'}</MenuItem>
                {owners.map((owner) => (
                  <MenuItem key={owner} value={owner}>
                    {owner}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{t('filterByStatus') || 'Filter by Status'}</InputLabel>
              <Select
                value={filterStatus}
                label={t('filterByStatus') || 'Filter by Status'}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
              >
                <MenuItem value="all">{t('allStatuses') || 'All Statuses'}</MenuItem>
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

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialog(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                  },
                }}
              >
                {t('create') || 'Create Order'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('export') || 'Export'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => setImportDialog(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {t('import') || 'Import'}
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Results Count */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            {t('orders', { count: filteredOrders.length }) || `${filteredOrders.length} orders`}
          </Typography>
        </Box>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
              {t('noResults') || 'No results found'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {t('tryDifferentSearch') || 'Try changing your search terms'}
            </Typography>
          </Card>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onView={setSelectedOrder}
            onEdit={handleEdit}
          />
        )}
      </Box>

      {/* Create Dialog */}
      <CreateOrderDialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        onSave={handleCreate}
      />

      {/* Edit Dialog */}
      {editDialog && orderToEdit && (
        <EditOrderDialog
          open={editDialog}
          order={orderToEdit}
          onClose={() => {
            setEditDialog(false);
            setOrderToEdit(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Import Dialog */}
      <ImportOrderDialog
        open={importDialog}
        onClose={() => setImportDialog(false)}
        onImport={(importedOrders) => {
          setOrders((prev) => [...prev, ...importedOrders]);
          setImportDialog(false);
          setSnackbar({ 
            open: true, 
            message: t('importSuccess', { count: importedOrders.length }) || `${importedOrders.length} orders imported successfully!` 
          });
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
}

