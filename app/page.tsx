'use client';

import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  AppBar, 
  Toolbar, 
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalShipping as ShippingIcon,
  ShoppingCart as OrdersIcon,
  TrackChanges as TrackersIcon,
} from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    { 
      label: t('dashboardTab') || 'Dashboard', 
      icon: <DashboardIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      id: 'dashboard'
    },
    { 
      label: t('trackerTab') || 'Shipment Tracker', 
      icon: <ShippingIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      id: 'tracker'
    },
    { 
      label: t('ordersTab') || 'Orders', 
      icon: <OrdersIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      id: 'orders'
    },
    { 
      label: t('trackersTab') || 'Multiple Trackers', 
      icon: <TrackersIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
      id: 'trackers'
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar 
            disableGutters
            sx={{ 
              py: { xs: 1.5, sm: 2 },
              minHeight: { xs: 56, sm: 64 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                <ShippingIcon 
                  sx={{ 
                    color: '#ffffff',
                    fontSize: { xs: 20, sm: 24 },
                  }} 
                />
              </Box>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1.5rem' },
                  letterSpacing: '-0.02em',
                  color: '#1e293b',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {t('title') || 'Shipment Tracker - China to USA'}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '-0.02em',
                  color: '#1e293b',
                  display: { xs: 'block', sm: 'none' },
                }}
              >
                {t('trackerTab') || 'Shipment Tracker'}
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="navigation tabs"
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 56, sm: 64 },
              '& .MuiTab-root': {
                fontWeight: 500,
                fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                minHeight: { xs: 56, sm: 64 },
                textTransform: 'none',
                color: '#64748b',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: { xs: 0.5, sm: 1 },
                px: { xs: 1.5, sm: 2, md: 3 },
                '&.Mui-selected': {
                  color: '#6366f1',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: '#6366f1',
                  backgroundColor: '#f1f5f9',
                },
                '& .MuiTab-iconWrapper': {
                  marginBottom: { xs: 0, sm: 0.5 },
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: '#6366f1',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              '& .MuiTabs-scrollButtons': {
                color: '#64748b',
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              },
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
                id={`nav-tab-${index}`}
                aria-controls={`nav-tabpanel-${index}`}
                sx={{
                  flexDirection: { xs: 'column', sm: 'row' },
                  '& .MuiTab-iconWrapper': {
                    marginRight: { xs: 0, sm: 1 },
                    marginBottom: { xs: 0.25, sm: 0 },
                  },
                }}
              />
            ))}
          </Tabs>
        </Container>
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
