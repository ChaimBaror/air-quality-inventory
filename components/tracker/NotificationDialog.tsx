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
import { useTranslations } from 'next-intl';
import { Sample } from '@/types';
import { generateNotificationMessage } from '@/lib/utils';

interface NotificationDialogProps {
  open: boolean;
  sample: Sample | null;
  onClose: () => void;
  onCopy: () => void;
}

export default function NotificationDialog({
  open,
  sample,
  onClose,
  onCopy,
}: NotificationDialogProps) {
  const t = useTranslations('sampleTracker');
  const tCommon = useTranslations('common');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 2 }}>
        {t('notificationMessage')} - WeChat/WhatsApp
      </DialogTitle>
      <DialogContent>
        {sample && (
          <Box>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                {generateNotificationMessage(sample)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#fef3c7',
                borderRadius: 2,
                border: '1px solid #fbbf24',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#92400e' }}>
                {t('tip')}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose}>{tCommon('close')}</Button>
        <Button variant="contained" onClick={onCopy} sx={{ borderRadius: 2 }}>
          {tCommon('copy')}
        </Button>
        <Button
          variant="outlined"
          href={`https://wa.me/?text=${encodeURIComponent(
            sample ? generateNotificationMessage(sample) : ''
          )}`}
          target="_blank"
          sx={{ borderRadius: 2 }}
        >
          {t('openWhatsApp')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

