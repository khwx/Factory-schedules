import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import WorkforcePlanning from '../../pages/WorkforcePlanning';

const mockScenarios = [
    {
        id: 'wf-1',
        name: 'Workforce Test',
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

describe('WorkforcePlanning', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<WorkforcePlanning />, { wrapper });
        expect(screen.getByText(/Planeamento de Pessoal|Workforce Planning/i)).toBeInTheDocument();
    });

    it('should show scenario selector', () => {
        render(<WorkforcePlanning />, { wrapper });
        const combos = screen.getAllByRole('combobox');
        expect(combos.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Workforce Test')).toBeInTheDocument();
    });

    it('should show team config inputs', () => {
        render(<WorkforcePlanning />, { wrapper });
        const labels = screen.getAllByText(/Equipas|Teams/i);
        expect(labels.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Pessoas\/Equipa|People\/Team/i)).toBeInTheDocument();
    });

    it('should show summary cards', () => {
        render(<WorkforcePlanning />, { wrapper });
        expect(screen.getByText(/Meses OK|Months OK/i)).toBeInTheDocument();
        expect(screen.getByText(/Deficit Total|Total Deficit/i)).toBeInTheDocument();
        expect(screen.getByText(/Excedente Total|Total Surplus/i)).toBeInTheDocument();
        const staffLabels = screen.getAllByText(/Total Pessoal|Total Staff/i);
        expect(staffLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('should show monthly analysis table', () => {
        render(<WorkforcePlanning />, { wrapper });
        expect(screen.getByText(/Analise Mensal|Monthly.*Analysis/i)).toBeInTheDocument();
        const monthNames = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const found = monthNames.some(m => {
            const els = screen.queryAllByText(m);
            return els.length > 0;
        });
        expect(found).toBe(true);
    });

    it('should allow adding custom rule', () => {
        render(<WorkforcePlanning />, { wrapper });
        const addButton = screen.getByRole('button', { name: /Regra Personalizada|Custom Rule/i });
        fireEvent.click(addButton);
        const mesLabels = screen.getAllByText('Mes', { exact: true });
        expect(mesLabels.length).toBeGreaterThanOrEqual(1);
        const minLabels = screen.getAllByText('Minimo', { exact: true });
        expect(minLabels.length).toBeGreaterThanOrEqual(1);
        const maxLabels = screen.getAllByText('Maximo', { exact: true });
        expect(maxLabels.length).toBeGreaterThanOrEqual(1);
    });
});