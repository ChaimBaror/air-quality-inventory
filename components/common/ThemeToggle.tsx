'use client';

import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

/**
 * Theme Toggle Button
 * Allows users to switch between light, dark, and system themes
 */
export function ThemeToggle() {
  const { mode, effectiveMode, setMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'rotate(20deg)',
          },
        }}
      >
        {effectiveMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => handleThemeChange('light')}
          selected={mode === 'light'}
        >
          <ListItemIcon>
            <Brightness7Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleThemeChange('dark')}
          selected={mode === 'dark'}
        >
          <ListItemIcon>
            <Brightness4Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleThemeChange('system')}
          selected={mode === 'system'}
        >
          <ListItemIcon>
            <SettingsBrightnessIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>System</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

