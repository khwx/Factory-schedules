import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions {
    maxHistory?: number;
}

interface UseUndoRedoReturn<T> {
    state: T;
    setState: (newState: T | ((prev: T) => T)) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    clearHistory: () => void;
}

export function useUndoRedo<T>(
    initialState: T,
    options: UseUndoRedoOptions = {}
): UseUndoRedoReturn<T> {
    const { maxHistory = 50 } = options;

    const [state, setInternalState] = useState<T>(initialState);
    const historyRef = useRef<T[]>([initialState]);
    const currentIndexRef = useRef<number>(0);

    const setState = useCallback((newState: T | ((prev: T) => T)) => {
        setInternalState((currentState) => {
            const resolvedState = newState instanceof Function ? newState(currentState) : newState;

            // Trim future history if we're not at the end
            const newHistory = historyRef.current.slice(0, currentIndexRef.current + 1);
            newHistory.push(resolvedState);

            // Trim history if it exceeds max length
            if (newHistory.length > maxHistory) {
                newHistory.shift();
            } else {
                currentIndexRef.current++;
            }

            historyRef.current = newHistory;
            return resolvedState;
        });
    }, [maxHistory]);

    const undo = useCallback(() => {
        if (currentIndexRef.current > 0) {
            currentIndexRef.current--;
            const previousState = historyRef.current[currentIndexRef.current];
            setInternalState(previousState);
        }
    }, []);

    const redo = useCallback(() => {
        if (currentIndexRef.current < historyRef.current.length - 1) {
            currentIndexRef.current++;
            const nextState = historyRef.current[currentIndexRef.current];
            setInternalState(nextState);
        }
    }, []);

    const clearHistory = useCallback(() => {
        historyRef.current = [state];
        currentIndexRef.current = 0;
    }, [state]);

    const canUndo = currentIndexRef.current > 0;
    const canRedo = currentIndexRef.current < historyRef.current.length - 1;

    return {
        state,
        setState,
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
    };
}

export default useUndoRedo;
