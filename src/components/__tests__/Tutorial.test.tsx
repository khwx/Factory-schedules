import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TutorialOverlay, useTutorial, HelpButton } from '../Tutorial';

const renderOverlay = (overrides: Partial<React.ComponentProps<typeof TutorialOverlay>> = {}) =>
    render(
        <TutorialOverlay
            isActive={true}
            currentStep={0}
            onNext={() => {}}
            onPrev={() => {}}
            onClose={() => {}}
            totalSteps={5}
            {...overrides}
        />
    );

describe('TutorialOverlay', () => {
    it('should render current step title and text', () => {
        renderOverlay();
        expect(screen.getByText('Criar Cenario')).toBeInTheDocument();
        expect(screen.getByText(/Use este formulario/i)).toBeInTheDocument();
    });

    it('should show step counter', () => {
        renderOverlay();
        expect(screen.getByText('1 de 5')).toBeInTheDocument();
    });

    it('should show Proximo button on first step', () => {
        renderOverlay();
        expect(screen.getByText('Proximo')).toBeInTheDocument();
        expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
    });

    it('should show Anterior on later steps', () => {
        renderOverlay({ currentStep: 2 });
        expect(screen.getByText('Anterior')).toBeInTheDocument();
    });

    it('should show Concluir on last step', () => {
        renderOverlay({ currentStep: 4, totalSteps: 5 });
        expect(screen.getByText('Concluir')).toBeInTheDocument();
    });

    it('should call onNext when clicking Proximo', () => {
        const onNext = vi.fn();
        renderOverlay({ onNext });
        fireEvent.click(screen.getByText('Proximo'));
        expect(onNext).toHaveBeenCalled();
    });

    it('should call onClose when clicking backdrop', () => {
        const onClose = vi.fn();
        renderOverlay({ onClose });
        fireEvent.click(screen.getByText('Criar Cenario').closest('div')!.querySelector('button[aria-label="Fechar tutorial"]')!);
        expect(onClose).toHaveBeenCalled();
    });

    it('should render nothing when inactive', () => {
        const { container } = renderOverlay({ isActive: false });
        expect(container.firstChild).toBeNull();
    });

    it('should have dialog role', () => {
        renderOverlay();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});

describe('useTutorial', () => {
    beforeEach(() => localStorage.clear());

    it('should start inactive and toggle active on start', () => {
        function Harness() {
            const t = useTutorial();
            return (
                <>
                    <span data-testid="active">{String(t.isActive)}</span>
                    <button onClick={t.start}>start</button>
                </>
            );
        }
        render(<Harness />);
        expect(screen.getByTestId('active').textContent).toBe('false');
        fireEvent.click(screen.getByText('start'));
        expect(screen.getByTestId('active').textContent).toBe('true');
    });

    it('should mark complete in localStorage on close', () => {
        function Harness() {
            const t = useTutorial();
            return <button onClick={t.close}>close</button>;
        }
        render(<Harness />);
        fireEvent.click(screen.getByText('close'));
        expect(localStorage.getItem('shiftsim_tutorial_complete')).toBe('true');
    });

    it('shouldShowOnFirstVisit true when no key, false after completion', () => {
        function Harness() {
            const t = useTutorial();
            return <span data-testid="show">{String(t.shouldShowOnFirstVisit())}</span>;
        }
        render(<Harness />);
        expect(screen.getByTestId('show').textContent).toBe('true');
        act(() => localStorage.setItem('shiftsim_tutorial_complete', 'true'));
        render(<Harness />);
        expect(screen.getAllByTestId('show')[1].textContent).toBe('false');
    });
});

describe('HelpButton', () => {
    it('should render button and call onClick', () => {
        const onClick = vi.fn();
        render(<HelpButton onClick={onClick} />);
        const btn = screen.getByRole('button', { name: /Abrir tutorial/i });
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(onClick).toHaveBeenCalled();
    });
});