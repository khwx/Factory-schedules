import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should return initialValue when nothing is stored', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 42));
        expect(result.current[0]).toBe(42);
    });

    it('should read stored value from localStorage', () => {
        localStorage.setItem('test-key', JSON.stringify('stored'));
        const { result } = renderHook(() => useLocalStorage<string>('test-key', 'default'));
        expect(result.current[0]).toBe('stored');
    });

    it('should write value to localStorage on set', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', ''));
        act(() => result.current[1]('new value'));
        expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new value');
    });

    it('should support functional updates', () => {
        const { result } = renderHook(() => useLocalStorage<number>('counter', 0));
        act(() => result.current[1](prev => prev + 5));
        expect(result.current[0]).toBe(5);
        expect(JSON.parse(localStorage.getItem('counter')!)).toBe(5);
    });

    it('should fall back to initialValue when JSON is corrupted', () => {
        localStorage.setItem('corrupt', '{not valid json');
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { result } = renderHook(() => useLocalStorage('corrupt', 'fallback'));
        expect(result.current[0]).toBe('fallback');
        expect(spy).toHaveBeenCalled();
    });

    it('should silently handle quota exceeded on write', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceededError');
        });
        const { result } = renderHook(() => useLocalStorage('quota', 1));
        act(() => result.current[1](2));
        expect(spy).toHaveBeenCalled();
    });
});