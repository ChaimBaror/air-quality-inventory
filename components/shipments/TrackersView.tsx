'use client';

import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Chip, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import ShipmentTracker from './ShipmentTracker';

interface Tracker {
  id: string;
  name: string;
  filters: {
    owner?: string;
    status?: string;
    supplier?: string;
  };
}

export default function TrackersView() {
  const t = useTranslations('trackers');
  const [trackers, setTrackers] = useState<Tracker[]>([
    { id: '1', name: 'All Shipments', filters: {} },
    { id: '2', name: 'TOMMY\'s Shipments', filters: { owner: 'TOMMY' } },
    { id: '3', name: 'Delayed Shipments', filters: { status: 'delayed' } },
  ]);
  const [activeTracker, setActiveTracker] = useState<string>('1');

  const handleAddTracker = () => {
    const newTracker: Tracker = {
      id: `tracker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Tracker ${trackers.length + 1}`,
      filters: {},
    };
    setTrackers([...trackers, newTracker]);
    setActiveTracker(newTracker.id);
  };

  const handleDeleteTracker = (id: string) => {
    if (trackers.length <= 1) {
      alert('Cannot delete the last tracker');
      return;
    }
    setTrackers(trackers.filter(t => t.id !== id));
    if (activeTracker === id) {
      setActiveTracker(trackers[0].id);
    }
  };

  const handleEditTracker = () => {
    // TODO: Implement edit dialog
  };

  const currentTracker = trackers.find(t => t.id === activeTracker);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Box sx={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            {t('title') || 'Multiple Trackers'}
          </Typography>
          <IconButton
            onClick={handleAddTracker}
            sx={{
              backgroundColor: '#6366f1',
              color: 'white',
              '&:hover': {
                backgroundColor: '#4f46e5',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Tabs
          value={activeTracker}
          onChange={(_, newValue) => setActiveTracker(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: { xs: 2, sm: 3 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 64,
              '&.Mui-selected': {
                fontWeight: 600,
              },
            },
          }}
        >
          {trackers.map((tracker) => (
            <Tab
              key={tracker.id}
              value={tracker.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{tracker.name}</span>
                  {trackers.length > 1 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTracker();
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTracker(tracker.id);
                        }}
                        sx={{ p: 0.5, color: '#ef4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {currentTracker && (
          <Box sx={{ mb: 2, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentTracker.filters.owner && (
                <Chip
                  label={`Owner: ${currentTracker.filters.owner}`}
                  size="small"
                  sx={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}
                />
              )}
              {currentTracker.filters.status && (
                <Chip
                  label={`Status: ${currentTracker.filters.status}`}
                  size="small"
                  sx={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}
                />
              )}
              {currentTracker.filters.supplier && (
                <Chip
                  label={`Supplier: ${currentTracker.filters.supplier}`}
                  size="small"
                  sx={{ backgroundColor: '#d1fae5', color: '#10b981' }}
                />
              )}
            </Box>
          </Box>
        )}
        <ShipmentTracker />
      </Box>
    </Box>
  );
}

