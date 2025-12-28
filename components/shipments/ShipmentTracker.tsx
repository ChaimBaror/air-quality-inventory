'use client';

import { useState, useMemo } from 'react';
import { Box, Card, Chip, Button, Typography, Alert, Snackbar, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { 
  Download as DownloadIcon,
  Upload as UploadIcon,
  Send as SendIcon, 
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { mockShipments, getOwners } from '@/lib/shipmentData';
import { Shipment, ShipmentStatus } from '@/types';
import { exportShipmentsToExcel, importShipmentsFromExcel } from '@/lib/shipmentExcelUtils';
import SearchBar from '@/components/common/SearchBar';
import ShipmentTable from './ShipmentTable';
import ShipmentDetail from './ShipmentDetail';
import SendNotificationDialog from './SendNotificationDialog';
import EditShipmentDialog from './EditShipmentDialog';
import ImportShipmentDialog from './ImportShipmentDialog';

export default function ShipmentTracker() {
  const t = useTranslations('shipments');
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'all'>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null);
  const [importDialog, setImportDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const owners = useMemo(() => getOwners(shipments), [shipments]);

  const filteredShipments = useMemo(() => {
    let filtered = shipments;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (shipment) =>
          shipment.tracking_number.toLowerCase().includes(query) ||
          shipment.po_number.toLowerCase().includes(query) ||
          shipment.supplier.toLowerCase().includes(query) ||
          shipment.origin_city.toLowerCase().includes(query) ||
          shipment.destination_city.toLowerCase().includes(query) ||
          shipment.carrier.toLowerCase().includes(query)
      );
    }

    // Filter by owner
    if (filterOwner !== 'all') {
      filtered = filtered.filter((shipment) => shipment.owner === filterOwner);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((shipment) => shipment.status === filterStatus);
    }

    return filtered;
  }, [shipments, searchQuery, filterOwner, filterStatus]);

  const selectedShipmentsList = useMemo(() => {
    return shipments.filter(s => selectedShipments.has(s.id));
  }, [shipments, selectedShipments]);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShipments(new Set(filteredShipments.map(s => s.id)));
    } else {
      setSelectedShipments(new Set());
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setShipmentToEdit(shipment);
    setEditDialog(true);
  };

  const handleSaveShipment = (updatedShipment: Shipment) => {
    setShipments(prev => prev.map(s => s.id === updatedShipment.id ? updatedShipment : s));
    setSnackbar({ open: true, message: 'Shipment updated successfully!' });
  };

  const handleExportToExcel = () => {
    try {
      exportShipmentsToExcel(shipments, 'shipments_export');
      setSnackbar({ open: true, message: 'Data exported successfully to Excel!' });
    } catch {
      setSnackbar({ open: true, message: 'Error exporting to Excel' });
    }
  };

  const handleImportFromExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const importedShipments = await importShipmentsFromExcel(file);
      setShipments((prev) => [...prev, ...importedShipments]);
      setSnackbar({ open: true, message: `Imported ${importedShipments.length} shipments successfully!` });
      setImportDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: `Import error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 4,
            flexWrap: 'wrap',
            gap: 3,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                mb: 1,
              }}
            >
              {t('title') || 'Shipment Tracker'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {t('subtitle') || 'Track shipments from China to USA'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={t('shipments', { count: filteredShipments.length }) || `${filteredShipments.length} shipments`}
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                height: '36px',
                backgroundColor: '#6366f1',
                color: 'white',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
                },
              }}
            />
            {selectedShipments.size > 0 && (
              <Chip
                label={`${selectedShipments.size} selected`}
                color="secondary"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: '36px',
                }}
              />
            )}
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => setNotificationDialog(true)}
              disabled={selectedShipments.size === 0 && filteredShipments.length === 0}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.9375rem',
                background: 'linear-gradient(135deg, #25D366 0%, #20BA5A 100%)',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.5)',
                  background: 'linear-gradient(135deg, #20BA5A 0%, #1DA851 100%)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {t('sendNotifications') || 'Send Notifications'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportToExcel}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.9375rem',
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                  borderColor: '#4f46e5',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {t('export') || 'Export'}
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setImportDialog(true)}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.9375rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {t('import') || 'Import Excel'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '300px' } }}>
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder={t('searchPlaceholder') || 'Search: Tracking, PO, Supplier...'}
            />
          </Box>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: '150px' } }}>
            <InputLabel id="filter-owner-label">
              <FilterIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              {t('filterByOwner') || 'Owner'}
            </InputLabel>
            <Select
              labelId="filter-owner-label"
              value={filterOwner}
              label={t('filterByOwner') || 'Owner'}
              onChange={(e) => setFilterOwner(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">{t('allOwners') || 'All Owners'}</MenuItem>
              {owners.map((owner) => (
                <MenuItem key={owner} value={owner}>
                  {owner}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: '150px' } }}>
            <InputLabel id="filter-status-label">{t('filterByStatus') || 'Status'}</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filterStatus}
              label={t('filterByStatus') || 'Status'}
              onChange={(e) => setFilterStatus(e.target.value as ShipmentStatus | 'all')}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">{t('allStatuses') || 'All Statuses'}</MenuItem>
              <MenuItem value="pending">{t('status.pending') || 'Pending'}</MenuItem>
              <MenuItem value="in_transit">{t('status.inTransit') || 'In Transit'}</MenuItem>
              <MenuItem value="in_customs">{t('status.inCustoms') || 'In Customs'}</MenuItem>
              <MenuItem value="delayed">{t('status.delayed') || 'Delayed'}</MenuItem>
              <MenuItem value="delivered">{t('status.delivered') || 'Delivered'}</MenuItem>
              <MenuItem value="exception">{t('status.exception') || 'Exception'}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredShipments.length > 0 ? (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedShipments.size === filteredShipments.length && filteredShipments.length > 0}
                    indeterminate={selectedShipments.size > 0 && selectedShipments.size < filteredShipments.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                }
                label="Select All"
                sx={{ mr: 2 }}
              />
              {selectedShipments.size > 0 && (
                <Button
                  size="small"
                  onClick={() => setSelectedShipments(new Set())}
                  sx={{ textTransform: 'none' }}
                >
                  Clear Selection
                </Button>
              )}
            </Box>
            <ShipmentTable 
              shipments={filteredShipments} 
              onView={setSelectedShipment}
              onEdit={handleEdit}
              selectedShipments={selectedShipments}
              onSelectShipment={handleSelectShipment}
            />
          </Box>
        ) : (
          <Card
            elevation={0}
            sx={{
              mt: 3,
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#1e293b' }}>
              {t('noResults') || 'No results found'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {t('tryDifferentSearch') || 'Try changing your search terms'}
            </Typography>
          </Card>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ open: false, message: '' })}
            severity="success"
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {selectedShipment && (
          <ShipmentDetail
            shipment={selectedShipment}
            open={!!selectedShipment}
            onClose={() => setSelectedShipment(null)}
            onEdit={() => {
              setShipmentToEdit(selectedShipment);
              setEditDialog(true);
            }}
          />
        )}

        <SendNotificationDialog
          open={notificationDialog}
          onClose={() => setNotificationDialog(false)}
          shipments={shipments}
          selectedShipments={selectedShipmentsList}
        />

        <EditShipmentDialog
          open={editDialog}
          onClose={() => {
            setEditDialog(false);
            setShipmentToEdit(null);
          }}
          shipment={shipmentToEdit}
          onSave={handleSaveShipment}
        />

        <ImportShipmentDialog
          open={importDialog}
          importing={importing}
          onClose={() => setImportDialog(false)}
          onFileSelect={handleImportFromExcel}
        />
      </Box>
    </Box>
  );
}

