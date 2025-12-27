'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FileUpload as FileUploadIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Order } from '@/types';
import { importOrdersFromExcel } from '@/lib/orderExcelUtils';

interface ImportOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (orders: Order[]) => void;
}

export default function ImportOrderDialog({ open, onClose, onImport }: ImportOrderDialogProps) {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const importedOrders = await importOrdersFromExcel(file);
      onImport(importedOrders);
      setImporting(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import orders');
      setImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !importing && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 2 }}>
        {t('importDialog.title') || 'Import Orders from Excel'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('importDialog.description') || 'Select an Excel file (.xlsx) to import. The file should contain the following columns:'}
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e2e8f0',
              mb: 2,
            }}
          >
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', display: 'block', mb: 1 }}>
              <strong>Orders Sheet:</strong> PO Number, Customer PO, Supplier, Order Date, Status, Total Value (USD), Owner
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              <strong>Order Items Sheet (optional):</strong> PO Number, SKU, Description, Quantity, Unit Price, Total Price
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="excel-upload-orders"
            type="file"
            onChange={handleFileSelect}
            disabled={importing}
          />
          <label htmlFor="excel-upload-orders">
            <Button
              variant="outlined"
              component="span"
              startIcon={importing ? <CircularProgress size={20} /> : <FileUploadIcon />}
              fullWidth
              disabled={importing}
              sx={{
                borderRadius: 2,
                py: 1.5,
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: '#6366f1',
                color: '#6366f1',
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
                transition: 'all 0.3s',
              }}
            >
              {importing ? (t('importDialog.importing') || 'Importing...') : (t('importDialog.selectFile') || 'Select Excel File')}
            </Button>
          </label>
        </Box>
        {importing && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('importDialog.importingData') || 'Importing data...'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} disabled={importing} sx={{ borderRadius: 2 }}>
          {tCommon('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

