'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import {
  Share as ShareIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Sample, SampleStatus } from '@/types';
import { formatDate, getDueDate, getFactoryName, getPONumber } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import StatusChip from '../common/StatusChip';

const STATUS_COLORS: Record<SampleStatus, string> = {
  overdue: '#ef4444',
  expected_this_week: '#f59e0b',
  under_review: '#3b82f6',
  completed: '#10b981',
};

interface SampleTableProps {
  samples: Sample[];
  editingCell: { id: string; field: string } | null;
  editValue: string;
  onEditChange: (value: string) => void;
  onSaveEdit: () => void;
  onEditDate: (sample: Sample, field: 'expectedDate' | 'receivedDate') => void;
  onShare: (sample: Sample) => void;
  onView: (sample: Sample) => void;
}

export default function SampleTable({
  samples,
  editingCell,
  editValue,
  onEditChange,
  onSaveEdit,
  onEditDate,
  onShare,
  onView,
}: SampleTableProps) {
  const t = useTranslations('sampleTracker');
  const tCommon = useTranslations('common');

  const STATUS_LABELS: Record<SampleStatus, string> = {
    overdue: t('status.overdue'),
    expected_this_week: t('status.expectedThisWeek'),
    under_review: t('status.underReview'),
    completed: t('status.completed'),
  };

  const getRowColor = (sample: Sample) => {
    const dueDate = getDueDate(sample);
    if (!dueDate) return 'transparent';
    const daysUntil = differenceInDays(dueDate, new Date());
    if (daysUntil < 0) return '#fee2e2';
    if (daysUntil <= 3) return '#fef3c7';
    return 'transparent';
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#f8fafc',
              '& .MuiTableCell-head': {
                fontWeight: 600,
                color: '#475569',
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #e2e8f0',
                py: 2,
                whiteSpace: 'nowrap',
              },
            }}
          >
            <TableCell>{t('columns.po')}</TableCell>
            <TableCell>{t('columns.customerPo') || 'Customer PO'}</TableCell>
            <TableCell>{t('columns.factory')}</TableCell>
            <TableCell>{t('columns.sampleStage') || 'Sample Stage'}</TableCell>
            <TableCell>{t('columns.sampleSize') || 'Sample Size'}</TableCell>
            <TableCell>{t('columns.owner') || 'Owner'}</TableCell>
            <TableCell>{t('columns.status')}</TableCell>
            <TableCell>{t('columns.expectedDate')}</TableCell>
            <TableCell>{t('columns.receivedDate')}</TableCell>
            <TableCell>{t('columns.reminderSent') || 'Reminder Sent'}</TableCell>
            <TableCell align="center">{t('columns.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {samples.map((sample, index) => (
            <TableRow
              key={sample.id}
              sx={{
                backgroundColor: getRowColor(sample),
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                borderLeft: '4px solid transparent',
                animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
                '@keyframes fadeIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(10px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  '& .MuiTableCell-root': {
                    color: '#1e293b',
                  },
                },
                '& .MuiTableCell-root': {
                  color: '#475569',
                  borderColor: '#e2e8f0',
                },
                '& .MuiTableCell-root': {
                  transition: 'color 0.2s ease',
                  py: 2,
                },
              }}
              onClick={() => onView(sample)}
            >
              <TableCell>{getPONumber(sample)}</TableCell>
              <TableCell>{sample.customer_po || '-'}</TableCell>
              <TableCell>{getFactoryName(sample)}</TableCell>
              <TableCell>{sample.sample_stage || sample.sampleType || '-'}</TableCell>
              <TableCell>{sample.sample_size || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={sample.owner || '-'}
                  size="small"
                  sx={{
                    backgroundColor: '#e0e7ff',
                    color: '#6366f1',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>
                <StatusChip status={sample.status} label={STATUS_LABELS[sample.status]} />
              </TableCell>
              <TableCell>
                {editingCell?.id === sample.id && editingCell.field === 'due_date' ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      type="date"
                      value={editValue}
                      onChange={(e) => onEditChange(e.target.value)}
                      onBlur={onSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onSaveEdit();
                      }}
                      autoFocus
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDate(sample, 'expectedDate');
                    }}
                  >
                    {formatDate(getDueDate(sample))}
                    <EditIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                  </Box>
                )}
              </TableCell>
              <TableCell>
                {sample.date_received || sample.receivedDate ? (
                  formatDate(sample.date_received || sample.receivedDate)
                ) : (
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {t('notReceived')}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {sample.reminder_sent_date ? (
                  formatDate(sample.reminder_sent_date)
                ) : (
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {t('notSent') || 'Not sent'}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title={t('shareToWeChat')} arrow placement="top">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(sample);
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          transform: 'scale(1.15)',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={tCommon('details')} arrow placement="top">
                    <IconButton
                      size="small"
                      color="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(sample);
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'scale(1.15)',
                          color: 'primary.main',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

