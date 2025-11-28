import React, { useState, useEffect } from 'react';
import { Plus, HelpCircle, Zap } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioFormProps {
    onAdd: (scenario: Omit<Scenario, 'id'>) => void;
    onUpdate?: (id: string, scenario: Omit<Scenario, 'id'>) => void;
    onCancelEdit?: () => void;
    editingScenario?: Scenario | null;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onAdd, onUpdate, onCancelEdit, editingScenario }) => {
    const [name, setName] = useState('');
    const [teams, setTeams] = useState(4);
    const [shiftDuration, setShiftDuration] = useState(8);
    const [weeklyHoursContract, setWeeklyHoursContract] = useState(40);
    const [pattern, setPattern] = useState('');

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
    }, [editingScenario]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !pattern) return;

        const scenarioData = {
            name,
            teams,
            shiftDuration,
            weeklyHoursContract,
            pattern: pattern.toUpperCase(),
        };

        if (editingScenario && onUpdate) {
            onUpdate(editingScenario.id, scenarioData);
        } else {
            onAdd(scenarioData);
        }

        if (!editingScenario) {
            setName('');
            setPattern('');
        }
    };

    const calculateAutoDuration = () => {
        if (!pattern) return;

        const cleanPattern = pattern.toUpperCase().replace(/\s/g, '');
        const workDays = cleanPattern.split('').filter(c => c !== 'F').length;
        const totalDays = cleanPattern.length;

        if (workDays === 0) return;

        // Calculate: (Weekly Hours × Total Days) / (Work Days × 7)
        const calculatedDuration = (weeklyHoursContract * totalDays) / (workDays * 7);
        setShiftDuration(Math.round(calculatedDuration * 10) / 10); // Round to 1 decimal
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                {editingScenario ? 'Editar Cenário' : 'Criar Novo Cenário'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Cenário</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ex: 4 Equipas - Continental"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Equipas</label>
                    <input
                        type="number"
                        value={teams}
                        onChange={(e) => setTeams(Number(e.target.value))}
                        min={1}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Duração Turno (h)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={shiftDuration}
                            onChange={(e) => setShiftDuration(Number(e.target.value))}
                            step="0.1"
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={calculateAutoDuration}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors flex items-center gap-1"
                            title="Calcular automaticamente com base nas horas contratuais e padrão"
                        >
                            <Zap className="w-4 h-4" />
                            Auto
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Horas Semanais (Contrato)</label>
                    <input
                        type="number"
                        value={weeklyHoursContract}
                        onChange={(e) => setWeeklyHoursContract(Number(e.target.value))}
                        step="0.5"
                        min="1"
                        max="168"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                        Padrão de Rotação
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black text-xs text-gray-300 rounded hidden group-hover:block z-10">
                                Insira a sequência de turnos para UMA equipa. Use M (Manhã), T (Tarde), N (Noite), F (Folga). Exemplo: MM TT NN FFFF
                            </div>
                        </div>
                    </label>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="ex: MM TT NN FFFF"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                        required
                    />
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
                        className={`${editingScenario ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded transition-colors flex items-center gap-2`}
                    >
                        <Plus className="w-4 h-4" />
                        {editingScenario ? 'Atualizar Cenário' : 'Adicionar Cenário'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScenarioForm;
