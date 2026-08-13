import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import AnalyticsDashboard from '../AnalyticsDashboard';
import { Scenario } from '../../types';

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

const mockScenarios: Scenario[] = [
    {
        id: 'an-1',
        name: 'Analytics Scenario A',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
    },
];

describe('AnalyticsDashboard', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should render without crashing', () => {
        render(<AnalyticsDashboard />, { wrapper });
        expect(screen.getAllByText(/Analises|Analytics/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should list scenarios for selection', () => {
        render(<AnalyticsDashboard />, { wrapper });
        expect(screen.getByText('Analytics Scenario A')).toBeInTheDocument();
    });

    it('should allow selecting all scenarios', () => {
        render(<AnalyticsDashboard />, { wrapper });
        const selectAll = screen.getByText(/Selecionar Todos|Select All/i);
        fireEvent.click(selectAll);
        expect(screen.getByText(/Desselecionar|Deselect/i)).toBeInTheDocument();
    });

    it('should show empty state with no scenarios', () => {
        localStorage.removeItem('shiftsim_scenarios');
        render(<AnalyticsDashboard />, { wrapper });
        expect(screen.getAllByText(/Selecionar Cenarios|Select Scenarios/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Selecionar Todos|Select All/i).length).toBeGreaterThanOrEqual(1);
    });
});