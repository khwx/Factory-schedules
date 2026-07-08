import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
    onUndo?: () => void;
    onRedo?: () => void;
    onEscape?: () => void;
    onDelete?: () => void;
    onSearch?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in input fields
        if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
        ) {
            return;
        }

        // Ctrl/Cmd + Z = Undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            shortcuts.onUndo?.();
        }

        // Ctrl/Cmd + Shift + Z = Redo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            shortcuts.onRedo?.();
        }

        // Ctrl/Cmd + Y = Redo (alternative)
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            shortcuts.onRedo?.();
        }

        // Escape = Close modal/panel
        if (e.key === 'Escape') {
            shortcuts.onEscape?.();
        }

        // Delete/Backspace = Delete selected
        if (e.key === 'Delete' || e.key === 'Backspace') {
            shortcuts.onDelete?.();
        }

        // Ctrl/Cmd + F = Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            shortcuts.onSearch?.();
        }
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
