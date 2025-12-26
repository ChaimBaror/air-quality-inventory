'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { mockSamples } from '@/lib/data';
import { Sample } from '@/types';
import { generateNotificationMessage, copyToClipboard, formatDate, getDueDate, getFactoryName, getPONumber } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

export default function WeeklyNotificationGenerator() {
  const t = useTranslations('notifications');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [selectedSamples, setSelectedSamples] = useState<Sample[]>([]);

  // Find samples that need notification (overdue or expected this week)
  const samplesNeedingNotification = useMemo(() => {
    return mockSamples.filter((sample) => {
      const dueDate = getDueDate(sample);
      if (!dueDate) return false;
      const daysUntil = differenceInDays(dueDate instanceof Date ? dueDate : new Date(dueDate), new Date());
      return sample.status === 'overdue' || (sample.status === 'expected_this_week' && daysUntil <= 7);
    });
  }, []);

  const handleGenerateNotifications = () => {
    setSelectedSamples(samplesNeedingNotification);
    setOpen(true);
  };

  const handleCopyAll = async () => {
    const allMessages = selectedSamples
      .map((sample) => generateNotificationMessage(sample))
      .join('\n\n---\n\n');
    
    const success = await copyToClipboard(allMessages);
    if (success) {
      alert(t('messageCopied'));
    }
  };

  const handleCopySingle = async (sample: Sample) => {
    const message = generateNotificationMessage(sample);
    const success = await copyToClipboard(message);
    if (success) {
      alert(t('messageCopied'));
    }
  };

  const handleOpenWhatsApp = (sample: Sample) => {
    const message = generateNotificationMessage(sample);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1e293b',
            mb: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            letterSpacing: '-0.01em',
          }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: '#64748b',
          }}
        >
          {t('description')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={t('samplesRequireNotification', { count: samplesNeedingNotification.length })}
            color={samplesNeedingNotification.length > 0 ? 'error' : 'default'}
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              py: 2.5,
              px: 2,
              borderRadius: 2,
              boxShadow: samplesNeedingNotification.length > 0
                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleGenerateNotifications}
            disabled={samplesNeedingNotification.length === 0}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.75,
              fontWeight: 600,
              fontSize: '0.9375rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {t('generateNotifications')}
          </Button>
        </Box>
      </CardContent>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 2 }}>
          {t('weeklyNotifications', { count: selectedSamples.length })}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={handleCopyAll}
              sx={{
                mb: 2,
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
                transition: 'all 0.2s',
              }}
            >
              {t('copyAllMessages')}
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {selectedSamples.map((sample) => (
              <Box key={sample.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {getFactoryName(sample)} - {getPONumber(sample)} / {sample.style || sample.customer_po || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Due Date: {formatDate(getDueDate(sample))} | Status: {sample.status}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          mt: 1,
                          p: 2,
                          backgroundColor: '#f8fafc',
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
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
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        edge="end"
                        onClick={() => handleCopySingle(sample)}
                        title={tCommon('copy')}
                      >
                        <CopyIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenWhatsApp(sample)}
                        title={t('openWhatsApp')}
                        color="success"
                      >
                        <WhatsAppIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{tCommon('close')}</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

