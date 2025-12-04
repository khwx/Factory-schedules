import React, { useState, useEffect, useMemo } from 'react';
import ScenarioForm from './ScenarioForm';
import ScenarioCard from './ScenarioCard';
import ComparisonTable from './ComparisonTable';
import YearCalendarView from './YearCalendarView';
import { MultiTeamCalendarView } from './MultiTeamCalendarView';
import MultiYearAnalysis from './MultiYearAnalysis';
import TeamFairness from './TeamFairness';
import AdvancedMetricsDisplay from './AdvancedMetricsDisplay';
import ComparisonCharts from './ComparisonCharts';
import WorkloadHeatmap from './WorkloadHeatmap';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { exportToExcel, exportComparison } from '../utils/export';
import { X, Download, Filter, Search } from 'lucide-react';
import PresetSelector from './PresetSelector';
import ICSImporter from './ICSImporter';
import { PresetScenario } from '../data/presetScenarios';

const Dashboard: React.FC = () => {
    const [scenarios, setScenarios] = useState<Scenario[]>(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMultiTeamCalendar, setShowMultiTeamCalendar] = useState(false);
    const [showHidden, setShowHidden] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTeams, setFilterTeams] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'name' | 'weekends' | 'hours'>('name');

    useEffect(() => {
        localStorage.setItem('shiftsim_scenarios', JSON.stringify(scenarios));
    }, [scenarios]);

    // Filter and sort scenarios
    const visibleScenarios = useMemo(() => {
        let filtered = showHidden ? scenarios : scenarios.filter(s => !s.hidden);

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply team filter
        if (filterTeams !== null) {
            filtered = filtered.filter(s => s.teams === filterTeams);
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'weekends') {
                const analysisA = calculateAnalysis(a);
                const analysisB = calculateAnalysis(b);
                return analysisB.weekendsOffPerYear - analysisA.weekendsOffPerYear;
            } else if (sortBy === 'hours') {
                const analysisA = calculateAnalysis(a);
                const analysisB = calculateAnalysis(b);
                return analysisA.avgWeeklyHours - analysisB.avgWeeklyHours;
            }
            return 0;
        });

        return sorted;
    }, [scenarios, showHidden, searchTerm, filterTeams, sortBy]);

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
        setScenarios(scenarios.map(s => s.id === id ? { ...s, ...updatedData } : s));
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
            teamPatterns: preset.teamPatterns,
            startDate: preset.startDate,
        };
        setScenarios([...scenarios, scenario]);
    };

    const handleToggleHidden = (id: string) => {
        setScenarios(scenarios.map(s =>
            s.id === id ? { ...s, hidden: !s.hidden } : s
        ));
    };

    const handleDuplicate = (scenario: Scenario) => {
        const duplicated: Scenario = {
            ...scenario,
            id: crypto.randomUUID(),
            name: `${scenario.name} (Cópia)`,
        };
        setScenarios([...scenarios, duplicated]);
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <ICSImporter onImport={handleAddScenario} />

            <PresetSelector onLoadPreset={handleLoadPreset} />

            <ScenarioForm
                onAdd={handleAddScenario}
                onUpdate={handleUpdateScenario}
                onCancelEdit={handleCancelEdit}
                editingScenario={editingScenario}
            />

            {scenarios.length > 0 && (
                <>
                    {/* Search and Filter Bar */}
                    <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Pesquisar cenários..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Team Filter */}
                            <div className="flex gap-2">
                                <select
                                    value={filterTeams ?? ''}
                                    onChange={(e) => setFilterTeams(e.target.value ? Number(e.target.value) : null)}
                                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Todas as Equipas</option>
                                    {[...new Set(scenarios.map(s => s.teams))].sort((a, b) => a - b).map(num => (
                                        <option key={num} value={num}>{num} Equipas</option>
                                    ))}
                                </select>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="name">Ordenar: Nome</option>
                                    <option value="weekends">Ordenar: Fins de Semana</option>
                                    <option value="hours">Ordenar: Horas Semanais</option>
                                </select>
                            </div>

                            {/* Show Hidden Toggle */}
                            <button
                                onClick={() => setShowHidden(!showHidden)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${showHidden
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
                    </div>
                </>
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
                                onDuplicate={handleDuplicate}
                                onViewMultiTeamCalendar={(s) => {
                                    setSelectedScenario(s);
                                    setShowMultiTeamCalendar(true);
                                }}
                                onExport={handleExport}
                            />
                        ))}
                    </div>

                    <ComparisonTable scenarios={visibleScenarios} />

                    {/* Comparison Charts */}
                    {visibleScenarios.length > 1 && (
                        <ComparisonCharts scenarios={visibleScenarios} analyses={analyses} />
                    )}

                    {/* Advanced Metrics, Multi-Year Analysis, Heatmap and Team Fairness for each scenario */}
                    <div className="mt-8 space-y-6">
                        {visibleScenarios.map((scenario, idx) => (
                            <div key={scenario.id} className="space-y-6">
                                {analyses[idx].advancedMetrics && (
                                    <AdvancedMetricsDisplay
                                        metrics={analyses[idx].advancedMetrics!}
                                        scenarioName={scenario.name}
                                    />
                                )}
                                <WorkloadHeatmap scenario={scenario} />
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
                            <h2 className="text-xl font-semibold text-white">Vista de Calendário Anual</h2>
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

            {/* Multi-Team Calendar Modal */}
            {showMultiTeamCalendar && selectedScenario && selectedScenario.teams > 1 && (
                <MultiTeamCalendarView
                    scenario={selectedScenario}
                    onClose={() => setShowMultiTeamCalendar(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
