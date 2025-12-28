'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Stack,
  Paper,
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ShipmentStatus, OrderStatus, Carrier } from '@/types';

export interface ShipmentFilters {
  status?: ShipmentStatus[];
  carrier?: Carrier[];
  owner?: string[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  supplier?: string[];
  owner?: string[];
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

interface AdvancedFiltersProps<T> {
  filters: T;
  onFiltersChange: (filters: T) => void;
  type: 'shipment' | 'order';
  availableOptions?: {
    owners?: string[];
    suppliers?: string[];
    carriers?: Carrier[];
  };
}

export function AdvancedFilters<T extends ShipmentFilters | OrderFilters>({
  filters,
  onFiltersChange,
  type,
  availableOptions = {},
}: AdvancedFiltersProps<T>) {
  const [expanded, setExpanded] = useState(false);

  const handleStatusChange = (status: string[]) => {
    onFiltersChange({ ...filters, status: status.length > 0 ? (status as ShipmentStatus[] | OrderStatus[]) : undefined } as T);
  };

  const handleCarrierChange = (carriers: string[]) => {
    onFiltersChange({ ...filters, carrier: carriers.length > 0 ? carriers as Carrier[] : undefined } as T);
  };

  const handleOwnerChange = (owners: string[]) => {
    onFiltersChange({ ...filters, owner: owners.length > 0 ? owners : undefined });
  };

  const handleSupplierChange = (suppliers: string[]) => {
    onFiltersChange({ ...filters, supplier: suppliers.length > 0 ? suppliers : undefined } as T);
  };

  const handleDateFromChange = (date: string) => {
    onFiltersChange({ ...filters, dateFrom: date || undefined });
  };

  const handleDateToChange = (date: string) => {
    onFiltersChange({ ...filters, dateTo: date || undefined });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, searchTerm: search || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({} as T);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const shipmentStatuses: ShipmentStatus[] = ['pending', 'in_transit', 'in_customs', 'delayed', 'delivered', 'exception'];
  const orderStatuses: OrderStatus[] = ['draft', 'pending', 'confirmed', 'in_production', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'];

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: expanded ? 2 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="action" />
          <Button
            variant="text"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ textTransform: 'none' }}
          >
            Advanced Filters
            {hasActiveFilters && (
              <Chip
                label={Object.keys(filters).length}
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Button>
        </Box>
        
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            sx={{ textTransform: 'none' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Collapse in={expanded}>
        <Stack spacing={2}>
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            label="Search"
            placeholder={type === 'shipment' ? 'Search tracking #, PO #, supplier...' : 'Search PO #, supplier...'}
            value={filters.searchTerm || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            {/* Status Filter */}
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filters.status || []}
                onChange={(e) => handleStatusChange(e.target.value as string[])}
                label="Status"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {(type === 'shipment' ? shipmentStatuses : orderStatuses).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Carrier Filter (only for shipments) */}
            {type === 'shipment' && (
              <FormControl size="small" fullWidth>
                <InputLabel>Carrier</InputLabel>
                <Select
                  multiple
                  value={(filters as ShipmentFilters).carrier || []}
                  onChange={(e) => handleCarrierChange(e.target.value as string[])}
                  label="Carrier"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {(availableOptions.carriers || ['DHL', 'FedEx', 'UPS', 'USPS', 'China Post', 'SF Express', 'Other']).map((carrier) => (
                    <MenuItem key={carrier} value={carrier}>
                      {carrier}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Supplier Filter (only for orders) */}
            {type === 'order' && availableOptions.suppliers && (
              <FormControl size="small" fullWidth>
                <InputLabel>Supplier</InputLabel>
                <Select
                  multiple
                  value={(filters as OrderFilters).supplier || []}
                  onChange={(e) => handleSupplierChange(e.target.value as string[])}
                  label="Supplier"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableOptions.suppliers.map((supplier) => (
                    <MenuItem key={supplier} value={supplier}>
                      {supplier}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Owner Filter */}
            {availableOptions.owners && (
              <FormControl size="small" fullWidth>
                <InputLabel>Owner</InputLabel>
                <Select
                  multiple
                  value={filters.owner || []}
                  onChange={(e) => handleOwnerChange(e.target.value as string[])}
                  label="Owner"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableOptions.owners.map((owner) => (
                    <MenuItem key={owner} value={owner}>
                      {owner}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Date Range */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              size="small"
              type="date"
              label="Date From"
              value={filters.dateFrom || ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              type="date"
              label="Date To"
              value={filters.dateTo || ''}
              onChange={(e) => handleDateToChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Stack>
      </Collapse>
    </Paper>
  );
}

