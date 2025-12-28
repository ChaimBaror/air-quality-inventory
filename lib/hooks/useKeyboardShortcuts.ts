/**
 * Keyboard Shortcuts Hook
 * Add keyboard shortcuts to your components
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    shortcuts.forEach(shortcut => {
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const matchesCtrl = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
        event.preventDefault();
        shortcut.action();
      }
    });
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Common keyboard shortcuts
 */
export const commonShortcuts = {
  save: (action: () => void): KeyboardShortcut => ({
    key: 's',
    ctrl: true,
    action,
    description: 'Save (Ctrl+S)',
  }),
  
  export: (action: () => void): KeyboardShortcut => ({
    key: 'e',
    ctrl: true,
    action,
    description: 'Export (Ctrl+E)',
  }),
  
  search: (action: () => void): KeyboardShortcut => ({
    key: 'f',
    ctrl: true,
    action,
    description: 'Search (Ctrl+F)',
  }),
  
  refresh: (action: () => void): KeyboardShortcut => ({
    key: 'r',
    ctrl: true,
    action,
    description: 'Refresh (Ctrl+R)',
  }),
  
  escape: (action: () => void): KeyboardShortcut => ({
    key: 'Escape',
    action,
    description: 'Close (Esc)',
  }),
};

/**
 * Example usage:
 * 
 * function MyComponent() {
 *   useKeyboardShortcuts([
 *     commonShortcuts.save(() => handleSave()),
 *     commonShortcuts.export(() => handleExport()),
 *     { key: 'n', ctrl: true, action: () => setDialogOpen(true) },
 *   ]);
 * }
 */


