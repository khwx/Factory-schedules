import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import TeamRoster from '../TeamRoster';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <ThemeProvider>
            <ToastProvider>
                <I18nProvider>
                    {children}
                </I18nProvider>
            </ToastProvider>
        </ThemeProvider>
    </BrowserRouter>
);

const mockScenarios = [
    {
        id: 'roster-1',
        name: 'Roster Scenario',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFF',
    },
];

describe('TeamRoster', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should render without crashing', () => {
        render(<TeamRoster />, { wrapper });
        expect(screen.getByText(/Gestao de Equipas|Team Roster/i)).toBeInTheDocument();
    });

    it('should show scenario selector', () => {
        render(<TeamRoster />, { wrapper });
        const combos = screen.getAllByRole('combobox');
        expect(combos.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Roster Scenario/)).toBeInTheDocument();
    });

    it('should show month navigation', () => {
        render(<TeamRoster />, { wrapper });
        const buttons = screen.getAllByRole('button');
        // prevMonth and nextMonth chevron buttons
        expect(buttons.length).toBeGreaterThanOrEqual(2);
        const monthLabel = screen.getByText(/(Janeiro|Fevereiro|Marco|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/);
        expect(monthLabel).toBeInTheDocument();
    });

    it('should show shift legend', () => {
        render(<TeamRoster />, { wrapper });
        expect(screen.getAllByText(/Manha|Morning/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Tarde|Afternoon/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Noite|Night/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Folga|Off/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should show team summary cards', () => {
        render(<TeamRoster />, { wrapper });
        expect(screen.getAllByText(/Equipa|Team/i).length).toBeGreaterThanOrEqual(1);
        const combos = screen.getAllByRole('combobox');
        expect(combos.length).toBeGreaterThanOrEqual(1);
    });

    it('should show empty state when no scenarios', () => {
        localStorage.removeItem('shiftsim_scenarios');
        render(<TeamRoster />, { wrapper });
        expect(screen.getByText(/Nenhum cenario disponivel|No scenarios available/i)).toBeInTheDocument();
    });

    it('should navigate months without crashing', () => {
        render(<TeamRoster />, { wrapper });
        const buttons = screen.getAllByRole('button');
        // Click the next month button (last button in the controls bar)
        const nextButton = buttons[buttons.length - 2];
        fireEvent.click(nextButton);
        const monthLabel = screen.getByText(new RegExp('(Janeiro|Fevereiro|Marco|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro|January|February|March|April|May|June|July|August|September|October|November|December)'));
        expect(monthLabel).toBeInTheDocument();
    });
});