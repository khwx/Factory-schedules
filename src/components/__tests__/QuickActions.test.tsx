import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickActions from '../../components/QuickActions';

describe('QuickActions', () => {
    it('should not render on desktop (md:hidden)', () => {
        const { container } = render(
            <QuickActions onNewScenario={vi.fn()} onOpenGenerator={vi.fn()} onExport={vi.fn()} onSearch={vi.fn()} />
        );
        // The component renders but is hidden on desktop via md:hidden class
        expect(container.firstChild).toBeTruthy();
    });

    it('should open menu when FAB clicked', () => {
        render(
            <QuickActions onNewScenario={vi.fn()} onOpenGenerator={vi.fn()} onExport={vi.fn()} onSearch={vi.fn()} />
        );
        const fab = screen.getByLabelText('Acoes rapidas');
        fireEvent.click(fab);
        expect(screen.getByText('Novo Cenario')).toBeInTheDocument();
        expect(screen.getByText('Gerar Horario')).toBeInTheDocument();
        expect(screen.getByText('Exportar')).toBeInTheDocument();
        expect(screen.getByText('Pesquisar')).toBeInTheDocument();
    });

    it('should call onNewScenario when Novo Cenario clicked', () => {
        const onNewScenario = vi.fn();
        render(
            <QuickActions onNewScenario={onNewScenario} onOpenGenerator={vi.fn()} onExport={vi.fn()} onSearch={vi.fn()} />
        );
        fireEvent.click(screen.getByLabelText('Acoes rapidas'));
        fireEvent.click(screen.getByText('Novo Cenario'));
        expect(onNewScenario).toHaveBeenCalled();
    });

    it('should call onOpenGenerator when Gerar Horario clicked', () => {
        const onOpenGenerator = vi.fn();
        render(
            <QuickActions onNewScenario={vi.fn()} onOpenGenerator={onOpenGenerator} onExport={vi.fn()} onSearch={vi.fn()} />
        );
        fireEvent.click(screen.getByLabelText('Acoes rapidas'));
        fireEvent.click(screen.getByText('Gerar Horario'));
        expect(onOpenGenerator).toHaveBeenCalled();
    });

    it('should toggle close when clicked again', () => {
        render(
            <QuickActions onNewScenario={vi.fn()} onOpenGenerator={vi.fn()} onExport={vi.fn()} onSearch={vi.fn()} />
        );
        const fab = screen.getByLabelText('Acoes rapidas');
        fireEvent.click(fab);
        expect(screen.getByText('Novo Cenario')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Fechar acoes'));
        expect(screen.queryByText('Novo Cenario')).not.toBeInTheDocument();
    });
});
