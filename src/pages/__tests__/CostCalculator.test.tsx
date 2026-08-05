import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import CostCalculator from '../CostCalculator';

const mockScenarios = [
    {
        id: 'cost-1',
        name: 'Cost Test Scenario',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
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

describe('CostCalculator', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<CostCalculator />, { wrapper });
        expect(screen.getByText(/Calculadora de Custos|Cost Calculator/i)).toBeInTheDocument();
    });

    it('should show scenario selector', () => {
        render(<CostCalculator />, { wrapper });
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText(/Cost Test Scenario/)).toBeInTheDocument();
    });

    it('should show cost breakdown table', () => {
        render(<CostCalculator />, { wrapper });
        expect(screen.getByText(/Total por Equipa|Total per Team/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Custo Total/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should show pay config inputs', () => {
        render(<CostCalculator />, { wrapper });
        expect(screen.getAllByText(/Taxa Horaria|Hourly Rate/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Acrescimo Noturno|Night Premium/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Acrescimo Feriado|Holiday Premium/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Acrescimo FDS|Weekend Premium/i).length).toBeGreaterThanOrEqual(1);
    });
});
