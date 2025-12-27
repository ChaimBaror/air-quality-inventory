'use client';

import { useState } from 'react';
import { Box, Tabs, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import ShipmentDashboard from '@/components/shipments/ShipmentDashboard';
import ShipmentTracker from '@/components/shipments/ShipmentTracker';
import TrackersView from '@/components/shipments/TrackersView';
import OrderTracker from '@/components/orders/OrderTracker';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Home() {
  const t = useTranslations('app');
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.5rem' },
              letterSpacing: '-0.01em',
              color: '#1e293b',
            }}
          >
            {t('title') || 'Shipment Tracker - China to USA'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="navigation tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: { xs: 2, sm: 3 },
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              minHeight: 64,
              textTransform: 'none',
              color: '#64748b',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                color: '#6366f1',
                fontWeight: 600,
              },
              '&:hover': {
                color: '#6366f1',
                backgroundColor: '#f1f5f9',
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              backgroundColor: '#6366f1',
            },
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t('dashboardTab') || 'Dashboard'} />
          <Tab label={t('trackerTab') || 'Shipment Tracker'} />
          <Tab label={t('ordersTab') || 'Orders'} />
          <Tab label={t('trackersTab') || 'Multiple Trackers'} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <ShipmentDashboard />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShipmentTracker />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OrderTracker />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TrackersView />
      </TabPanel>
    </Box>
  );
}
