import React, { useState, useEffect, useRef } from 'react';
import { Plus, HelpCircle, Zap, AlertCircle } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioFormProps {
    onAdd: (scenario: Omit<Scenario, 'id'>) => void;
    onUpdate?: (id: string, scenario: Omit<Scenario, 'id'>) => void;
    onCancelEdit?: () => void;
    editingScenario?: Scenario | null;
}

const VALID_SHIFT_CHARS = /^[MTNFmtnf\s]+$/;
const MAX_TEAMS = 10;
const MIN_TEAMS = 1;

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onAdd, onUpdate, onCancelEdit, editingScenario }) => {
    const [name, setName] = useState('');
    const [teams, setTeams] = useState(4);
    const [shiftDuration, setShiftDuration] = useState(8);
    const [weeklyHoursContract, setWeeklyHoursContract] = useState(40);
    const [pattern, setPattern] = useState('');
    const [patternError, setPatternError] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const teamsRef = useRef<HTMLInputElement>(null);
    const shiftDurationRef = useRef<HTMLInputElement>(null);
    const weeklyHoursRef = useRef<HTMLInputElement>(null);
    const patternRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingScenario) {
            setName(editingScenario.name);
            setTeams(editingScenario.teams);
            setShiftDuration(editingScenario.shiftDuration);
            setWeeklyHoursContract(editingScenario.weeklyHoursContract || 40);
            setPattern(editingScenario.pattern);
        } else {
            setName('');
            setTeams(4);
            setShiftDuration(8);
            setWeeklyHoursContract(40);
            setPattern('');
        }
        // Focus on the name field when the form opens or when editing scenario changes
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, [editingScenario]);

    const validatePattern = (value: string): boolean => {
        if (!value) {
            setPatternError('');
            return false;
        }

        const cleaned = value.toUpperCase().replace(/\s/g, '');

        if (!VALID_SHIFT_CHARS.test(cleaned)) {
            setPatternError('Apenas M (Manha), T (Tarde), N (Noite) e F (Folga) sao permitidos');
            return false;
        }

        if (cleaned.length < 5) {
            setPatternError('Padrao demasiado curto (minimo 5 caracteres)');
            return false;
        }

        if (cleaned.length > 60) {
            setPatternError('Padrao demasiado longo (maximo 60 caracteres)');
            return false;
        }

        const hasWorkShifts = /[MTN]/.test(cleaned);
        if (!hasWorkShifts) {
            setPatternError('Padrao deve converter pelo menos um turno de trabalho (M, T ou N)');
            return false;
        }

        setPatternError('');
        return true;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= MIN_TEAMS && value <= MAX_TEAMS) {
            setTeams(value);
        }
    };

    const handleShiftDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShiftDuration(Number(e.target.value));
    };

    const handleWeeklyHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeeklyHoursContract(Number(e.target.value));
    };

    const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPattern(value);
        validatePattern(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !pattern) {
            // Focus on the first empty field
            if (!name && nameRef.current) {
                nameRef.current.focus();
                return;
            }
            if (!pattern && patternRef.current) {
                patternRef.current.focus();
                return;
            }
            return;
        }

        if (!validatePattern(pattern)) {
            if (patternRef.current) {
                patternRef.current.focus();
            }
            return;
        }

        const cleanedPattern = pattern.toUpperCase().replace(/\s/g, '');
        const scenarioData = {
            name,
            teams,
            shiftDuration,
            weeklyHoursContract,
            pattern: cleanedPattern,
        };

        if (editingScenario && onUpdate) {
            onUpdate(editingScenario.id, scenarioData);
        } else {
            onAdd(scenarioData);
        }

        if (!editingScenario) {
            setName('');
            setTeams(4);
            setShiftDuration(8);
            setWeeklyHoursContract(40);
            setPattern('');
            // Focus on name field for next entry
            if (nameRef.current) {
                nameRef.current.focus();
            }
        }
    };

    const handleAutoCalculate = () => {
        if (teams > 0 && shiftDuration > 0) {
            setIsCalculating(true);
            // Calculate approximate weekly hours based on pattern
            // This is a simplified calculation - in reality this would be more complex
            const estimatedHours = (shiftDuration * teams * 5) / 7; // Rough estimate
            setWeeklyHoursContract(Math.round(estimatedHours * 2) / 2); // Round to nearest 0.5
            
            // Reset after a short delay
            setTimeout(() => {
                setIsCalculating(false);
            }, 1500);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                {editingScenario ? 'Editar Cenario' : 'Criar Novo Cenario'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div className="lg:col-span-1">
                    <label htmlFor="scenario-name" className="block text-sm font-medium text-gray-400 mb-1">
                        Nome do Cenario
                    </label>
                    <input
                        ref={nameRef}
                        id="scenario-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="ex: 4 Equipas - Continental"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                        aria-describedby="name-help"
                    />
                </div>

                <div className="lg:col-span-1">
                    <label htmlFor="teams-count" className="block text-sm font-medium text-gray-400 mb-1">
                        Equipas
                    </label>
                    <input
                        ref={teamsRef}
                        id="teams-count"
                        type="number"
                        value={teams}
                        onChange={handleTeamsChange}
                        min={String(MIN_TEAMS)}
                        max={String(MAX_TEAMS)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div className="lg:col-span-1">
                    <label htmlFor="shift-duration" className="block text-sm font-medium text-gray-400 mb-1">
                        Duracao Turno (h)
                    </label>
                    <input
                        ref={shiftDurationRef}
                        id="shift-duration"
                        type="number"
                        value={shiftDuration}
                        onChange={handleShiftDurationChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        min="1"
                        step="0.5"
                        required
                    />
                </div>

                <div className="lg:col-span-1">
                    <label htmlFor="weekly-hours" className="block text-sm font-medium text-gray-400 mb-1">
                        Horas Semanais (Contrato)
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            ref={weeklyHoursRef}
                            id="weekly-hours"
                            type="number"
                            value={weeklyHoursContract}
                            onChange={handleWeeklyHoursChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 flex-1"
                            min="1"
                            step="0.5"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleAutoCalculate}
                            disabled={isCalculating}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Calcular duracao automaticamente"
                            aria-busy={isCalculating}
                        >
                            {isCalculating ? (
                                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            ) : (
                                <Zap className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <label htmlFor="pattern" className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                        Padrao de Rotacao
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" aria-label="Ajuda sobre padrao de rotacao" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black text-xs text-gray-300 rounded hidden group-hover:block z-10">
                                Insira a sequencia de turnos para UMA equipa. Use M (Manha), T (Tarde), N (Noite), F (Folga). Exemplo: MM TT NN FFFF
                            </div>
                        </div>
                    </label>
                    <input
                        ref={patternRef}
                        id="pattern"
                        type="text"
                        value={pattern}
                        onChange={handlePatternChange}
                        placeholder="ex: MM TT NN FFFF"
                        className={`w-full bg-gray-700 border rounded px-3 py-2 text-white focus:outline-none font-mono uppercase ${
                            patternError ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                        required
                        aria-invalid={!!patternError}
                        aria-describedby={patternError ? 'pattern-error' : undefined}
                    />
                    {patternError && (
                        <p id="pattern-error" className="text-red-400 text-xs mt-1 flex items-center gap-1" role="alert">
                            <AlertCircle className="w-3 h-3" />
                            {patternError}
                        </p>
                    )}
                </div>

                <div className="lg:col-span-6 flex justify-end mt-2 gap-2">
                    {editingScenario && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!!patternError || !name || !pattern}
                        className={`${editingScenario ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Plus className="w-4 h-4" />
                        {editingScenario ? 'Atualizar Cenario' : 'Adicionar Cenario'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScenarioForm;
