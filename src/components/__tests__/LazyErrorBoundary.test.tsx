import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { lazy as reactLazy } from 'react';
import LazyErrorBoundary, { LazyLoad } from '../LazyErrorBoundary';

const BoomChild = () => {
    throw new Error('Boom!');
};

describe('LazyErrorBoundary', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('renders children when there is no error', () => {
        render(
            <LazyErrorBoundary>
                <span>Safe content</span>
            </LazyErrorBoundary>
        );
        expect(screen.getByText('Safe content')).toBeInTheDocument();
    });

    it('renders a fallback UI when a child throws', () => {
        render(
            <LazyErrorBoundary>
                <BoomChild />
            </LazyErrorBoundary>
        );
        expect(screen.getByText(/Erro ao carregar componente/i)).toBeInTheDocument();
        expect(screen.getByText('Boom!')).toBeInTheDocument();
    });

    it('renders a custom fallback when provided', () => {
        render(
            <LazyErrorBoundary fallback={<div>Custom error</div>}>
                <BoomChild />
            </LazyErrorBoundary>
        );
        expect(screen.getByText('Custom error')).toBeInTheDocument();
        expect(screen.queryByText('Boom!')).not.toBeInTheDocument();
    });

    it('reloads the page when retry is clicked', () => {
        const reloadMock = vi.fn();
        vi.stubGlobal('location', { ...window.location, reload: reloadMock });
        render(
            <LazyErrorBoundary>
                <BoomChild />
            </LazyErrorBoundary>
        );
        fireEvent.click(screen.getByText(/Recarregar/i));
        expect(reloadMock).toHaveBeenCalledTimes(1);
        vi.unstubAllGlobals();
    });
});

describe('LazyErrorBoundary.LazyLoad', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('renders children within the error boundary', () => {
        render(
            <LazyLoad>
                <span>Wrapped content</span>
            </LazyLoad>
        );
        expect(screen.getByText('Wrapped content')).toBeInTheDocument();
    });

    it('renders a skeleton fallback when a lazy child suspends', () => {
        const LazyChild = reactLazy(() => new Promise<{ default: React.FC }>(() => {}));
        render(
            <LazyLoad>
                <LazyChild />
            </LazyLoad>
        );
        expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });
});
