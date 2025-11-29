import React, { useState, useEffect, useMemo } from 'react';
import ScenarioForm from './ScenarioForm';
import ScenarioCard from './ScenarioCard';
import ComparisonTable from './ComparisonTable';
import YearCalendarView from './YearCalendarView';
import MultiYearAnalysis from './MultiYearAnalysis';
import TeamFairness from './TeamFairness';
import AdvancedMetricsDisplay from './AdvancedMetricsDisplay';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { exportToExcel, exportComparison } from '../utils/export';
import { X, Download, Filter } from 'lucide-react';
import PresetSelector from './PresetSelector';
import { PresetScenario } from '../data/presetScenarios';

const Dashboard: React.FC = () => {
    const [scenarios, setScenarios] = useState<Scenario[]>(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showHidden, setShowHidden] = useState(false);

    useEffect(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(scenarios));
    }, [scenarios]);

    // Filter scenarios based on visibility
    const visibleScenarios = useMemo(() => {
        return showHidden ? scenarios : scenarios.filter(s => !s.hidden);
    }, [scenarios, showHidden]);

    const analyses = useMemo(() => {
        return visibleScenarios.map(s => calculateAnalysis(s));
    }, [visibleScenarios]);

    const handleAddScenario = (newScenario: Omit<Scenario, 'id'>) => {
        const scenario: Scenario = {
            ...newScenario,
            id: crypto.randomUUID(),
        };
        setScenarios([...scenarios, scenario]);
    };

    const handleDeleteScenario = (id: string) => {
        setScenarios(scenarios.filter(s => s.id !== id));
        if (editingScenario?.id === id) {
            setEditingScenario(null);
        }
    };

    const handleEditScenario = (scenario: Scenario) => {
        setEditingScenario(scenario);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpdateScenario = (id: string, updatedData: Omit<Scenario, 'id'>) => {
        setScenarios(scenarios.map(s => s.id === id ? { ...updatedData, id } : s));
        setEditingScenario(null);
    };

    const handleCancelEdit = () => {
        setEditingScenario(null);
    };

    const handleViewCalendar = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setShowCalendar(true);
    };

    const handleExport = (scenario: Scenario) => {
        const analysis = calculateAnalysis(scenario);
        exportToExcel(scenario, analysis);
    };

    const handleExportAll = () => {
        exportComparison(scenarios, analyses);
    };

    const handleLoadPreset = (preset: PresetScenario) => {
        const scenario: Scenario = {
            id: crypto.randomUUID(),
            name: preset.name,
            teams: preset.teams,
            shiftDuration: preset.shiftDuration,
            weeklyHoursContract: preset.weeklyHoursContract,
            pattern: preset.pattern,
        };
        setScenarios([...scenarios, scenario]);
    };

    const handleToggleHidden = (id: string) => {
        setScenarios(scenarios.map(s =>
            s.id === id ? { ...s, hidden: !s.hidden } : s
        ));
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <PresetSelector onLoadPreset={handleLoadPreset} />

            <ScenarioForm
                onAdd={handleAddScenario}
                onUpdate={handleUpdateScenario}
                onCancelEdit={handleCancelEdit}
                editingScenario={editingScenario}
            />

            {scenarios.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setShowHidden(!showHidden)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showHidden
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                        title={showHidden ? "Ocultar cenários escondidos" : "Mostrar cenários escondidos"}
                    >
                        <Filter className="w-4 h-4" />
                        {showHidden ? 'Ocultar Escondidos' : 'Mostrar Escondidos'}
                        {scenarios.filter(s => s.hidden).length > 0 && (
                            <span className="bg-gray-900 px-2 py-0.5 rounded-full text-xs">
                                {scenarios.filter(s => s.hidden).length}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {visibleScenarios.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {visibleScenarios.map(scenario => (
                            <ScenarioCard
                                key={scenario.id}
                                scenario={scenario}
                                onDelete={handleDeleteScenario}
                                onEdit={handleEditScenario}
                                onToggleHidden={handleToggleHidden}
                                onViewCalendar={handleViewCalendar}
                                onExport={handleExport}
                            />
                        ))}
                    </div>

                    <ComparisonTable scenarios={visibleScenarios} />

                    {/* Advanced Metrics, Multi-Year Analysis, and Team Fairness for each scenario */}
                    <div className="mt-8 space-y-6">
                        {visibleScenarios.map((scenario, idx) => (
                            <div key={scenario.id} className="space-y-6">
                                {analyses[idx].advancedMetrics && (
                                    <AdvancedMetricsDisplay
                                        metrics={analyses[idx].advancedMetrics!}
                                        scenarioName={scenario.name}
                                    />
                                )}
                                <MultiYearAnalysis
                                    multiYearData={analyses[idx].multiYearAnalysis}
                                    scenarioName={scenario.name}
                                />
                                <TeamFairness scenario={scenario} />
                            </div>
                        ))}
                    </div>

                    {/* Export All Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleExportAll}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Export All Scenarios to Excel
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>No scenarios created yet. Use the form above to get started.</p>
                </div>
            )}

            {/* Calendar Modal */}
            {showCalendar && selectedScenario && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Annual Calendar View</h2>
                            <button
                                onClick={() => setShowCalendar(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <YearCalendarView scenario={selectedScenario} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
