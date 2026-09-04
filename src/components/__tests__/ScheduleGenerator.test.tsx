import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import GeneratorUI from '../ScheduleGenerator';

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

const { mockGenerate, mockCancel, mockOnClose, mockOnSelectScenario } = vi.hoisted(() => ({
    mockGenerate: vi.fn(),
    mockCancel: vi.fn(),
    mockOnClose: vi.fn(),
    mockOnSelectScenario: vi.fn(),
}));

vi.mock('../../utils/scheduleGenerator', () => ({
    ScheduleGenerator: class {
        generate = mockGenerate;
        cancel = mockCancel;
    },
}));

const mockResults = [
    {
        pattern: 'MMTTNNF',
        score: 5,
        cycleLength: 7,
        quality: { avgWorkBlock: 2.5, avgOffBlock: 1.5, isolatedShifts: 0 },
    },
];

describe('GeneratorUI', () => {
    beforeEach(() => {
        mockGenerate.mockReset();
        mockGenerate.mockResolvedValue(mockResults);
        mockCancel.mockReset();
        mockOnClose.mockReset();
        mockOnSelectScenario.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return null when not open', () => {
        const { container } = render(
            <GeneratorUI isOpen={false} onClose={mockOnClose} onSelectScenario={mockOnSelectScenario} />,
            { wrapper }
        );
        expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    it('should render configuration when open', () => {
        render(
            <GeneratorUI isOpen={true} onClose={mockOnClose} onSelectScenario={mockOnSelectScenario} />,
            { wrapper }
        );
        expect(screen.getByText(/Gerador de Horarios Avancado/i)).toBeInTheDocument();
        expect(screen.getByText(/Numero de Equipas/i)).toBeInTheDocument();
        expect(screen.getByText(/Duracao Turno/i)).toBeInTheDocument();
        expect(screen.getByText(/Alvo Horas Semanais/i)).toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
        render(
            <GeneratorUI isOpen={true} onClose={mockOnClose} onSelectScenario={mockOnSelectScenario} />,
            { wrapper }
        );
        fireEvent.click(screen.getByLabelText(/Fechar gerador/i));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should toggle advanced preferences', () => {
        render(
            <GeneratorUI isOpen={true} onClose={mockOnClose} onSelectScenario={mockOnSelectScenario} />,
            { wrapper }
        );
        expect(screen.queryByText(/Max. Dias Trabalho Seguidos/i)).not.toBeInTheDocument();
        fireEvent.click(screen.getByText(/Preferencias Avancadas/i));
        expect(screen.getByText(/Max. Dias Trabalho Seguidos/i)).toBeInTheDocument();
        expect(screen.getByText(/Max. Folgas Seguidas/i)).toBeInTheDocument();
        expect(screen.getByText(/Tamanho Min. Blocos/i)).toBeInTheDocument();
    });

    it('should generate and display results', async () => {
        render(
            <GeneratorUI isOpen={true} onClose={mockOnClose} onSelectScenario={mockOnSelectScenario} />,
            { wrapper }
        );
        fireEvent.click(screen.getByText(/Gerar Opcoes/i));
        expect(mockGenerate).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByText(/Resultados/i)).toBeInTheDocument();
        });
    });

    it('should select a scenario when "Usar" is clicked', async () => {
        render(
            <GeneratorUI isOpen={true} onClose={mockOnClose} onSelectScenario={mockOnSelectScenario} />,
            { wrapper }
        );
        fireEvent.click(screen.getByText(/Gerar Opcoes/i));
        await waitFor(() => {
            const useButton = screen.getByRole('button', { name: /Usar/i });
            fireEvent.click(useButton);
        });
        expect(mockOnSelectScenario).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});
