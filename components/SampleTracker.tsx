'use client';

import { useState, useMemo } from 'react';
import { Box, Card, Chip, Button, Typography, Alert, Snackbar, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Download as DownloadIcon, Upload as UploadIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { mockSamples, getOwners } from '@/lib/data';
import { Sample, SampleStatus } from '@/types';
import { generateNotificationMessage, copyToClipboard } from '@/lib/utils';
import { exportToExcel, importFromExcel } from '@/lib/excelUtils';
import SampleDetail from './SampleDetail';
import SearchBar from './common/SearchBar';
import SampleTable from './tracker/SampleTable';
import NotificationDialog from './tracker/NotificationDialog';
import ImportDialog from './tracker/ImportDialog';

export default function SampleTracker() {
  const t = useTranslations('sampleTracker');
  const [samples, setSamples] = useState<Sample[]>(mockSamples);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<SampleStatus | 'all'>('all');
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [notificationDialog, setNotificationDialog] = useState<{ open: boolean; sample: Sample | null }>({
    open: false,
    sample: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [importDialog, setImportDialog] = useState(false);
  const [importing, setImporting] = useState(false);

  const owners = useMemo(() => getOwners(samples), [samples]);

  const filteredSamples = useMemo(() => {
    let filtered = samples;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sample) =>
          (sample.po_number || sample.po || '').toLowerCase().includes(query) ||
          (sample.customer_po || '').toLowerCase().includes(query) ||
          (sample.style || '').toLowerCase().includes(query) ||
          (sample.factory || sample.factoryName || '').toLowerCase().includes(query) ||
          (sample.sample_stage || sample.sampleType || '').toLowerCase().includes(query)
      );
    }

    // Filter by owner
    if (filterOwner !== 'all') {
      filtered = filtered.filter((sample) => sample.owner === filterOwner);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((sample) => sample.status === filterStatus);
    }

    return filtered;
  }, [samples, searchQuery, filterOwner, filterStatus]);

  const handleEditDate = (sample: Sample, field: 'expectedDate' | 'receivedDate') => {
    setEditingCell({ id: sample.id, field });
    const currentValue = sample[field];
    if (currentValue) {
      const date = new Date(currentValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setEditValue(`${year}-${month}-${day}`);
    } else {
      setEditValue('');
    }
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    const newDate = new Date(editValue);
    if (!isNaN(newDate.getTime()) && editingCell.field === 'expectedDate') {
      setSamples((prevSamples) =>
        prevSamples.map((sample) =>
          sample.id === editingCell.id
            ? { ...sample, expectedDate: newDate, updatedAt: new Date() }
            : sample
        )
      );
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleShare = (sample: Sample) => {
    setNotificationDialog({ open: true, sample });
  };

  const handleCopyMessage = async () => {
    if (!notificationDialog.sample) return;
    const message = generateNotificationMessage(notificationDialog.sample);
    const success = await copyToClipboard(message);
    if (success) {
      setSnackbar({ open: true, message: t('messageCopied') });
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(samples, 'samples_export');
      setSnackbar({ open: true, message: t('exportSuccess') });
    } catch {
      setSnackbar({ open: true, message: t('exportError') });
    }
  };

  const handleImportFromExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const importedSamples = await importFromExcel(file);
      setSamples((prev) => [...prev, ...importedSamples]);
      setSnackbar({ open: true, message: t('importSuccess', { count: importedSamples.length }) });
      setImportDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: t('importError', { error: error instanceof Error ? error.message : 'Unknown error' }) });
    } finally {
      setImporting(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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
              {t('title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {t('subtitle') || 'Manage and track your sample inventory'}
            </Typography>
          </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip
                  label={t('samples', { count: filteredSamples.length })}
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
                  {t('exportToExcel')}
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
                  {t('importFromExcel')}
                </Button>
              </Box>
            </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '300px' } }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
                sx={{
                  borderRadius: 2,
                }}
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
                onChange={(e) => setFilterStatus(e.target.value as SampleStatus | 'all')}
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="all">{t('allStatuses') || 'All Statuses'}</MenuItem>
                <MenuItem value="overdue">{t('status.overdue')}</MenuItem>
                <MenuItem value="expected_this_week">{t('status.expectedThisWeek')}</MenuItem>
                <MenuItem value="under_review">{t('status.underReview')}</MenuItem>
                <MenuItem value="completed">{t('status.completed')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {filteredSamples.length > 0 ? (
            <SampleTable
              samples={filteredSamples}
              editingCell={editingCell}
              editValue={editValue}
              onEditChange={setEditValue}
              onSaveEdit={handleSaveEdit}
              onEditDate={handleEditDate}
              onShare={handleShare}
              onView={setSelectedSample}
            />
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
                {t('noResults')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {t('tryDifferentSearch')}
              </Typography>
            </Card>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ open: false, message: '' })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            TransitionProps={{ direction: 'up' }}
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

          <NotificationDialog
            open={notificationDialog.open}
            sample={notificationDialog.sample}
            onClose={() => setNotificationDialog({ open: false, sample: null })}
            onCopy={handleCopyMessage}
          />

          <ImportDialog
            open={importDialog}
            importing={importing}
            onClose={() => setImportDialog(false)}
            onFileSelect={handleImportFromExcel}
          />

      {/* Sample Detail Drawer */}
      {selectedSample && (
        <SampleDetail
          sample={selectedSample}
          open={!!selectedSample}
          onClose={() => setSelectedSample(null)}
        />
      )}
      </Box>
    </Box>
  );
}

