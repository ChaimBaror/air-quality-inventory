'use client';

import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Box, Paper } from '@mui/material';

interface VirtualTableProps<T> {
  data: T[];
  estimatedRowHeight: number;
  renderRow: (item: T, index: number) => React.ReactNode;
  height?: number | string;
  overscan?: number;
}

/**
 * Virtual scrolling table component
 * Renders only visible rows for better performance with large datasets
 */
export function VirtualTable<T>({
  data,
  estimatedRowHeight,
  renderRow,
  height = 600,
  overscan = 5,
}: VirtualTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Paper
      ref={parentRef}
      sx={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => (
          <Box
            key={virtualRow.key}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderRow(data[virtualRow.index], virtualRow.index)}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

/**
 * Virtual list component for simple lists
 */
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  height = 400,
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
  });

  return (
    <Box
      ref={parentRef}
      sx={{
        height,
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <Box
            key={virtualItem.key}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

