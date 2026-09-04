import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { I18nProvider } from '../../i18n';
import { ShortcutsHelp, useShortcutsHelp } from '../ShortcutsHelp';

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

describe('ShortcutsHelp', () => {
    it('should render nothing when closed', () => {
        const { container } = render(<ShortcutsHelp isOpen={false} onClose={() => {}} />, { wrapper });
        // The wrapper adds providers, but ShortcutsHelp itself should render null
        expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    it('should render dialog when open', () => {
        render(<ShortcutsHelp isOpen={true} onClose={() => {}} />, { wrapper });
        expect(screen.getByRole('dialog', { name: /Atalhos de teclado/i })).toBeInTheDocument();
    });

    it('should render shortcut labels', () => {
        render(<ShortcutsHelp isOpen={true} onClose={() => {}} />, { wrapper });
        expect(screen.getByText('Desfazer')).toBeInTheDocument();
        expect(screen.getByText('Pesquisar cenarios')).toBeInTheDocument();
        expect(screen.getByText('Criar novo cenario (foco no formulario)')).toBeInTheDocument();
    });

    it('should render key badges', () => {
        render(<ShortcutsHelp isOpen={true} onClose={() => {}} />, { wrapper });
        expect(screen.getAllByText('Ctrl').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Z').length).toBeGreaterThan(0);
    });

    it('should call onClose when clicking close button', () => {
        const onClose = vi.fn();
        render(<ShortcutsHelp isOpen={true} onClose={onClose} />, { wrapper });
        fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
        expect(onClose).toHaveBeenCalled();
    });

    it('should close on Escape', () => {
        const onClose = vi.fn();
        render(<ShortcutsHelp isOpen={true} onClose={onClose} />, { wrapper });
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });
});

describe('useShortcutsHelp', () => {
    it('should toggle with ? key', () => {
        function Harness() {
            const s = useShortcutsHelp();
            return <span data-testid="open">{String(s.isOpen)}</span>;
        }
        render(<Harness />, { wrapper });
        expect(screen.getByTestId('open').textContent).toBe('false');
        fireEvent.keyDown(window, { key: '?' });
        expect(screen.getByTestId('open').textContent).toBe('true');
        fireEvent.keyDown(window, { key: '?' });
        expect(screen.getByTestId('open').textContent).toBe('false');
    });

    it('should ignore ? when typing in input', () => {
        function Harness() {
            useShortcutsHelp();
            return <input data-testid="input" />;
        }
        render(<Harness />, { wrapper });
        const input = screen.getByTestId('input');
        fireEvent.keyDown(input, { key: '?' });
        expect(screen.queryByTestId('open')).toBeNull();
    });

    it('should close() via returned function', () => {
        function Harness() {
            const s = useShortcutsHelp();
            return (
                <>
                    <span data-testid="open">{String(s.isOpen)}</span>
                    <button onClick={s.close}>close</button>
                </>
            );
        }
        render(<Harness />, { wrapper });
        fireEvent.keyDown(window, { key: '?' });
        expect(screen.getByTestId('open').textContent).toBe('true');
        fireEvent.click(screen.getByText('close'));
        expect(screen.getByTestId('open').textContent).toBe('false');
    });
});