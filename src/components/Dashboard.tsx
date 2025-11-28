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
import { X, Download } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [scenarios, setScenarios] = useState<Scenario[]>(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(scenarios));
    }, [scenarios]);

    const analyses = useMemo(() => {
        return scenarios.map(s => calculateAnalysis(s));
    }, [scenarios]);

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

    return (
        <div className="max-w-7xl mx-auto px-4">
            <ScenarioForm
                onAdd={handleAddScenario}
                onUpdate={handleUpdateScenario}
                onCancelEdit={handleCancelEdit}
                editingScenario={editingScenario}
            />

            {scenarios.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {scenarios.map(scenario => (
                            <ScenarioCard
                                key={scenario.id}
                                scenario={scenario}
                                onDelete={handleDeleteScenario}
                                onEdit={handleEditScenario}
                                onViewCalendar={handleViewCalendar}
                                onExport={handleExport}
                            />
                        ))}
                    </div>

                    <ComparisonTable scenarios={scenarios} />

                    {/* Advanced Metrics, Multi-Year Analysis, and Team Fairness for each scenario */}
                    <div className="mt-8 space-y-6">
                        {scenarios.map((scenario, idx) => (
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
