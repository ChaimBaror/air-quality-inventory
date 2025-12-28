'use client';

import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Sample } from '@/types';
import { formatDate, getDueDate, getFactoryName, getPONumber, getFactoryEmail } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  overdue: '#ef4444',
  expected_this_week: '#f59e0b',
  under_review: '#3b82f6',
  completed: '#10b981',
};

interface SampleDetailProps {
  sample: Sample;
  open: boolean;
  onClose: () => void;
}

export default function SampleDetail({ sample, open, onClose }: SampleDetailProps) {
  const t = useTranslations('sampleDetail');
  const tCommon = useTranslations('common');
  const [notes, setNotes] = useState(sample.notes || '');
  const [images, setImages] = useState<string[]>(sample.images || []);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; text: string; timestamp: Date }>>([
    { id: '1', text: 'Sample created', timestamp: sample.createdAt || new Date() },
  ]);

  const STATUS_LABELS: Record<string, string> = {
    overdue: t('status.overdue'),
    expected_this_week: t('status.expectedThisWeek'),
    under_review: t('status.underReview'),
    completed: t('status.completed'),
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSendMessage = () => {
    if (notes.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: notes, timestamp: new Date() },
      ]);
      setNotes('');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 600, md: 700 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          boxShadow: '-8px 0 48px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          height: '100%',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            pb: 3,
            borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            {t('title')}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              '&:hover': {
                backgroundColor: '#ef4444',
                color: 'white',
                transform: 'rotate(90deg) scale(1.1)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Sample Info */}
        <Card
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 16px 48px rgba(99, 102, 241, 0.15)',
            },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('po') || 'PO Number'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {getPONumber(sample)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('customerPo') || 'Customer PO'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {sample.customer_po || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('style') || 'Style'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {sample.style || '-'}
              </Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
              <Typography variant="caption" color="text.secondary">
                {t('factory') || 'Factory'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {getFactoryName(sample)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('sampleStage') || 'Sample Stage'}
              </Typography>
              <Typography variant="body1">{sample.sample_stage || sample.sampleType || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('sampleSize') || 'Sample Size'}
              </Typography>
              <Typography variant="body1">{sample.sample_size || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('owner') || 'Owner'}
              </Typography>
              <Typography variant="body1">{sample.owner || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('factoryEmail') || 'Factory Email'}
              </Typography>
              <Typography variant="body1">{getFactoryEmail(sample) || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('status') || 'Status'}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={STATUS_LABELS[sample.status]}
                  size="small"
                  sx={{
                    backgroundColor: STATUS_COLORS[sample.status],
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: '28px',
                    boxShadow: `0 4px 12px ${STATUS_COLORS[sample.status]}50`,
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('expectedDate') || 'Due Date'}
              </Typography>
              <Typography variant="body1">{formatDate(getDueDate(sample))}</Typography>
            </Box>
            {(sample.date_received || sample.receivedDate) && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('receivedDate') || 'Date Received'}
                </Typography>
                <Typography variant="body1">{formatDate(sample.date_received || sample.receivedDate)}</Typography>
              </Box>
            )}
            {sample.reminder_sent_date && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('reminderSentDate') || 'Reminder Sent Date'}
                </Typography>
                <Typography variant="body1">{formatDate(sample.reminder_sent_date)}</Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* History */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            {t('history')}
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(226, 232, 240, 0.6)',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
            }}
          >
            <List dense>
              {sample.history?.map((entry) => (
                <ListItem key={entry.id}>
                  <ListItemText
                    primary={entry.action}
                    secondary={`${formatDate(entry.timestamp)} ${entry.user ? `- ${entry.user}` : ''}`}
                  />
                </ListItem>
              ))}
              <ListItem>
                <ListItemText
                  primary={t('created')}
                  secondary={formatDate(sample.createdAt)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t('lastUpdated')}
                  secondary={formatDate(sample.updatedAt)}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Image Gallery */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            {t('imageGallery')}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                fullWidth
                sx={{
                  borderRadius: 3,
                  py: 2,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    backgroundColor: '#6366f1',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {t('uploadImages')}
              </Button>
            </label>
          </Box>
          {images.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              {images.map((img, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={img}
                    alt={`Sample image ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </Box>
          )}
          {images.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: 3,
                border: '2px dashed rgba(99, 102, 241, 0.3)',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              <PhotoCameraIcon
                sx={{
                  fontSize: 64,
                  color: '#6366f1',
                  mb: 2,
                  opacity: 0.6,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                {t('noImages')}
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Internal Chat */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            {t('internalNotes')}
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: 3,
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: 3,
              border: '1px solid rgba(226, 232, 240, 0.6)',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {chatMessages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  mb: 2,
                  p: 1.5,
                  backgroundColor: '#f8fafc',
                  borderRadius: 2,
                  '&:last-child': { mb: 0 },
                }}
              >
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  {msg.text}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {formatDate(msg.timestamp)}
                </Typography>
              </Box>
            ))}
          </Paper>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder={t('addNote')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              startIcon={<SendIcon />}
              sx={{
                minWidth: 120,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {tCommon('send')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

