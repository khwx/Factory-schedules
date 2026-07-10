import React from 'react';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { Scenario } from '../types';
import { PlayCircle, ArrowRight } from 'lucide-react';

interface DemoModeProps {
    onSelectScenario: (scenario: Scenario) => void;
    onClose: () => void;
}

const DemoMode: React.FC<DemoModeProps> = ({ onSelectScenario, onClose }) => {
    const handleLoadPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
        const scenario: Scenario = {
            id: crypto.randomUUID(),
            name: preset.name,
            teams: preset.teams,
            shiftDuration: preset.shiftDuration,
            weeklyHoursContract: preset.weeklyHoursContract,
            pattern: preset.pattern,
            teamPatterns: preset.teamPatterns,
            startDate: preset.startDate,
        };
        onSelectScenario(scenario);
        onClose();
    };

    const handleLoadAll = () => {
        PRESET_SCENARIOS.forEach(preset => {
            const scenario: Scenario = {
                id: crypto.randomUUID(),
                name: preset.name,
                teams: preset.teams,
                shiftDuration: preset.shiftDuration,
                weeklyHoursContract: preset.weeklyHoursContract,
                pattern: preset.pattern,
                teamPatterns: preset.teamPatterns,
                startDate: preset.startDate,
            };
            onSelectScenario(scenario);
        });
        onClose();
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Modo Demonstracao</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
                Carregue cenarios de exemplo para explorar as funcionalidades do ShiftSim Factory.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {PRESET_SCENARIOS.map((preset, i) => (
                    <button
                        key={i}
                        onClick={() => handleLoadPreset(preset)}
                        className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600 hover:border-gray-500"
                    >
                        <div className="font-medium text-white text-sm">{preset.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {preset.teams} equipas | {preset.shiftDuration}h | {preset.pattern.length} dias
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleLoadAll}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    Carregar Todos os Cenarios
                    <ArrowRight className="w-4 h-4" />
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default DemoMode;
