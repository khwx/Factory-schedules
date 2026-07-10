import { useState, useCallback, useRef } from 'react';

interface UseDragAndDropOptions<T> {
    items: T[];
    onReorder: (items: T[]) => void;
    getItemId: (item: T) => string;
}

interface UseDragAndDropReturn<T> {
    draggedItem: T | null;
    dragOverItem: T | null;
    handleDragStart: (item: T) => void;
    handleDragEnter: (item: T) => void;
    handleDragLeave: () => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleDragEnd: () => void;
    handleKeyboardReorder: (itemId: string, direction: 'up' | 'down') => void;
    isDragging: boolean;
}

export function useDragAndDrop<T>({
    items,
    onReorder,
    getItemId,
}: UseDragAndDropOptions<T>): UseDragAndDropReturn<T> {
    const [draggedItem, setDraggedItem] = useState<T | null>(null);
    const [dragOverItem, setDragOverItem] = useState<T | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragCounterRef = useRef(0);

    const handleDragStart = useCallback((item: T) => {
        setDraggedItem(item);
        setIsDragging(true);
    }, []);

    const handleDragEnter = useCallback((item: T) => {
        dragCounterRef.current++;
        setDragOverItem(item);
    }, []);

    const handleDragLeave = useCallback(() => {
        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
            setDragOverItem(null);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        dragCounterRef.current = 0;

        if (!draggedItem || !dragOverItem) return;

        const draggedId = getItemId(draggedItem);
        const overId = getItemId(dragOverItem);

        if (draggedId === overId) return;

        const draggedIndex = items.findIndex(item => getItemId(item) === draggedId);
        const overIndex = items.findIndex(item => getItemId(item) === overId);

        if (draggedIndex === -1 || overIndex === -1) return;

        const newItems = [...items];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(overIndex, 0, removed);

        onReorder(newItems);
        setDraggedItem(null);
        setDragOverItem(null);
        setIsDragging(false);
    }, [draggedItem, dragOverItem, items, onReorder, getItemId]);

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
        setDragOverItem(null);
        setIsDragging(false);
        dragCounterRef.current = 0;
    }, []);

    const handleKeyboardReorder = useCallback((itemId: string, direction: 'up' | 'down') => {
        const index = items.findIndex(item => getItemId(item) === itemId);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        const newItems = [...items];
        const [removed] = newItems.splice(index, 1);
        newItems.splice(newIndex, 0, removed);
        onReorder(newItems);
    }, [items, onReorder, getItemId]);

    return {
        draggedItem,
        dragOverItem,
        handleDragStart,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        handleKeyboardReorder,
        isDragging,
    };
}

export default useDragAndDrop;
