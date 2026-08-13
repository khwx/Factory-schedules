import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from '../useUndoRedo';

describe('useUndoRedo', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('should start with initial state and no history', () => {
        const { result } = renderHook(() => useUndoRedo('initial'));
        expect(result.current.state).toBe('initial');
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
    });

    it('should allow undo and redo', () => {
        const { result } = renderHook(() => useUndoRedo('a'));
        act(() => result.current.setState('b'));
        act(() => result.current.setState('c'));

        expect(result.current.state).toBe('c');
        expect(result.current.canUndo).toBe(true);

        act(() => result.current.undo());
        expect(result.current.state).toBe('b');

        act(() => result.current.undo());
        expect(result.current.state).toBe('a');
        expect(result.current.canUndo).toBe(false);

        act(() => result.current.redo());
        expect(result.current.state).toBe('b');
        expect(result.current.canRedo).toBe(true);
    });

    it('should trim future history when setting new state after undo', () => {
        const { result } = renderHook(() => useUndoRedo('a'));
        act(() => result.current.setState('b'));
        act(() => result.current.setState('c'));
        act(() => result.current.undo());

        act(() => result.current.setState('d'));
        act(() => result.current.redo());
        expect(result.current.state).toBe('d');
    });

    it('should support functional state updates', () => {
        const { result } = renderHook(() => useUndoRedo<number>(0));
        act(() => result.current.setState(prev => prev + 10));
        act(() => result.current.setState(prev => prev + 5));
        expect(result.current.state).toBe(15);
    });

    it('should respect maxHistory option', () => {
        const { result } = renderHook(() => useUndoRedo<number>(0, { maxHistory: 3 }));
        act(() => result.current.setState(1));
        act(() => result.current.setState(2));
        act(() => result.current.setState(3));
        act(() => result.current.setState(4));

        act(() => result.current.undo());
        expect(result.current.state).toBe(3);
        act(() => result.current.undo());
        expect(result.current.state).toBe(2);
        expect(result.current.canUndo).toBe(false);
    });

    it('should clear history', () => {
        const { result } = renderHook(() => useUndoRedo('a'));
        act(() => result.current.setState('b'));
        act(() => result.current.clearHistory());
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
    });

    it('should not undo below initial state', () => {
        const { result } = renderHook(() => useUndoRedo('a'));
        act(() => result.current.undo());
        expect(result.current.state).toBe('a');
    });
});