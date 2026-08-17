import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
        mockMatchMedia(false);
    });

    afterEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: originalMatchMedia,
        });
    });

    const getYearControls = () => {
        const yearSpan = screen.getByText((content) => /^\d{4}$/.test(content));
        return { yearSpan, buttons: (yearSpan.parentElement as HTMLElement).querySelectorAll('button') };
    };

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
        render(<YearCalendarView scenario={scenario} />);
        const { yearSpan, buttons } = getYearControls();
        const initialYear = Number(yearSpan.textContent);
        expect(initialYear).toBeGreaterThan(1900);

        fireEvent.click(buttons[0]);
        expect(screen.getByText((initialYear - 1).toString())).toBeInTheDocument();

        fireEvent.click(getYearControls().buttons[1]);
        fireEvent.click(getYearControls().buttons[1]);
        expect(screen.getByText((initialYear + 1).toString())).toBeInTheDocument();
    });

    it('renders all months in desktop layout', () => {
        render(<YearCalendarView scenario={scenario} />);
        // Desktop layout renders a header per month via renderMonth (12 months)
        expect(document.querySelectorAll('h4').length).toBe(12);
    });

    it('collapses to a single month view on mobile', () => {
        mockMatchMedia(true);
        render(<YearCalendarView scenario={scenario} />);
        // Mobile shows a single month (1 month header + 1 rendered month header)
        expect(document.querySelectorAll('h4').length).toBe(2);
    });
});
