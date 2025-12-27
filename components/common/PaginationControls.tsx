'use client';

import { Box, Pagination as MuiPagination, Select, MenuItem, FormControl, Typography } from '@mui/material';

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function PaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
        px: 1,
      }}
    >
      {/* Items per page */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <FormControl size="small">
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            sx={{ minWidth: 70 }}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          {startItem}-{endItem} of {total}
        </Typography>
      </Box>

      {/* Pagination */}
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}

