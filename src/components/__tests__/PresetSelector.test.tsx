import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PresetSelector from '../PresetSelector';
import { PRESET_SCENARIOS } from '../../data/presetScenarios';

describe('PresetSelector', () => {
    const renderSelector = () => {
        const onLoadPreset = vi.fn();
        const utils = render(<PresetSelector onLoadPreset={onLoadPreset} />);
        return { onLoadPreset, ...utils };
    };

    it('should render trigger button', () => {
        renderSelector();
        const btn = screen.getByRole('button', { name: /Carregar Cenario de Exemplo/i });
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it('should open listbox on click', () => {
        renderSelector();
        fireEvent.click(screen.getByRole('button', { name: /Carregar Cenario de Exemplo/i }));
        expect(screen.getByRole('listbox', { name: /Cenarios de exemplo/i })).toBeInTheDocument();
    });

    it('should list preset options when open', () => {
        renderSelector();
        fireEvent.click(screen.getByRole('button', { name: /Carregar Cenario de Exemplo/i }));
        for (const preset of PRESET_SCENARIOS) {
            expect(screen.getByText(preset.name)).toBeInTheDocument();
        }
    });

    it('should load preset on selection', () => {
        const { onLoadPreset } = renderSelector();
        fireEvent.click(screen.getByRole('button', { name: /Carregar Cenario de Exemplo/i }));
        const firstPreset = PRESET_SCENARIOS[0];
        fireEvent.click(screen.getByRole('option', { name: new RegExp(firstPreset.name) }));
        expect(onLoadPreset).toHaveBeenCalledWith(firstPreset);
    });

    it('should close listbox after selecting', () => {
        renderSelector();
        fireEvent.click(screen.getByRole('button', { name: /Carregar Cenario de Exemplo/i }));
        fireEvent.click(screen.getByRole('option', { name: new RegExp(PRESET_SCENARIOS[0].name) }));
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
});