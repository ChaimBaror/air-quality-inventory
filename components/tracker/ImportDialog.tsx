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

interface ImportDialogProps {
  open: boolean;
  importing: boolean;
  onClose: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImportDialog({
  open,
  importing,
  onClose,
  onFileSelect,
}: ImportDialogProps) {
  const t = useTranslations('sampleTracker');
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
        {t('importDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('importDialog.description')}
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
              {t('importDialog.columns')}
            </Typography>
          </Box>
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="excel-upload"
            type="file"
            onChange={onFileSelect}
            disabled={importing}
          />
          <label htmlFor="excel-upload">
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
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                },
                transition: 'all 0.3s',
              }}
            >
              {importing ? t('importDialog.importing') : t('importDialog.selectFile')}
            </Button>
          </label>
        </Box>
        {importing && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('importDialog.importingData')}
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

