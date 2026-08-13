import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DemoMode from '../DemoMode';
import { PRESET_SCENARIOS } from '../../data/presetScenarios';
import { Scenario } from '../../types';

describe('DemoMode', () => {
    const renderDemo = () => {
        const onSelectScenario = vi.fn();
        const onClose = vi.fn();
        const utils = render(<DemoMode onSelectScenario={onSelectScenario} onClose={onClose} />);
        return { onSelectScenario, onClose, ...utils };
    };

    it('should render title and description', () => {
        renderDemo();
        expect(screen.getByText('Modo Demonstracao')).toBeInTheDocument();
        expect(screen.getByText(/Carregue cenarios de exemplo/i)).toBeInTheDocument();
    });

    it('should render preset buttons', () => {
        renderDemo();
        for (const preset of PRESET_SCENARIOS) {
            expect(screen.getByText(preset.name)).toBeInTheDocument();
        }
    });

    it('should load a single preset scenario', () => {
        const { onSelectScenario, onClose } = renderDemo();
        const firstPreset = PRESET_SCENARIOS[0];
        fireEvent.click(screen.getByText(firstPreset.name));
        expect(onSelectScenario).toHaveBeenCalledTimes(1);
        const scenario = onSelectScenario.mock.calls[0][0] as Scenario;
        expect(scenario.name).toBe(firstPreset.name);
        expect(scenario.pattern).toBe(firstPreset.pattern);
        expect(onClose).toHaveBeenCalled();
    });

    it('should load all presets', () => {
        const { onSelectScenario, onClose } = renderDemo();
        fireEvent.click(screen.getByText('Carregar Todos os Cenarios'));
        expect(onSelectScenario).toHaveBeenCalledTimes(PRESET_SCENARIOS.length);
        expect(onClose).toHaveBeenCalled();
    });

    it('should close on Fechar', () => {
        const { onClose } = renderDemo();
        fireEvent.click(screen.getByText('Fechar'));
        expect(onClose).toHaveBeenCalled();
    });
});