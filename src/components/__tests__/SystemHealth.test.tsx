import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SystemHealth from '../SystemHealth';
import type { Scenario } from '../../types';

vi.mock('../../utils/calendar', () => ({
    generateYearCalendar: () => Array.from({ length: 365 }, () => ({ shift: 'F', isWeekend: false, isWeekendOff: true })),
}));

vi.mock('../../utils/portugueseHolidays', () => ({
    getAllHolidays: () => Array.from({ length: 12 }, () => ({ date: new Date('2026-01-01') })),
}));

const mockScenarios: Scenario[] = [
    { id: '1', name: 'A', teams: 4, shiftDuration: 8, pattern: 'MMTTNNFFFF' },
];

describe('SystemHealth', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render stats when scenarios provided', () => {
        render(<SystemHealth scenarios={mockScenarios} />);
        expect(screen.getByText(/Saude do Sistema|System Health/i)).toBeInTheDocument();
        expect(screen.getByText(/Equipas/i)).toBeInTheDocument();
    });

    it('should show no scenarios message when empty', () => {
        render(<SystemHealth scenarios={[]} />);
        expect(screen.getByText(/Nenhum cenario encontrado/i)).toBeInTheDocument();
    });
});
