'use client';

import { Card, CardContent, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const t = useTranslations('sampleTracker');

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <TextField
          fullWidth
          placeholder={placeholder || t('searchPlaceholder')}
          variant="outlined"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8', fontSize: '1.25rem' }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onChange('')}
                  sx={{
                    color: '#94a3b8',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#ffffff',
                '& fieldset': {
                  borderColor: '#cbd5e1',
                },
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
                '& fieldset': {
                  borderColor: '#6366f1',
                  borderWidth: '2px',
                },
              },
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

