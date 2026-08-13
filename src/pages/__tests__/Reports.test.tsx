import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import Reports from '../Reports';
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
        id: 'rep-1',
        name: 'Report Scenario A',
        teams: 5,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFFFF',
    },
    {
        id: 'rep-2',
        name: 'Report Scenario B',
        teams: 4,
        shiftDuration: 8,
        weeklyHoursContract: 40,
        pattern: 'MMTTNNFF',
    },
];

describe('Reports', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
        vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
        vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('should render without crashing', () => {
        render(<Reports />, { wrapper });
        expect(screen.getAllByText(/Relatorios|Reports/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should list scenarios as selectable cards', () => {
        render(<Reports />, { wrapper });
        expect(screen.getByText('Report Scenario A')).toBeInTheDocument();
        expect(screen.getByText('Report Scenario B')).toBeInTheDocument();
    });

    it('should show empty state when no scenarios exist', () => {
        localStorage.removeItem('shiftsim_scenarios');
        render(<Reports />, { wrapper });
        expect(screen.getByText(/Nenhum cenario disponivel|No scenarios available/i)).toBeInTheDocument();
    });

    it('should allow selecting a scenario and generating report', async () => {
        render(<Reports />, { wrapper });
        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);
        expect(screen.getByText(/Gerar Relatorio|Generate Report/i)).toBeInTheDocument();
    });

    it('should select all scenarios', () => {
        render(<Reports />, { wrapper });
        const selectAll = screen.getByText(/Selecionar todos|Select all/i);
        fireEvent.click(selectAll);
        expect(screen.getByText(/Desselecionar todos|Deselect all/i)).toBeInTheDocument();
    });

    it('should show summary stats after selection', () => {
        render(<Reports />, { wrapper });
        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);
        expect(screen.getAllByText(/Cenarios|Scenarios/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should have export format options', () => {
        render(<Reports />, { wrapper });
        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);
        ['PDF', 'Excel', 'CSV', 'JSON'].forEach(f => {
            expect(screen.getByText(f)).toBeInTheDocument();
        });
    });
});