import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'shiftsim_preferences';

export interface UserPreferences {
    sortBy: 'name' | 'weekends' | 'hours';
    filterTeams: number | null;
    showHidden: boolean;
    lastCalendarYear: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    sortBy: 'name',
    filterTeams: null,
    showHidden: false,
    lastCalendarYear: new Date().getFullYear(),
};

function loadPreferences(): UserPreferences {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_PREFERENCES };
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
        return { ...DEFAULT_PREFERENCES };
    }
}

function savePreferences(prefs: UserPreferences): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
        // Quota exceeded, silently fail
    }
}

export function usePreferences() {
    const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

    useEffect(() => {
        savePreferences(preferences);
    }, [preferences]);

    const setSortBy = useCallback((sortBy: UserPreferences['sortBy']) => {
        setPreferences(prev => ({ ...prev, sortBy }));
    }, []);

    const setFilterTeams = useCallback((filterTeams: UserPreferences['filterTeams']) => {
        setPreferences(prev => ({ ...prev, filterTeams }));
    }, []);

    const setShowHidden = useCallback((showHidden: UserPreferences['showHidden']) => {
        setPreferences(prev => ({ ...prev, showHidden }));
    }, []);

    const setLastCalendarYear = useCallback((lastCalendarYear: UserPreferences['lastCalendarYear']) => {
        setPreferences(prev => ({ ...prev, lastCalendarYear }));
    }, []);

    return {
        ...preferences,
        setSortBy,
        setFilterTeams,
        setShowHidden,
        setLastCalendarYear,
    };
}