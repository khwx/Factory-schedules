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
        // Set drag data for Firefox compatibility
        const dt = new DataTransfer();
        dt.setData('text/plain', getItemId(item));
    }, [getItemId]);

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

    return {
        draggedItem,
        dragOverItem,
        handleDragStart,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        isDragging,
    };
}

export default useDragAndDrop;
