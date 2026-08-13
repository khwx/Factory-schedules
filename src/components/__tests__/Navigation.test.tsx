import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
    const renderNav = (initialPath = '/') =>
        render(
            <MemoryRouter initialEntries={[initialPath]}>
                <Navigation />
            </MemoryRouter>
        );

    it('should render with navigation role and label', () => {
        renderNav();
        expect(screen.getByRole('navigation', { name: /Main navigation/i })).toBeInTheDocument();
        expect(screen.getByRole('menubar')).toBeInTheDocument();
    });

    it('should render all main nav items', () => {
        renderNav();
        const labels = ['Dashboard', 'Analitica', 'Comparar', 'Custos', 'Otimizar', 'Efetivo', 'Modelos', 'Feriados', 'Equipas', 'Colaborador', 'Relatorios', 'Config', 'Ajuda'];
        for (const label of labels) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    });

    it('should mark the active route', () => {
        renderNav('/analytics');
        const activeLink = screen.getByRole('menuitem', { name: /Analitica/i });
        expect(activeLink.className).toContain('bg-blue-600');
    });

    it('should link to correct paths', () => {
        renderNav();
        expect(screen.getByRole('menuitem', { name: /Dashboard/i })).toHaveAttribute('href', '/');
        expect(screen.getByRole('menuitem', { name: /Custos/i })).toHaveAttribute('href', '/costs');
        expect(screen.getByRole('menuitem', { name: /Ajuda/i })).toHaveAttribute('href', '/help');
    });
});