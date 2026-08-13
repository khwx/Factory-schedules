import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MobileBottomNav from '../MobileBottomNav';

describe('MobileBottomNav', () => {
    const renderNav = (initialPath = '/') =>
        render(
            <MemoryRouter initialEntries={[initialPath]}>
                <MobileBottomNav />
            </MemoryRouter>
        );

    it('should render with mobile navigation role', () => {
        renderNav();
        expect(screen.getByRole('navigation', { name: /Mobile navigation/i })).toBeInTheDocument();
    });

    it('should render all mobile items', () => {
        renderNav();
        for (const label of ['Home', 'Analitica', 'Comparar', 'Custos', 'Modelos']) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    });

    it('should highlight the active route', () => {
        renderNav('/compare');
        const active = screen.getByText('Comparar').closest('a');
        expect(active?.className).toContain('text-blue-400');
        const inactive = screen.getByText('Custos').closest('a');
        expect(inactive?.className).toContain('text-gray-500');
    });

    it('should highlight home only at exact path', () => {
        renderNav('/analytics');
        const home = screen.getByText('Home').closest('a');
        expect(home?.className).toContain('text-gray-500');
    });

    it('should link to correct paths', () => {
        renderNav();
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
        expect(screen.getByText('Modelos').closest('a')).toHaveAttribute('href', '/templates');
    });
});