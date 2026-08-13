import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScheduleDiff from '../ScheduleDiff';
import { I18nProvider } from '../../i18n';
import { Scenario } from '../../types';

const scenarioA: Scenario = {
    id: 'a',
    name: 'Pattern A',
    teams: 5,
    shiftDuration: 8,
    pattern: 'MMTTNNFFFF',
};

const scenarioB: Scenario = {
    id: 'b',
    name: 'Pattern B',
    teams: 5,
    shiftDuration: 8,
    pattern: 'MMMMNNFFFF',
};

describe('ScheduleDiff', () => {
    const renderDiff = () => render(
        <I18nProvider>
            <ScheduleDiff scenarios={[scenarioA, scenarioB]} />
        </I18nProvider>
    );

    it('should render title', () => {
        renderDiff();
        expect(screen.getByText(/Comparacao de Padroes/i)).toBeInTheDocument();
    });

    it('should show placeholder when nothing selected', () => {
        renderDiff();
        expect(screen.getByText(/Selecione dois cenarios para comparar/i)).toBeInTheDocument();
    });

    it('should show both scenario options', () => {
        renderDiff();
        const options = screen.getAllByRole('option');
        const optionTexts = options.map(o => o.textContent);
        expect(optionTexts).toContain('Pattern A');
        expect(optionTexts).toContain('Pattern B');
    });

    it('should show day count options', () => {
        renderDiff();
        expect(screen.getByText('28 dias')).toBeInTheDocument();
    });

    it('should compute diff stats after selecting scenarios', () => {
        renderDiff();
        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'a' } });
        fireEvent.change(selects[1], { target: { value: 'b' } });

        expect(screen.getByText(/iguais/i)).toBeInTheDocument();
        expect(screen.getByText(/diferentes/i)).toBeInTheDocument();
        expect(screen.getByText('Dia')).toBeInTheDocument();
        expect(screen.getAllByText('Diferente').length).toBeGreaterThan(0);
    });
});