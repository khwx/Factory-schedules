import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import Comparison from '../Comparison';

const mockScenarios = [
    {
        id: 'comp-1',
        name: 'Scenario A',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
    },
    {
        id: 'comp-2',
        name: 'Scenario B',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMM TTN NF FF',
    },
];

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

describe('Comparison', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<Comparison />, { wrapper });
        expect(screen.getByText(/Comparacao de Cenarios|Scenario Comparison/i)).toBeInTheDocument();
    });

    it('should show scenario selection buttons', () => {
        render(<Comparison />, { wrapper });
        expect(screen.getByText('Scenario A')).toBeInTheDocument();
        expect(screen.getByText('Scenario B')).toBeInTheDocument();
    });

    it('should show prompt when fewer than 2 selected', () => {
        render(<Comparison />, { wrapper });
        expect(screen.getByText(/Selecione pelo menos 2 cenarios|Select at least 2 scenarios/i)).toBeInTheDocument();
    });

    it('should show comparison table when 2 scenarios selected', () => {
        render(<Comparison />, { wrapper });
        fireEvent.click(screen.getByRole('button', { name: 'Scenario A' }));
        fireEvent.click(screen.getByRole('button', { name: 'Scenario B' }));
        const metrics = screen.getAllByText(/Metrica|Metric/i);
        expect(metrics.length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Scenario A').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Scenario B').length).toBeGreaterThanOrEqual(1);
    });

    it('should deselect scenarios', () => {
        render(<Comparison />, { wrapper });
        fireEvent.click(screen.getByRole('button', { name: 'Scenario A' }));
        fireEvent.click(screen.getByRole('button', { name: 'Scenario B' }));
        fireEvent.click(screen.getByRole('button', { name: 'Scenario A' }));
        expect(screen.queryAllByText(/Metrica|Metric/i)).toHaveLength(0);
    });
});
