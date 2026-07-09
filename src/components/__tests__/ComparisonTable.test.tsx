import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComparisonTable from '../ComparisonTable';
import { Scenario } from '../../types';

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

describe('ComparisonTable', () => {
  it('renders comparison table with scenarios', () => {
    render(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Comparação de Cenários')).toBeInTheDocument();
    expect(screen.getByText('Scenario A')).toBeInTheDocument();
    expect(screen.getByText('Scenario B')).toBeInTheDocument();
  });

  it('displays metrics for each scenario', () => {
    render(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Horas Semanais Médias')).toBeInTheDocument();
    expect(screen.getByText('Horas Anuais Totais')).toBeInTheDocument();
    expect(screen.getByText('Fins de Semana de Folga')).toBeInTheDocument();
  });

  it('shows configuration section', () => {
    render(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Configuração')).toBeInTheDocument();
    expect(screen.getByText('MMTTNNFFFF')).toBeInTheDocument();
    expect(screen.getByText('MMMMTTTTNNNNFFFF')).toBeInTheDocument();
  });

  it('shows advanced metrics when available', () => {
    render(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('Dias Máx. Consecutivos de Trabalho')).toBeInTheDocument();
    expect(screen.getByText('Mini-Férias (3+ dias folga)')).toBeInTheDocument();
  });

  it('returns null when no scenarios', () => {
    const { container } = render(<ComparisonTable scenarios={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows scenario count', () => {
    render(<ComparisonTable scenarios={mockScenarios} />);
    
    expect(screen.getByText('2 cenários')).toBeInTheDocument();
  });
});
