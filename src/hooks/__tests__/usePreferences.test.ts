import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePreferences } from '../usePreferences';

describe('usePreferences', () => {
    const CURRENT_YEAR = new Date().getFullYear();

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should return defaults when nothing is stored', () => {
        const { result } = renderHook(() => usePreferences());
        expect(result.current.sortBy).toBe('name');
        expect(result.current.filterTeams).toBeNull();
        expect(result.current.showHidden).toBe(false);
        expect(result.current.lastCalendarYear).toBe(CURRENT_YEAR);
    });

    it('should load persisted preferences', () => {
        localStorage.setItem('shiftsim_preferences', JSON.stringify({ sortBy: 'hours', showHidden: true }));
        const { result } = renderHook(() => usePreferences());
        expect(result.current.sortBy).toBe('hours');
        expect(result.current.showHidden).toBe(true);
    });

    it('should fall back to defaults on corrupt data', () => {
        localStorage.setItem('shiftsim_preferences', '{bad');
        const { result } = renderHook(() => usePreferences());
        expect(result.current.sortBy).toBe('name');
    });

    it('should update sortBy', () => {
        const { result } = renderHook(() => usePreferences());
        act(() => result.current.setSortBy('weekends'));
        expect(result.current.sortBy).toBe('weekends');
    });

    it('should update filterTeams', () => {
        const { result } = renderHook(() => usePreferences());
        act(() => result.current.setFilterTeams(4));
        expect(result.current.filterTeams).toBe(4);
        act(() => result.current.setFilterTeams(null));
        expect(result.current.filterTeams).toBeNull();
    });

    it('should update showHidden', () => {
        const { result } = renderHook(() => usePreferences());
        act(() => result.current.setShowHidden(true));
        expect(result.current.showHidden).toBe(true);
    });

    it('should persist updates to localStorage', () => {
        const { result } = renderHook(() => usePreferences());
        act(() => result.current.setSortBy('hours'));
        act(() => result.current.setLastCalendarYear(2030));
        const saved = JSON.parse(localStorage.getItem('shiftsim_preferences')!);
        expect(saved.sortBy).toBe('hours');
        expect(saved.lastCalendarYear).toBe(2030);
    });
});