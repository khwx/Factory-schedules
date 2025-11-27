import React, { useMemo } from 'react';
import { Trash2, Clock, Calendar, Download, Eye, Palmtree } from 'lucide-react';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';

interface ScenarioCardProps {
    scenario: Scenario;
    onDelete: (id: string) => void;
    onViewCalendar: (scenario: Scenario) => void;
    onExport: (scenario: Scenario) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onDelete, onViewCalendar, onExport }) => {
    const analysis = useMemo(() => calculateAnalysis(scenario), [scenario]);

    const getShiftColor = (char: string) => {
        switch (char) {
            case 'M': return 'bg-yellow-500';
            case 'T': return 'bg-orange-500';
            case 'N': return 'bg-blue-600';
            case 'F': return 'bg-gray-600';
            default: return 'bg-gray-700';
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
            <div className="p-4 border-b border-gray-700 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
                    <p className="text-sm text-gray-400">
                        {scenario.teams} Equipas • Turnos de {scenario.shiftDuration}h
                    </p>
                </div>
                <button
                    onClick={() => onDelete(scenario.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                    title="Eliminar Cenário"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Pattern Visualization */}
                <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Padrão de Rotação</p>
                    <div className="flex h-4 rounded overflow-hidden">
                        {scenario.pattern.split('').map((char, i) => (
                            <div
                                key={i}
                                className={`flex-1 ${getShiftColor(char)}`}
                                title={`Day ${i + 1}: ${char}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
                        <span>Dia 1</span>
                        <span>Dia {scenario.pattern.length}</span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">Média Semanal</span>
                        </div>
                        <div className={`text-lg font-bold ${analysis.avgWeeklyHours > 40 ? 'text-red-400' : 'text-white'}`}>
                            {analysis.avgWeeklyHours.toFixed(1)}h
                        </div>
                    </div>

                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">Fins de Semana</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                            {analysis.weekendsOffPerYear}
                        </div>
                    </div>

                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Palmtree className="w-4 h-4" />
                            <span className="text-xs">Dias de Folga</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                            {analysis.totalOffDaysPerYear}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => onViewCalendar(scenario)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Ver Calendário
                    </button>
                    <button
                        onClick={() => onExport(scenario)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Exportar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScenarioCard;
