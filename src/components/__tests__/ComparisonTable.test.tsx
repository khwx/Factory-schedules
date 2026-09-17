import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComparisonTable from '../ComparisonTable';
import { Scenario } from '../../types';
import { I18nProvider } from '../../i18n';

const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Scenario A',
    teams: 5,
    shiftDuration: 8,
    pattern: 'MMTTNNFFFF',
  },
  {
    id: '2',
    name: 'Scenario B',
    teams: 4,
    shiftDuration: 12,
    pattern: 'MMMMTTTTNNNNFFFF',
  },
];

const renderWithI18n = (ui: React.ReactElement) =>
  render(<I18nProvider>{ui}</I18nProvider>);

describe('ComparisonTable', () => {
  it('renders comparison table with scenarios', () => {
    renderWithI18n(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Comparacao de Cenarios')).toBeInTheDocument();
    expect(screen.getByText('Scenario A')).toBeInTheDocument();
    expect(screen.getByText('Scenario B')).toBeInTheDocument();
  });

  it('displays metrics for each scenario', () => {
    renderWithI18n(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Horas Semanais Medias')).toBeInTheDocument();
    expect(screen.getByText('Horas Anuais Totais')).toBeInTheDocument();
    expect(screen.getByText('Fins de Semana Folga')).toBeInTheDocument();
  });

  it('shows configuration section', () => {
    renderWithI18n(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Configuracao')).toBeInTheDocument();
    expect(screen.getByText('MMTTNNFFFF')).toBeInTheDocument();
    expect(screen.getByText('MMMMTTTTNNNNFFFF')).toBeInTheDocument();
  });

  it('shows advanced metrics when available', () => {
    renderWithI18n(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Max Dias Trabalho Consec.')).toBeInTheDocument();
    expect(screen.getByText(/Mini-Ferias/)).toBeInTheDocument();
  });

  it('returns null when no scenarios', () => {
    const { container } = renderWithI18n(<ComparisonTable scenarios={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows scenario count', () => {
    renderWithI18n(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText(/2 equipas/)).toBeInTheDocument();
  });
});
