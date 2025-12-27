# מדריך שימוש בשיפורים החדשים - Usage Guide for New Features

## 1. Toast Notifications (הודעות Toast)

### שימוש בסיסי:

```typescript
import { showToast } from '@/lib/toast';

// הצלחה
showToast.success('Shipment created successfully!');

// שגיאה
showToast.error('Failed to send email');

// טעינה
const toastId = showToast.loading('Sending email...');
// ... אחרי סיום
showToast.dismiss(toastId);
showToast.success('Email sent!');

// Promise
await showToast.promise(
  sendEmailAPI(shipmentId),
  {
    loading: 'Sending email...',
    success: 'Email sent successfully!',
    error: 'Failed to send email',
  }
);
```

## 2. Loading Skeletons (מסכי טעינה)

```typescript
import { TableSkeleton, CardSkeleton, DashboardSkeleton, DetailSkeleton } from '@/components/common/LoadingSkeleton';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <TableSkeleton rows={10} />;
  }
  
  return <div>Your content</div>;
}
```

## 3. Advanced Filters (סינון מתקדם)

```typescript
import { AdvancedFilters, ShipmentFilters } from '@/components/common/AdvancedFilters';

function ShipmentList() {
  const [filters, setFilters] = useState<ShipmentFilters>({});
  
  const filteredShipments = applyFilters(shipments, filters);
  
  return (
    <>
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        type="shipment"
        availableOptions={{
          owners: ['TOMMY', 'SARAH'],
          carriers: ['DHL', 'FedEx', 'UPS'],
        }}
      />
      {/* Render filtered shipments */}
    </>
  );
}
```

## 4. Drag & Drop Upload

```typescript
import { DragDropUpload } from '@/components/common/DragDropUpload';

function ImportDialog() {
  const handleFileSelect = (file: File) => {
    // Process file
    console.log('File selected:', file);
  };
  
  return (
    <Dialog open>
      <DialogContent>
        <DragDropUpload
          onFileSelect={handleFileSelect}
          acceptedFileTypes=".xlsx,.xls"
          maxSize={10 * 1024 * 1024}
          description="Drag & drop Excel file here"
        />
      </DialogContent>
    </Dialog>
  );
}
```

## 5. Pagination (עימוד)

```typescript
import { useState } from 'react';
import { paginate } from '@/lib/pagination';
import { PaginationControls } from '@/components/common/PaginationControls';

function ShipmentTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const { data, pagination } = paginate(shipments, page, pageSize);
  
  return (
    <>
      {/* Render data */}
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={pagination.total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
}
```

## 6. Virtual Scrolling (גלילה וירטואלית)

```typescript
import { VirtualTable } from '@/components/common/VirtualScroll';

function LargeShipmentList() {
  return (
    <VirtualTable
      data={largeShipmentArray}
      estimatedRowHeight={60}
      height={600}
      renderRow={(shipment, index) => (
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          {shipment.tracking_number} - {shipment.supplier}
        </Box>
      )}
    />
  );
}
```

## 7. Dark Mode (מצב כהה)

```typescript
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useTheme } from '@/components/common/ThemeProvider';

function Header() {
  const { mode, effectiveMode, toggleMode } = useTheme();
  
  return (
    <AppBar>
      <Toolbar>
        <Typography>My App</Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
```

## 8. PDF Export (ייצוא PDF)

```typescript
import { exportShipmentsToPDF, exportShipmentDetailToPDF } from '@/lib/pdfExport';

function ExportButton() {
  const handleExportAll = () => {
    exportShipmentsToPDF(shipments);
  };
  
  const handleExportSingle = (shipment: Shipment) => {
    exportShipmentDetailToPDF(shipment);
  };
  
  return (
    <>
      <Button onClick={handleExportAll}>Export All to PDF</Button>
      <Button onClick={() => handleExportSingle(selectedShipment)}>
        Export Details to PDF
      </Button>
    </>
  );
}
```

## 9. Enhanced Excel Export (ייצוא Excel משופר)

```typescript
import { exportShipmentsToExcel, exportOrdersToExcel } from '@/lib/enhancedExcelExport';

function ExportMenu() {
  const handleExport = () => {
    exportShipmentsToExcel(shipments, {
      filename: 'my-shipments.xlsx',
      includeStats: true,
      autoFilter: true,
      freezeHeader: true,
    });
  };
  
  return <Button onClick={handleExport}>Export to Excel</Button>;
}
```

## 10. Advanced Charts (גרפים מתקדמים)

```typescript
import { AdvancedCharts } from '@/components/dashboard/AdvancedCharts';

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4">Analytics Dashboard</Typography>
      <AdvancedCharts shipments={shipments} orders={orders} />
    </Box>
  );
}
```

## דוגמה מלאה - Complete Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { showToast } from '@/lib/toast';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { AdvancedFilters, ShipmentFilters } from '@/components/common/AdvancedFilters';
import { PaginationControls } from '@/components/common/PaginationControls';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { exportShipmentsToPDF } from '@/lib/pdfExport';
import { exportShipmentsToExcel } from '@/lib/enhancedExcelExport';
import { paginate } from '@/lib/pagination';

function ImprovedShipmentPage() {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [filters, setFilters] = useState<ShipmentFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      // Load data...
      showToast.success('Shipments loaded successfully');
    } catch (error) {
      showToast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    exportShipmentsToPDF(filteredShipments);
    showToast.success('PDF exported successfully');
  };

  const handleExportExcel = () => {
    exportShipmentsToExcel(filteredShipments, {
      includeStats: true,
      autoFilter: true,
    });
    showToast.success('Excel exported successfully');
  };

  // Apply filters
  const filteredShipments = applyFilters(shipments, filters);
  
  // Paginate
  const { data: paginatedShipments, pagination } = paginate(
    filteredShipments,
    page,
    pageSize
  );

  if (loading) {
    return <TableSkeleton rows={10} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Shipments</Typography>
        <Stack direction="row" spacing={2}>
          <Button onClick={handleExportPDF}>Export PDF</Button>
          <Button onClick={handleExportExcel}>Export Excel</Button>
          <ThemeToggle />
        </Stack>
      </Stack>

      {/* Filters */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        type="shipment"
        availableOptions={{
          owners: ['TOMMY', 'SARAH'],
          carriers: ['DHL', 'FedEx'],
        }}
      />

      {/* Table */}
      {/* ... render table with paginatedShipments ... */}

      {/* Pagination */}
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={pagination.total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Box>
  );
}

export default ImprovedShipmentPage;
```

## טיפים לביצועים - Performance Tips

1. **Virtual Scrolling**: השתמש כאשר יש יותר מ-100 פריטים
2. **Pagination**: הגבל ל-20-50 פריטים לדף
3. **Lazy Loading**: טען קומפוננטות רק כאשר הן נדרשות
4. **Memoization**: השתמש ב-useMemo ו-useCallback לחישובים כבדים
5. **Debouncing**: עבור חיפוש וסינון, השתמש ב-debounce

```typescript
import { useMemo } from 'react';
import { debounce } from 'lodash';

// Memoization
const filteredData = useMemo(() => {
  return applyFilters(data, filters);
}, [data, filters]);

// Debouncing
const debouncedSearch = useMemo(
  () => debounce((term: string) => {
    setSearchTerm(term);
  }, 300),
  []
);
```

