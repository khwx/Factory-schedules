import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import EmployeeSchedule from '../../pages/EmployeeSchedule';

const mockScenarios = [
    {
        id: 'emp-1',
        name: 'Employee Test Scenario',
        teams: 4,
        shiftDuration: 8,
        pattern: 'MMTTNNFFFF',
        startDate: '2024-01-01',
        description: 'Test description',
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

describe('EmployeeSchedule', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<EmployeeSchedule />, { wrapper });
        expect(screen.getByText(/Horario Individual|Employee Schedule/i)).toBeInTheDocument();
    });

    it('should show scenario selector', () => {
        render(<EmployeeSchedule />, { wrapper });
        const combos = screen.getAllByRole('combobox');
        expect(combos.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('Employee Test Scenario')).toBeInTheDocument();
    });

    it('should show team selector', () => {
        render(<EmployeeSchedule />, { wrapper });
        const labels = screen.getAllByText(/Equipa/i);
        expect(labels.length).toBeGreaterThanOrEqual(1);
    });

    it('should show employee name input', () => {
        render(<EmployeeSchedule />, { wrapper });
        expect(screen.getByPlaceholderText(/Ex:/i)).toBeInTheDocument();
    });

    it('should show month navigation', () => {
        render(<EmployeeSchedule />, { wrapper });
        const monthNames = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const found = monthNames.some(m => {
            const els = screen.queryAllByText(m, { exact: false });
            return els.length > 0;
        });
        expect(found).toBe(true);
        expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    });

    it('should show stats cards', () => {
        render(<EmployeeSchedule />, { wrapper });
        expect(screen.getByText(/Horas Trabalhadas/i)).toBeInTheDocument();
        expect(screen.getByText(/Dias de Turno/i)).toBeInTheDocument();
        expect(screen.getByText(/Dias de Folga/i)).toBeInTheDocument();
        expect(screen.getByText(/Turnos Noturnos/i)).toBeInTheDocument();
    });

    it('should show calendar legend', () => {
        render(<EmployeeSchedule />, { wrapper });
        const legendItems = screen.getAllByText(/Manha|Tarde|Noite|Folga|Feriado/i);
        expect(legendItems.length).toBeGreaterThanOrEqual(5);
    });

    it('should show monthly summary', () => {
        render(<EmployeeSchedule />, { wrapper });
        expect(screen.getByText(/Resumo do Mes/i)).toBeInTheDocument();
        const items = screen.getAllByText(/Manhas|Tardes|Noites|Folgas|Feriados/i);
        expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it('should show next month preview', () => {
        render(<EmployeeSchedule />, { wrapper });
        expect(screen.getByText(/Proximo Mes/)).toBeInTheDocument();
    });

    it('should show pay simulation section when enabled', () => {
        render(<EmployeeSchedule />, { wrapper });
        const checkbox = screen.getByLabelText(/Simular Remuneracao/i);
        fireEvent.click(checkbox);
        expect(screen.getByText(/Simulacao de Remuneracao Anual/i)).toBeInTheDocument();
    });
});
