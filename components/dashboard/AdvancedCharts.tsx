'use client';

import { Card, CardContent, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Shipment, Order } from '@/types';
import { format, subDays, startOfDay } from 'date-fns';
import { useState } from 'react';

interface AdvancedChartsProps {
  shipments: Shipment[];
  orders: Order[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

/**
 * Advanced Analytics Charts
 * Includes trend analysis, status distribution, and value tracking
 */
export function AdvancedCharts({ shipments, orders }: AdvancedChartsProps) {
  const [timeRange, setTimeRange] = useState<number>(30); // days

  // Prepare shipment trend data
  const shipmentTrendData = (() => {
    const days = timeRange;
    const data: { date: string; shipped: number; delivered: number; delayed: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'MMM dd');
      
      const shipped = shipments.filter(s => {
        const shipDate = startOfDay(new Date(s.ship_date));
        return shipDate.getTime() === date.getTime();
      }).length;
      
      const delivered = shipments.filter(s => {
        if (!s.actual_delivery_date) return false;
        const deliveryDate = startOfDay(new Date(s.actual_delivery_date));
        return deliveryDate.getTime() === date.getTime();
      }).length;
      
      const delayed = shipments.filter(s => {
        const expectedDate = startOfDay(new Date(s.expected_delivery_date));
        return s.status === 'delayed' && expectedDate.getTime() === date.getTime();
      }).length;
      
      data.push({ date: dateStr, shipped, delivered, delayed });
    }
    
    return data;
  })();

  // Status distribution
  const statusDistribution = (() => {
    const statuses = ['pending', 'in_transit', 'in_customs', 'delayed', 'delivered', 'exception'];
    return statuses.map(status => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: shipments.filter(s => s.status === status).length,
    }));
  })();

  // Value tracking by carrier
  const valueByCarrier = (() => {
    const carriers = ['DHL', 'FedEx', 'UPS', 'USPS', 'China Post', 'SF Express', 'Other'];
    return carriers.map(carrier => ({
      carrier,
      value: shipments
        .filter(s => s.carrier === carrier && s.value)
        .reduce((sum, s) => sum + (s.value || 0), 0),
      count: shipments.filter(s => s.carrier === carrier).length,
    })).filter(c => c.count > 0);
  })();

  // Order value trend
  const orderValueTrend = (() => {
    const days = timeRange;
    const data: { date: string; value: number; orders: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'MMM dd');
      
      const dayOrders = orders.filter(o => {
        const orderDate = startOfDay(new Date(o.order_date));
        return orderDate.getTime() === date.getTime();
      });
      
      const value = dayOrders.reduce((sum, o) => sum + o.total_value, 0);
      
      data.push({
        date: dateStr,
        value: Math.round(value),
        orders: dayOrders.length,
      });
    }
    
    return data;
  })();

  // Order status distribution
  const orderStatusDistribution = (() => {
    const statuses = ['draft', 'pending', 'confirmed', 'in_production', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'];
    return statuses.map(status => ({
      name: status.replace('_', ' ').toUpperCase(),
      value: orders.filter(o => o.status === status).length,
    })).filter(s => s.value > 0);
  })();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Time Range Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            label="Time Range"
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={14}>Last 14 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={60}>Last 60 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Shipment Trend Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shipment Activity Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={shipmentTrendData}>
              <defs>
                <linearGradient id="colorShipped" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="shipped"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorShipped)"
              />
              <Area
                type="monotone"
                dataKey="delivered"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorDelivered)"
              />
              <Area
                type="monotone"
                dataKey="delayed"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorDelayed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Status Distribution */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shipment Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Value by Carrier */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shipment Value by Carrier
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valueByCarrier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="carrier" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" name="Total Value (USD)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Order Value Trend */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Value Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderValueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={2}
                name="Value (USD)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                name="Number of Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Status Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6">
                {orderStatusDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

