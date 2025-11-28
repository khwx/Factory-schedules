import React, { useState } from 'react';
import { BookOpen, ChevronDown, Plus } from 'lucide-react';
import { PRESET_SCENARIOS, PresetScenario } from '../data/presetScenarios';

interface PresetSelectorProps {
    onLoadPreset: (preset: PresetScenario) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onLoadPreset }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-between shadow-lg"
            >
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Carregar Cenário de Exemplo</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                    {PRESET_SCENARIOS.map((preset, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onLoadPreset(preset);
                                setIsOpen(false);
                            }}
                            className="w-full text-left p-4 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white mb-1">{preset.name}</h4>
                                    <p className="text-sm text-gray-400 mb-2">{preset.description}</p>
                                    <div className="flex gap-4 text-xs text-gray-500">
                                        <span>{preset.teams} equipas</span>
                                        <span>Turno: {preset.shiftDuration}h</span>
                                        <span>Contrato: {preset.weeklyHoursContract}h/sem</span>
                                        <span className="font-mono">{preset.pattern}</span>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-blue-400 flex-shrink-0 ml-4" />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PresetSelector;
