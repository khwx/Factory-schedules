import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

function fireKey(key: string, opts: Partial<KeyboardEvent> = {}) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, ...opts }));
}

describe('useKeyboardShortcuts', () => {
    const shortcuts = {
        onUndo: vi.fn(),
        onRedo: vi.fn(),
        onEscape: vi.fn(),
        onDelete: vi.fn(),
        onSearch: vi.fn(),
        onNewScenario: vi.fn(),
        onQuickAction: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should trigger undo on Ctrl/Cmd+Z', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('z', { ctrlKey: true }));
        expect(shortcuts.onUndo).toHaveBeenCalledTimes(1);
    });

    it('should trigger redo on Ctrl/Cmd+Shift+Z', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('z', { ctrlKey: true, shiftKey: true }));
        expect(shortcuts.onRedo).toHaveBeenCalledTimes(1);
    });

    it('should trigger redo on Ctrl/Cmd+Y', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('y', { ctrlKey: true }));
        expect(shortcuts.onRedo).toHaveBeenCalledTimes(1);
    });

    it('should trigger escape', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('Escape'));
        expect(shortcuts.onEscape).toHaveBeenCalledTimes(1);
    });

    it('should trigger delete', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('Delete'));
        expect(shortcuts.onDelete).toHaveBeenCalledTimes(1);
    });

    it('should trigger search on Ctrl/Cmd+F', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('f', { ctrlKey: true }));
        expect(shortcuts.onSearch).toHaveBeenCalledTimes(1);
    });

    it('should trigger new scenario on plain N', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('n'));
        expect(shortcuts.onNewScenario).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger new scenario with ctrl held', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('n', { ctrlKey: true }));
        expect(shortcuts.onNewScenario).not.toHaveBeenCalled();
    });

    it('should trigger quick action for Ctrl+digit', () => {
        renderHook(() => useKeyboardShortcuts(shortcuts));
        act(() => fireKey('3', { ctrlKey: true }));
        expect(shortcuts.onQuickAction).toHaveBeenCalledWith(2);
    });

    it('should ignore shortcuts when typing in an input', () => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        renderHook(() => useKeyboardShortcuts(shortcuts));

        const event = new KeyboardEvent('keydown', {
            key: 'n',
            bubbles: true,
        });
        Object.defineProperty(event, 'target', { value: input });
        window.dispatchEvent(event);
        document.body.removeChild(input);

        expect(shortcuts.onNewScenario).not.toHaveBeenCalled();
    });

    it('should remove listener on unmount', () => {
        const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));
        unmount();
        fireKey('Escape');
        expect(shortcuts.onEscape).not.toHaveBeenCalled();
    });
});