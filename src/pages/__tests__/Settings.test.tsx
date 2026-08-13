import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import SettingsPage from '../Settings';

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
        id: 's1',
        name: 'Scenario One',
        teams: 4,
        shiftDuration: 8,
        pattern: 'MMTTNNFFFF',
    },
];

describe('SettingsPage', () => {
    beforeEach(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(mockScenarios));
        localStorage.setItem('shiftsim_custom_holidays', JSON.stringify([]));
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
        render(<SettingsPage />, { wrapper });
        expect(screen.getByText(/Configuracoes|Settings/i)).toBeInTheDocument();
    });

    it('should show theme toggle', () => {
        render(<SettingsPage />, { wrapper });
        expect(screen.getAllByText(/Tema|Theme/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Mudar para Tema Claro|Switch to Light Theme/i)).toBeInTheDocument();
    });

    it('should switch theme when clicking toggle', () => {
        render(<SettingsPage />, { wrapper });
        const toggle = screen.getByText(/Mudar para Tema Claro|Switch to Light Theme/i);
        fireEvent.click(toggle);
        expect(screen.getByText(/Mudar para Tema Escuro|Switch to Dark Theme/i)).toBeInTheDocument();
    });

    it('should show scenario count in backup section', () => {
        render(<SettingsPage />, { wrapper });
        expect(screen.getByText(/Atualmente tem 1 cenario|cenario s?etc|currently have 1 saved/i)).toBeInTheDocument();
    });

    it('should trigger backup download', () => {
        render(<SettingsPage />, { wrapper });
        const backupButton = screen.getByText(/Fazer Backup|Download Backup/i);
        fireEvent.click(backupButton);
        expect(screen.getByText(/Backup feito com sucesso|Backup successful/i)).toBeInTheDocument();
    });

    it('should show language buttons', () => {
        render(<SettingsPage />, { wrapper });
        expect(screen.getByText('Portugues')).toBeInTheDocument();
        expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should switch language to English', () => {
        render(<SettingsPage />, { wrapper });
        fireEvent.click(screen.getByText('English'));
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should allow adding a custom holiday', () => {
        render(<SettingsPage />, { wrapper });
        fireEvent.change(screen.getByPlaceholderText(/Nome do feriado|Holiday name/i), {
            target: { value: 'Dia da Empresa' },
        });
        fireEvent.click(screen.getAllByText(/Adicionar|Add/i)[0]);
        expect(screen.getByText(/Feriado adicionado|Holiday added/i)).toBeInTheDocument();
    });

    it('should show danger zone with clear all data button', () => {
        render(<SettingsPage />, { wrapper });
        expect(screen.getByText(/Zona de Perigo|Danger Zone/i)).toBeInTheDocument();
        const clearButtons = screen.getAllByRole('button', { name: /Apagar Todos os Dados|Clear All Data/i });
        expect(clearButtons.length).toBeGreaterThanOrEqual(1);
    });
});