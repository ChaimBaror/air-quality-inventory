'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';

interface DragDropUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // in bytes
  description?: string;
}

export function DragDropUpload({
  onFileSelect,
  acceptedFileTypes = '.xlsx,.xls',
  maxSize = 10 * 1024 * 1024, // 10MB default
  description = 'Drag & drop Excel file here, or click to select',
}: DragDropUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize,
    multiple: false,
  });

  return (
    <Paper
      {...getRootProps()}
      elevation={0}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : isDragReject ? 'error.main' : 'divider',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: isDragActive ? 'action.hover' : 'background.default',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {isDragActive ? (
          <>
            <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h6" color="primary">
              Drop the file here
            </Typography>
          </>
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.primary">
              {description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accepted formats: {acceptedFileTypes}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </Typography>
          </>
        )}
        
        {isDragReject && (
          <Typography variant="body2" color="error">
            Invalid file type or size
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

