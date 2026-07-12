import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScenarioForm from '../ScenarioForm';
import { I18nProvider } from '../../i18n';
import { Scenario } from '../../types';

const wrapper = ({ children }: { children: React.ReactNode }) => <I18nProvider>{children}</I18nProvider>;

describe('ScenarioForm', () => {
  it('renders the form with all inputs', () => {
    render(<ScenarioForm onAdd={() => {}} />, { wrapper });

    expect(screen.getByLabelText('Nome do Cenario')).toBeInTheDocument();
    expect(screen.getByLabelText('Equipas')).toBeInTheDocument();
    expect(screen.getByLabelText('Duracao Turno (h)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ex: MM TT NN FFFF')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ScenarioForm onAdd={() => {}} />, { wrapper });

    expect(screen.getByRole('button', { name: /adicionar cenario/i })).toBeInTheDocument();
  });

  it('does not call onAdd when name is empty', async () => {
    const handleAdd = vi.fn();
    render(<ScenarioForm onAdd={handleAdd} />, { wrapper });

    fireEvent.change(screen.getByLabelText('Equipas'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('ex: MM TT NN FFFF'), { target: { value: 'MMTTNNFFFF' } });

    const submitButton = screen.getByRole('button', { name: /adicionar cenario/i });
    fireEvent.click(submitButton);

    expect(handleAdd).not.toHaveBeenCalled();
  });

  it('shows pattern error for invalid characters', async () => {
    render(<ScenarioForm onAdd={() => {}} />, { wrapper });

    const patternInput = screen.getByPlaceholderText('ex: MM TT NN FFFF');
    fireEvent.change(patternInput, { target: { value: 'XYZ' } });

    const errorEl = screen.getByText(/apenas/i);
    expect(errorEl).toBeInTheDocument();
  });

  it('shows pattern error for too short pattern', async () => {
    render(<ScenarioForm onAdd={() => {}} />, { wrapper });

    const patternInput = screen.getByPlaceholderText('ex: MM TT NN FFFF');
    fireEvent.change(patternInput, { target: { value: 'MT' } });

    expect(screen.getByText(/demasiado curto/i)).toBeInTheDocument();
  });

  it('shows edit mode with update button', () => {
    const scenario: Scenario = {
      id: '1',
      name: 'Existing',
      teams: 5,
      shiftDuration: 8,
      pattern: 'MMTTNNFFFF',
    };

    render(<ScenarioForm onAdd={() => {}} onUpdate={() => {}} editingScenario={scenario} />, { wrapper });

    expect(screen.getByRole('button', { name: /atualizar cenario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let submittedData: any = null;
    const handleSubmit = (data: Omit<Scenario, 'id'>) => {
      submittedData = data;
    };

    render(<ScenarioForm onAdd={handleSubmit} />, { wrapper });

    fireEvent.change(screen.getByLabelText('Nome do Cenario'), { target: { value: 'Test Scenario' } });
    fireEvent.change(screen.getByLabelText('Equipas'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Duracao Turno (h)'), { target: { value: '8' } });
    fireEvent.change(screen.getByPlaceholderText('ex: MM TT NN FFFF'), { target: { value: 'MMTTNNFFFF' } });

    const submitButton = screen.getByRole('button', { name: /adicionar cenario/i });
    fireEvent.click(submitButton);

    expect(submittedData).not.toBeNull();
    expect(submittedData?.name).toBe('Test Scenario');
    expect(submittedData?.teams).toBe(5);
    expect(submittedData?.shiftDuration).toBe(8);
    expect(submittedData?.pattern).toBe('MMTTNNFFFF');
  });
});
