'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { FileUpload as FileUploadIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

interface ImportShipmentDialogProps {
  open: boolean;
  importing: boolean;
  onClose: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImportShipmentDialog({
  open,
  importing,
  onClose,
  onFileSelect,
}: ImportShipmentDialogProps) {
  const t = useTranslations('shipments');
  const tCommon = useTranslations('common');

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
        {t('importDialog.title') || 'Import Shipments from Excel'}
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
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {t('importDialog.columns') || 'Tracking Number, Carrier, PO Number, Supplier, Origin City, Destination City, Status, Expected Delivery Date, Owner'}
            </Typography>
          </Box>
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="excel-upload-shipments"
            type="file"
            onChange={onFileSelect}
            disabled={importing}
          />
          <label htmlFor="excel-upload-shipments">
            <Button
              variant="outlined"
              component="span"
              startIcon={<FileUploadIcon />}
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

