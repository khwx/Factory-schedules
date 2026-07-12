import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScenarioCard from '../ScenarioCard';
import { I18nProvider } from '../../i18n';
import { Scenario } from '../../types';

const wrapper = ({ children }: { children: React.ReactNode }) => <I18nProvider>{children}</I18nProvider>;

const mockScenario: Scenario = {
  id: '1',
  name: 'Test Scenario',
  teams: 5,
  shiftDuration: 8,
  pattern: 'MMTTNNFFFF',
  weeklyHoursContract: 40,
};

describe('ScenarioCard', () => {
  it('renders scenario name and metrics', () => {
    render(
      <ScenarioCard
        scenario={mockScenario}
        onDelete={() => {}}
        onEdit={() => {}}
        onViewCalendar={() => {}}
        onExport={() => {}}
        onToggleHidden={() => {}}
        onDuplicate={() => {}}
      />,
      { wrapper }
    );
    
    expect(screen.getByText('Test Scenario')).toBeInTheDocument();
  });

  it('shows drag handle', () => {
    render(
      <ScenarioCard
        scenario={mockScenario}
        onDelete={() => {}}
        onEdit={() => {}}
        onViewCalendar={() => {}}
        onExport={() => {}}
        onToggleHidden={() => {}}
        onDuplicate={() => {}}
      />,
      { wrapper }
    );
    
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
  });

  it('shows PDF export button when onExportPDF is provided', () => {
    render(
      <ScenarioCard
        scenario={mockScenario}
        onDelete={() => {}}
        onEdit={() => {}}
        onViewCalendar={() => {}}
        onExport={() => {}}
        onExportPDF={() => {}}
        onToggleHidden={() => {}}
        onDuplicate={() => {}}
      />,
      { wrapper }
    );
    
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('does not show PDF export button when onExportPDF is not provided', () => {
    render(
      <ScenarioCard
        scenario={mockScenario}
        onDelete={() => {}}
        onEdit={() => {}}
        onViewCalendar={() => {}}
        onExport={() => {}}
        onToggleHidden={() => {}}
        onDuplicate={() => {}}
      />,
      { wrapper }
    );
    
    expect(screen.queryByText('PDF')).not.toBeInTheDocument();
  });

  it('shows multi-team calendar button when teams > 1', () => {
    render(
      <ScenarioCard
        scenario={mockScenario}
        onDelete={() => {}}
        onEdit={() => {}}
        onViewCalendar={() => {}}
        onViewMultiTeamCalendar={() => {}}
        onExport={() => {}}
        onToggleHidden={() => {}}
        onDuplicate={() => {}}
      />,
      { wrapper }
    );
    
    expect(screen.getByText(/multi/i)).toBeInTheDocument();
  });
});
