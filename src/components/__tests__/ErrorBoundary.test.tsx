import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

const Bomb: React.FC = () => {
    throw new Error('Test explosion');
};

const BoomChild: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
    if (shouldThrow) throw new Error('Boom!');
    return <div>Safe content</div>;
};

describe('ErrorBoundary', () => {
    it('should render children when no error', () => {
        render(<ErrorBoundary><div>Safe content</div></ErrorBoundary>);
        expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('should render error UI when child throws', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<ErrorBoundary><Bomb /></ErrorBoundary>);
        expect(screen.getByText('Algo correu mal')).toBeInTheDocument();
        expect(screen.getByText('Test explosion')).toBeInTheDocument();
        spy.mockRestore();
    });

    it('should allow retry after error', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { rerender } = render(
            <ErrorBoundary><BoomChild shouldThrow={true} /></ErrorBoundary>
        );
        expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();

        rerender(
            <ErrorBoundary><BoomChild shouldThrow={false} /></ErrorBoundary>
        );
        fireEvent.click(screen.getByText('Tentar Novamente'));

        expect(screen.getByText('Safe content')).toBeInTheDocument();
        spy.mockRestore();
    });
});