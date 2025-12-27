# 🚀 התחלה מהירה - Quick Start

## תכונות חדשות שנוספו

### 1. הודעות Toast 🔔

```typescript
import { showToast } from '@/lib/toast';

// הצלחה
showToast.success('משלוח נשמר בהצלחה!');

// שגיאה  
showToast.error('שגיאה בשליחת המייל');

// טעינה
const id = showToast.loading('שולח מייל...');
showToast.dismiss(id);
```

### 2. ייצוא PDF 📄

```typescript
import { exportShipmentsToPDF } from '@/lib/pdfExport';

// ייצוא כל המשלוחים
<Button onClick={() => exportShipmentsToPDF(shipments)}>
  ייצא ל-PDF
</Button>

// ייצוא משלוח בודד
<Button onClick={() => exportShipmentDetailToPDF(shipment)}>
  ייצא פרטי משלוח
</Button>
```

### 3. ייצוא Excel משופר 📊

```typescript
import { exportShipmentsToExcel } from '@/lib/enhancedExcelExport';

<Button onClick={() => exportShipmentsToExcel(shipments, {
  includeStats: true,
  autoFilter: true,
  freezeHeader: true,
})}>
  ייצא ל-Excel
</Button>
```

### 4. עימוד (Pagination) 📄

```typescript
import { paginate } from '@/lib/pagination';
import { PaginationControls } from '@/components/common/PaginationControls';

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

const { data, pagination } = paginate(shipments, page, pageSize);

<PaginationControls
  page={page}
  pageSize={pageSize}
  total={pagination.total}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

### 5. פילטרים מתקדמים 🔍

```typescript
import { AdvancedFilters } from '@/components/common/AdvancedFilters';

const [filters, setFilters] = useState({});

<AdvancedFilters
  filters={filters}
  onFiltersChange={setFilters}
  type="shipment"
  availableOptions={{
    owners: ['TOMMY', 'SARAH'],
    carriers: ['DHL', 'FedEx', 'UPS'],
  }}
/>
```

### 6. מצב כהה (Dark Mode) 🌙

```typescript
import { ThemeToggle } from '@/components/common/ThemeToggle';

// הוסף לכותרת
<AppBar>
  <Toolbar>
    <Typography>המערכת שלי</Typography>
    <ThemeToggle />
  </Toolbar>
</AppBar>
```

### 7. מסכי טעינה (Loading Skeletons) ⏳

```typescript
import { TableSkeleton } from '@/components/common/LoadingSkeleton';

if (loading) {
  return <TableSkeleton rows={10} />;
}

return <Table>...</Table>;
```

### 8. גלילה וירטואלית (Virtual Scrolling) ⚡

```typescript
import { VirtualTable } from '@/components/common/VirtualScroll';

<VirtualTable
  data={largeArray}
  estimatedRowHeight={60}
  height={600}
  renderRow={(item) => (
    <Box sx={{ p: 2 }}>
      {item.tracking_number} - {item.supplier}
    </Box>
  )}
/>
```

### 9. Drag & Drop העלאת קבצים 📁

```typescript
import { DragDropUpload } from '@/components/common/DragDropUpload';

<DragDropUpload
  onFileSelect={(file) => {
    console.log('File:', file);
    // Process file...
  }}
  description="גרור קובץ Excel לכאן"
/>
```

### 10. גרפים מתקדמים 📈

```typescript
import { AdvancedCharts } from '@/components/dashboard/AdvancedCharts';

<AdvancedCharts 
  shipments={shipments} 
  orders={orders} 
/>
```

---

## ייבוא מרוכז

במקום לייבא מכל קובץ בנפרד:

```typescript
// ❌ לפני
import { showToast } from '@/lib/toast';
import { exportShipmentsToPDF } from '@/lib/pdfExport';
import { paginate } from '@/lib/pagination';

// ✅ אחרי
import { 
  showToast, 
  exportShipmentsToPDF, 
  paginate 
} from '@/lib';

import {
  ThemeToggle,
  AdvancedFilters,
  TableSkeleton
} from '@/components/common';
```

---

## דוגמה מלאה לשימוש

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';
import {
  showToast,
  exportShipmentsToPDF,
  exportShipmentsToExcel,
  paginate,
} from '@/lib';
import {
  TableSkeleton,
  AdvancedFilters,
  PaginationControls,
  ThemeToggle,
} from '@/components/common';

export default function ShipmentsPage() {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      // ... fetch data
      showToast.success('נטען בהצלחה!');
    } catch (error) {
      showToast.error('שגיאה בטעינה');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <TableSkeleton rows={10} />;

  const filtered = applyFilters(shipments, filters);
  const { data, pagination } = paginate(filtered, page, pageSize);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} mb={2}>
        <Button onClick={() => exportShipmentsToPDF(filtered)}>
          PDF
        </Button>
        <Button onClick={() => exportShipmentsToExcel(filtered)}>
          Excel
        </Button>
        <ThemeToggle />
      </Stack>

      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        type="shipment"
      />

      {/* Your table here */}

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
```

---

## טיפים חשובים 💡

1. **Toast** - תמיד הצג feedback למשתמש
2. **Pagination** - השתמש עם 20-50 פריטים לדף
3. **Virtual Scrolling** - רק עם 100+ פריטים
4. **Filters** - שמור את מצב הפילטרים ב-URL/localStorage
5. **Dark Mode** - יעבוד אוטומטית עם העדפת המערכת

---

## מדריכים מלאים 📚

- [IMPROVEMENTS_GUIDE.md](./IMPROVEMENTS_GUIDE.md) - מדריך מפורט
- [FEATURES_ADDED.md](./FEATURES_ADDED.md) - רשימת תכונות
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - סיכום טכני

---

**זהו! התחל להשתמש בתכונות החדשות 🚀**

