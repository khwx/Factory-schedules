import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { calculateAnalysis } from '../../utils/calculations';
import QualityOfLifeDisplay from '../QualityOfLifeDisplay';
import { Scenario } from '../../types';
import { I18nProvider } from '../../i18n';

const scenario: Scenario = {
    id: 'qol-comp-1',
    name: 'QoL Component',
    teams: 5,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('QualityOfLifeDisplay', () => {
    it('should render score card header', () => {
        const analysis = calculateAnalysis(scenario);
        render(<I18nProvider><QualityOfLifeDisplay scenario={scenario} analysis={analysis} year={2026} /></I18nProvider>);
        expect(screen.getByText(/Qualidade de Vida|Quality of Life/i)).toBeInTheDocument();
    });

    it('should show overall score percentage', () => {
        const analysis = calculateAnalysis(scenario);
        render(<I18nProvider><QualityOfLifeDisplay scenario={scenario} analysis={analysis} year={2026} /></I18nProvider>);
        expect(screen.getByText(/Pontuacao Geral|Overall Score/i)).toBeInTheDocument();
        expect(screen.getAllByText(/\d+%/).length).toBeGreaterThanOrEqual(1);
    });

    it('should show a valid grade badge', () => {
        const analysis = calculateAnalysis(scenario);
        render(<I18nProvider><QualityOfLifeDisplay scenario={scenario} analysis={analysis} year={2026} /></I18nProvider>);
        expect(screen.getAllByText(/[A-F][+-]?/).length).toBeGreaterThanOrEqual(1);
    });

    it('should show breakdown categories', () => {
        const analysis = calculateAnalysis(scenario);
        render(<I18nProvider><QualityOfLifeDisplay scenario={scenario} analysis={analysis} year={2026} /></I18nProvider>);
        expect(screen.getAllByText(/Fins de Semana|Weekends/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Noturno|Night/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Recuperacao|Recovery/i).length).toBeGreaterThanOrEqual(1);
    });
});