import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import ScheduleOptimizer from '../../pages/ScheduleOptimizer';

const mockScenarios = [
    {
        id: 'test-1',
        name: 'Test Scenario',
        teams: 5,
        shiftDuration: 8,
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

describe('ScheduleOptimizer', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<ScheduleOptimizer />, { wrapper });
        expect(screen.getByText(/Otimizador|Optimizer/i)).toBeInTheDocument();
    });

    it('should show scenario selector', () => {
        render(<ScheduleOptimizer />, { wrapper });
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Test Scenario')).toBeInTheDocument();
    });

    it('should display score gauge', () => {
        render(<ScheduleOptimizer />, { wrapper });
        expect(screen.getByText(/100|[0-9]+\/100/i)).toBeInTheDocument();
    });

    it('should display constraints list', () => {
        render(<ScheduleOptimizer />, { wrapper });
        expect(screen.getByText(/Constraintes|Constraints/i)).toBeInTheDocument();
    });

    it('should show suggestions section', () => {
        render(<ScheduleOptimizer />, { wrapper });
        expect(screen.getByText(/Sugestoes|Suggestions/i)).toBeInTheDocument();
    });
});
