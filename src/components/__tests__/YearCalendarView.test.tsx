import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import YearCalendarView from '../YearCalendarView';
import { Scenario } from '../../types';

const scenario: Scenario = {
    id: 'yc-1',
    name: 'Year View Scenario',
    teams: 2,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFF',
    teamPatterns: ['MMTTNNFF', 'NNFFMMTT'],
};

const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }),
    });
};

describe('YearCalendarView', () => {
    beforeEach(() => {
        mockMatchMedia(false);
    });

    it('renders the scenario name in the header', () => {
        render(<YearCalendarView scenario={scenario} />);
        const heading = screen.getByRole('heading', { level: 3 });
        expect(heading.textContent).toContain('Year View Scenario');
    });

    it('renders the shift legend', () => {
        render(<YearCalendarView scenario={scenario} />);
        expect(screen.getByText('Manhã')).toBeInTheDocument();
        expect(screen.getByText('Tarde')).toBeInTheDocument();
        expect(screen.getByText('Noite')).toBeInTheDocument();
        expect(screen.getByText('Folga')).toBeInTheDocument();
    });

    it('renders a team selector when there are multiple teams', () => {
        render(<YearCalendarView scenario={scenario} />);
        expect(screen.getByRole('option', { name: 'Turno A' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Turno B' })).toBeInTheDocument();
    });

    it('navigates to the previous and next year', () => {
        const currentYear = new Date().getFullYear();
        render(<YearCalendarView scenario={scenario} />);
        expect(screen.getByText(currentYear.toString())).toBeInTheDocument();

        const clickYearButton = (index: number) => {
            const yearSelector = screen.getByText(/^\d{4}$/).closest('.year-selector')!;
            const buttons = yearSelector.querySelectorAll('button');
            fireEvent.click(buttons[index]);
        };

        clickYearButton(0);
        expect(screen.getByText((currentYear - 1).toString())).toBeInTheDocument();

        clickYearButton(1);
        clickYearButton(1);
        expect(screen.getByText((currentYear + 1).toString())).toBeInTheDocument();
    });

    it('renders all months in desktop layout', () => {
        render(<YearCalendarView scenario={scenario} />);
        // Desktop layout renders one header per month (12)
        expect(document.querySelectorAll('h4').length).toBe(12);
    });

    it('collapses to a single month on mobile', () => {
        mockMatchMedia(true);
        render(<YearCalendarView scenario={scenario} />);
        expect(document.querySelectorAll('h4').length).toBe(1);
    });
});
