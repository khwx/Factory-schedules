import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import Dashboard from '../Dashboard';

const mockScenarios = [
    {
        id: 'dashboard-test-1',
        name: 'Dashboard Test Scenario',
        teams: 4,
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

describe('Dashboard', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<Dashboard />, { wrapper });
        const matches = screen.getAllByText('Dashboard Test Scenario');
        expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('should show scenario stats', async () => {
        render(<Dashboard />, { wrapper });
        expect(await screen.findByText(/Saude do Sistema|System Health/i)).toBeInTheDocument();
    });
});
