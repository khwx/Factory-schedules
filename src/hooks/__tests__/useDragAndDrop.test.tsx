import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '../useDragAndDrop';

const items = [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C' },
];

function makeHook() {
    const onReorder = vi.fn();
    const { result } = renderHook(() =>
        useDragAndDrop({ items, onReorder, getItemId: item => item.id })
    );
    return { result, onReorder };
}

describe('useDragAndDrop', () => {
    it('should start with no dragged item', () => {
        const { result } = makeHook();
        expect(result.current.draggedItem).toBeNull();
        expect(result.current.dragOverItem).toBeNull();
        expect(result.current.isDragging).toBe(false);
    });

    it('should set dragged item on dragStart', () => {
        const { result } = makeHook();
        act(() => result.current.handleDragStart(items[0]));
        expect(result.current.draggedItem).toEqual(items[0]);
        expect(result.current.isDragging).toBe(true);
    });

    it('should set dragOverItem on dragEnter and clear on dragEnd', () => {
        const { result } = makeHook();
        act(() => result.current.handleDragStart(items[0]));
        act(() => result.current.handleDragEnter(items[1]));
        expect(result.current.dragOverItem).toEqual(items[1]);
        act(() => result.current.handleDragEnd());
        expect(result.current.draggedItem).toBeNull();
        expect(result.current.dragOverItem).toBeNull();
        expect(result.current.isDragging).toBe(false);
    });

    it('should prevent default on dragOver', () => {
        const { result } = makeHook();
        const e = { preventDefault: vi.fn(), dataTransfer: {} } as unknown as React.DragEvent;
        act(() => result.current.handleDragOver(e));
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('should reorder items on drop', () => {
        const { result, onReorder } = makeHook();
        act(() => result.current.handleDragStart(items[0]));
        act(() => result.current.handleDragEnter(items[1]));
        const e = { preventDefault: vi.fn() } as unknown as React.DragEvent;
        act(() => result.current.handleDrop(e));
        expect(onReorder).toHaveBeenCalledTimes(1);
        expect(onReorder.mock.calls[0][0].map((i: { id: string }) => i.id)).toEqual(['b', 'a', 'c']);
        expect(result.current.draggedItem).toBeNull();
    });

    it('should do nothing on drop when same item', () => {
        const { result, onReorder } = makeHook();
        act(() => result.current.handleDragStart(items[1]));
        act(() => result.current.handleDragEnter(items[1]));
        const e = { preventDefault: vi.fn() } as unknown as React.DragEvent;
        act(() => result.current.handleDrop(e));
        expect(onReorder).not.toHaveBeenCalled();
    });

    it('should do nothing on drop with no dragged item', () => {
        const { result, onReorder } = makeHook();
        const e = { preventDefault: vi.fn() } as unknown as React.DragEvent;
        act(() => result.current.handleDrop(e));
        expect(onReorder).not.toHaveBeenCalled();
    });

    it('should move item up and down via keyboard', () => {
        const { result, onReorder } = makeHook();
        act(() => result.current.handleKeyboardReorder('b', 'up'));
        expect(onReorder.mock.calls[0][0].map((i: { id: string }) => i.id)).toEqual(['b', 'a', 'c']);
        act(() => result.current.handleKeyboardReorder('b', 'down'));
        expect(onReorder.mock.calls[1][0].map((i: { id: string }) => i.id)).toEqual(['a', 'c', 'b']);
    });

    it('should not move first item up or last item down', () => {
        const { result, onReorder } = makeHook();
        act(() => result.current.handleKeyboardReorder('a', 'up'));
        act(() => result.current.handleKeyboardReorder('c', 'down'));
        expect(onReorder).not.toHaveBeenCalled();
    });
});