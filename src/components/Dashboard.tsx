import React, { useState, useEffect, useMemo, useCallback, useRef, lazy } from 'react';
import ScenarioForm from './ScenarioForm';
import ScenarioCard from './ScenarioCard';
import ComparisonTable from './ComparisonTable';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { exportToExcel, exportComparison } from '../utils/export';
import { exportScenarioToPDF, exportComparisonToPDF } from '../utils/pdfExport';
import { exportScenarioToCSV, exportScenarioToJSON, exportComparisonToCSV, exportComparisonToJSON } from '../utils/csvJsonExport';
import { downloadICS } from '../utils/icsExport';
import { checkForSharedScenario, copyShareableLink } from '../utils/shareScenario';
import { X, Download, Filter, Search, Wand2, Undo2, Redo2, FileText, Table2, Code2, Play } from 'lucide-react';
import PresetSelector from './PresetSelector';
import ICSImporter from './ICSImporter';
import { PresetScenario, PRESET_SCENARIOS } from '../data/presetScenarios';
import GeneratorUI from './ScheduleGenerator';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePreferences } from '../hooks/usePreferences';
import { useI18n } from '../i18n';
import { LazyLoad } from './LazyErrorBoundary';
import { ShortcutsHelp, useShortcutsHelp } from './ShortcutsHelp';

// Lazy load heavy components for better performance
const YearCalendarView = lazy(() => import('./YearCalendarView'));
const MultiTeamCalendarView = lazy(() => import('./MultiTeamCalendarView').then(m => ({ default: m.MultiTeamCalendarView })));
const MultiYearAnalysis = lazy(() => import('./MultiYearAnalysis'));
const TeamFairness = lazy(() => import('./TeamFairness'));
const AdvancedMetricsDisplay = lazy(() => import('./AdvancedMetricsDisplay'));
const ComparisonCharts = lazy(() => import('./ComparisonCharts'));
const WorkloadHeatmap = lazy(() => import('./WorkloadHeatmap'));
const QualityOfLifeDisplay = lazy(() => import('./QualityOfLifeDisplay'));
const TeamAnalysis = lazy(() => import('./TeamAnalysis'));
const DemoMode = lazy(() => import('./DemoMode'));
const LegalComplianceBanner = lazy(() => import('./LegalComplianceBanner'));
const PayEstimateDisplay = lazy(() => import('./PayEstimateDisplay'));


const Dashboard: React.FC = () => {
    const [scenarios, setScenarios] = useState<Scenario[]>(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }

        // First visit - load all presets as examples
        const presetsAsScenarios: Scenario[] = PRESET_SCENARIOS.map(preset => ({
            id: crypto.randomUUID(),
            name: preset.name,
            teams: preset.teams,
            shiftDuration: preset.shiftDuration,
            weeklyHoursContract: preset.weeklyHoursContract,
            pattern: preset.pattern,
            teamPatterns: preset.teamPatterns,
            startDate: preset.startDate,
        }));

        return presetsAsScenarios;
    });

    // Undo/Redo history
    const historyRef = useRef<Scenario[][]>([scenarios]);
    const historyIndexRef = useRef<number>(0);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const { t } = useI18n();
    const shortcutsHelp = useShortcutsHelp();

    // Check for shared scenario in URL hash on first load
    useEffect(() => {
        const sharedData = checkForSharedScenario();
        if (sharedData && sharedData.n && sharedData.t && sharedData.d && sharedData.p) {
            const sharedScenario: Scenario = {
                id: crypto.randomUUID(),
                name: sharedData.n,
                teams: sharedData.t,
                shiftDuration: sharedData.d,
                weeklyHoursContract: sharedData.w,
                pattern: sharedData.p,
                teamPatterns: sharedData.tp,
                startDate: sharedData.s,
                description: sharedData.desc,
            };
            updateScenariosWithHistory(prev => [...prev, sharedScenario]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateScenariosWithHistory = useCallback((newScenarios: Scenario[] | ((prev: Scenario[]) => Scenario[])) => {
        setScenarios((currentScenarios) => {
            const resolvedScenarios = newScenarios instanceof Function ? newScenarios(currentScenarios) : newScenarios;

            // Trim future history if we're not at the end
            const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
            newHistory.push(resolvedScenarios);

            // Keep max 50 history states
            if (newHistory.length > 50) {
                newHistory.shift();
            } else {
                historyIndexRef.current++;
            }

            historyRef.current = newHistory;
            setCanUndo(historyIndexRef.current > 0);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);

            return resolvedScenarios;
        });
    }, []);

    const undo = useCallback(() => {
        if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const previousState = historyRef.current[historyIndexRef.current];
            setScenarios(previousState);
            setCanUndo(historyIndexRef.current > 0);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        }
    }, []);

    const redo = useCallback(() => {
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const nextState = historyRef.current[historyIndexRef.current];
            setScenarios(nextState);
            setCanUndo(historyIndexRef.current > 0);
            setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
        }
    }, []);

    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
    const [showGenerator, setShowGenerator] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMultiTeamCalendar, setShowMultiTeamCalendar] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { sortBy, filterTeams, showHidden, setSortBy, setFilterTeams, setShowHidden } = usePreferences();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const calendarModalRef = useFocusTrap(showCalendar);
    const generatorModalRef = useFocusTrap(showGenerator);
    const [showDemoMode, setShowDemoMode] = useState(false);

    // Keyboard shortcuts
    const handleEscape = useCallback(() => {
        if (showCalendar) setShowCalendar(false);
        else if (showMultiTeamCalendar) setShowMultiTeamCalendar(false);
        else if (showGenerator) setShowGenerator(false);
        else if (showDemoMode) setShowDemoMode(false);
        else if (editingScenario) setEditingScenario(null);
    }, [showCalendar, showMultiTeamCalendar, showGenerator, showDemoMode, editingScenario]);

    const handleSearchFocus = useCallback(() => {
        searchInputRef.current?.focus();
    }, []);

    const handleNewScenario = useCallback(() => {
        const nameInput = document.getElementById('scenario-name') as HTMLInputElement | null;
        nameInput?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('shiftsim_scenarios', JSON.stringify(scenarios));
        } catch (_e) {
            console.error('Failed to save scenarios to localStorage (quota exceeded?)');
        }
    }, [scenarios]);

    // Memoized analysis calculations
    const analyses = useMemo(() => {
        return scenarios.map(s => calculateAnalysis(s));
    }, [scenarios]);

    // Filter and sort scenarios
    const visibleScenarios = useMemo(() => {
        let filtered = showHidden ? scenarios : scenarios.filter(s => !s.hidden);

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(term)
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
                const idxA = scenarios.findIndex(s => s.id === a.id);
                const idxB = scenarios.findIndex(s => s.id === b.id);
                return (analyses[idxB]?.weekendsOffPerYear ?? 0) - (analyses[idxA]?.weekendsOffPerYear ?? 0);
            } else if (sortBy === 'hours') {
                const idxA = scenarios.findIndex(s => s.id === a.id);
                const idxB = scenarios.findIndex(s => s.id === b.id);
                return (analyses[idxA]?.avgWeeklyHours ?? 0) - (analyses[idxB]?.avgWeeklyHours ?? 0);
            }
            return 0;
        });

        return sorted;
    }, [scenarios, showHidden, searchTerm, filterTeams, sortBy, analyses]);

    const handleQuickAction = useCallback((index: number) => {
        const scenario = visibleScenarios[index];
        if (scenario) {
            setSelectedScenario(scenario);
            setShowCalendar(true);
        }
    }, [visibleScenarios]);

    useKeyboardShortcuts({
        onUndo: undo,
        onRedo: redo,
        onEscape: handleEscape,
        onSearch: handleSearchFocus,
        onNewScenario: handleNewScenario,
        onQuickAction: handleQuickAction,
    });

    // Memoized handlers
    const handleAddScenario = useCallback((newScenario: Omit<Scenario, 'id'>) => {
        const scenario: Scenario = {
            ...newScenario,
            id: crypto.randomUUID(),
        };
        updateScenariosWithHistory(prev => [...prev, scenario]);
    }, [updateScenariosWithHistory]);

    const handleDeleteScenario = useCallback((id: string) => {
        const scenario = scenarios.find(s => s.id === id);
        if (!scenario) return;
        if (!window.confirm(`Tem a certeza que deseja eliminar "${scenario.name}"?`)) return;
        updateScenariosWithHistory(prev => prev.filter(s => s.id !== id));
        setEditingScenario(prev => prev?.id === id ? null : prev);
    }, [updateScenariosWithHistory, scenarios]);

    const handleEditScenario = useCallback((scenario: Scenario) => {
        setEditingScenario(scenario);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleUpdateScenario = useCallback((id: string, updatedData: Omit<Scenario, 'id'>) => {
        updateScenariosWithHistory(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
        setEditingScenario(null);
    }, [updateScenariosWithHistory]);

    const handleCancelEdit = useCallback(() => {
        setEditingScenario(null);
    }, []);

    const handleViewCalendar = useCallback((scenario: Scenario) => {
        setSelectedScenario(scenario);
        setShowCalendar(true);
    }, []);

    const handleExport = useCallback((scenario: Scenario) => {
        const analysis = calculateAnalysis(scenario);
        exportToExcel(scenario, analysis);
    }, []);

    const handleExportPDF = useCallback((scenario: Scenario) => {
        const analysis = calculateAnalysis(scenario);
        exportScenarioToPDF(scenario, analysis);
    }, []);

    const handleExportAll = useCallback(() => {
        exportComparison(scenarios, analyses);
    }, [scenarios, analyses]);

    const handleExportAllPDF = useCallback(() => {
        exportComparisonToPDF(scenarios, analyses);
    }, [scenarios, analyses]);

    const handleExportCSV = useCallback((scenario: Scenario) => {
        const analysis = calculateAnalysis(scenario);
        exportScenarioToCSV(scenario, analysis);
    }, []);

    const handleExportJSON = useCallback((scenario: Scenario) => {
        const analysis = calculateAnalysis(scenario);
        exportScenarioToJSON(scenario, analysis);
    }, []);

    const handleExportAllCSV = useCallback(() => {
        exportComparisonToCSV(scenarios, analyses);
    }, [scenarios, analyses]);

    const handleExportAllJSON = useCallback(() => {
        exportComparisonToJSON(scenarios, analyses);
    }, [scenarios, analyses]);

    const handleExportICS = useCallback((scenario: Scenario) => {
        downloadICS(scenario);
    }, []);

    const handleShareScenario = useCallback((scenario: Scenario) => {
        copyShareableLink(scenario);
    }, []);

    const handleLoadPreset = useCallback((preset: PresetScenario) => {
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
        updateScenariosWithHistory(prev => [...prev, scenario]);
    }, [updateScenariosWithHistory]);

    const handleToggleHidden = useCallback((id: string) => {
        updateScenariosWithHistory(prev => prev.map(s =>
            s.id === id ? { ...s, hidden: !s.hidden } : s
        ));
    }, [updateScenariosWithHistory]);

    const handleDuplicate = useCallback((scenario: Scenario) => {
        const duplicated: Scenario = {
            ...scenario,
            id: crypto.randomUUID(),
            name: `${scenario.name} (Copia)`,
        };
        updateScenariosWithHistory(prev => [...prev, duplicated]);
    }, [updateScenariosWithHistory]);

    const handleViewMultiTeamCalendar = useCallback((scenario: Scenario) => {
        setSelectedScenario(scenario);
        setShowMultiTeamCalendar(true);
    }, []);

    const handleCloseMultiTeamCalendar = useCallback(() => {
        setShowMultiTeamCalendar(false);
    }, []);

    const handleCloseCalendar = useCallback(() => {
        setShowCalendar(false);
    }, []);

    const handleOpenGenerator = useCallback(() => {
        setShowGenerator(true);
    }, []);

    const handleCloseGenerator = useCallback(() => {
        setShowGenerator(false);
    }, []);

    const handleLoadDemoScenario = useCallback((scenario: Scenario) => {
        updateScenariosWithHistory(prev => [...prev, scenario]);
    }, [updateScenariosWithHistory]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFilterTeamsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterTeams(e.target.value ? Number(e.target.value) : null);
    }, []);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as 'name' | 'weekends' | 'hours');
    }, []);

    const toggleShowHidden = useCallback(() => {
        setShowHidden(!showHidden);
    }, [showHidden, setShowHidden]);

    // Drag and drop
    const handleReorder = useCallback((newScenarios: Scenario[]) => {
        updateScenariosWithHistory(newScenarios);
    }, [updateScenariosWithHistory]);

    const {
        draggedItem,
        dragOverItem,
        handleDragStart,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        handleKeyboardReorder,
    } = useDragAndDrop({
        items: scenarios,
        onReorder: handleReorder,
        getItemId: (item) => item.id,
    });

    return (
        <div className="max-w-7xl mx-auto px-4">
            <ICSImporter onImport={handleAddScenario} />

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1" data-tutorial="presets">
                    <PresetSelector onLoadPreset={handleLoadPreset} />
                </div>
                <button
                    onClick={() => setShowDemoMode(!showDemoMode)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] font-semibold w-full md:w-auto"
                    aria-label="Modo demonstracao"
                    aria-expanded={showDemoMode}
                >
                    <Play className="w-5 h-5" />
                    {t.dashboard.demoMode}
                </button>
                <button
                    onClick={handleOpenGenerator}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] font-semibold w-full md:w-auto"
                    aria-label="Abrir gerador de horarios"
                >
                    <Wand2 className="w-5 h-5" />
                    {t.dashboard.generate}
                </button>
            </div>

            {showDemoMode && (
                <LazyLoad className="h-48">
                    <DemoMode
                        onSelectScenario={handleLoadDemoScenario}
                        onClose={() => setShowDemoMode(false)}
                    />
                </LazyLoad>
            )}

            <div data-tutorial="form">
                <ScenarioForm
                    onAdd={handleAddScenario}
                    onUpdate={handleUpdateScenario}
                    onCancelEdit={handleCancelEdit}
                    editingScenario={editingScenario}
                />
            </div>

            {scenarios.length > 0 && (
                <>
                    {/* Undo/Redo Bar */}
                    <div className="mb-4 flex items-center gap-2">
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                                canUndo 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                            title="Desfazer (Ctrl+Z)"
                            aria-label="Desfazer ultima acao"
                        >
                            <Undo2 className="w-4 h-4" />
                            Desfazer
                        </button>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                                canRedo 
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                            title="Refazer (Ctrl+Shift+Z)"
                            aria-label="Refazer ultima acao"
                        >
                            <Redo2 className="w-4 h-4" />
                            Refazer
                        </button>
                        <span className="text-xs text-gray-500 ml-2">
                            Ctrl+Z para desfazer, Ctrl+Shift+Z para refazer
                        </span>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={`${t.dashboard.search} (Ctrl+F)`}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        aria-label="Pesquisar cenarios"
                                    />
                                </div>
                            </div>

                            {/* Team Filter */}
                            <div className="flex gap-2">
                                <select
                                    value={filterTeams ?? ''}
                                    onChange={handleFilterTeamsChange}
                                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    aria-label="Filtrar por numero de equipas"
                                >
                                    <option value="">Todas as Equipas</option>
                                    {[...new Set(scenarios.map(s => s.teams))].sort((a, b) => a - b).map(num => (
                                        <option key={num} value={num}>{num} Equipas</option>
                                    ))}
                                </select>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    aria-label="Ordenar cenarios"
                                >
                                    <option value="name">Ordenar: Nome</option>
                                    <option value="weekends">Ordenar: Fins de Semana</option>
                                    <option value="hours">Ordenar: Horas Semanais</option>
                                </select>
                            </div>

                            {/* Show Hidden Toggle */}
                            <button
                                onClick={toggleShowHidden}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${showHidden
                                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }`}
                                title={showHidden ? "Ocultar cenarios escondidos" : "Mostrar cenarios escondidos"}
                                aria-pressed={showHidden}
                            >
                                <Filter className="w-4 h-4" aria-hidden="true" />
                                {showHidden ? 'Ocultar Escondidos' : 'Mostrar Escondidos'}
                                {scenarios.filter(s => s.hidden).length > 0 && (
                                    <span className="bg-gray-900 px-2 py-0.5 rounded-full text-xs" aria-label={`${scenarios.filter(s => s.hidden).length} cenarios escondidos`}>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-tutorial="cards">
                        {visibleScenarios.map(scenario => (
                            <ScenarioCard
                                key={scenario.id}
                                scenario={scenario}
                                searchTerm={searchTerm}
                                onDelete={handleDeleteScenario}
                                onEdit={handleEditScenario}
                                onToggleHidden={handleToggleHidden}
                                onViewCalendar={handleViewCalendar}
                                onDuplicate={handleDuplicate}
                                onViewMultiTeamCalendar={handleViewMultiTeamCalendar}
                                onExport={handleExport}
                                onExportPDF={handleExportPDF}
                                onExportCSV={handleExportCSV}
                                onExportJSON={handleExportJSON}
                                onExportICS={handleExportICS}
                                onShare={handleShareScenario}
                                isDragging={draggedItem?.id === scenario.id}
                                isDragOver={dragOverItem?.id === scenario.id}
                                onDragStart={() => handleDragStart(scenario)}
                                onDragEnter={() => handleDragEnter(scenario)}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                onKeyboardReorder={handleKeyboardReorder}
                            />
                        ))}
                    </div>

                    <div data-tutorial="comparison">
                        <ComparisonTable scenarios={visibleScenarios} analyses={analyses} />
                    </div>

                    {/* Comparison Charts */}
                    {visibleScenarios.length > 1 && (
                        <LazyLoad className="h-64">
                            <ComparisonCharts scenarios={visibleScenarios} analyses={analyses} />
                        </LazyLoad>
                    )}

                    {/* Advanced Metrics, Multi-Year Analysis, Heatmap and Team Fairness for each scenario */}
                    <div className="mt-8 space-y-6">
                        {visibleScenarios.map((scenario) => {
                            const idx = scenarios.findIndex(s => s.id === scenario.id);
                            const analysis = analyses[idx];
                            if (!analysis) return null;

                            return (
                                <div key={scenario.id} className="space-y-6">
                                    <LazyLoad className="h-32">
                                        {analysis.advancedMetrics && (
                                            <AdvancedMetricsDisplay
                                                metrics={analysis.advancedMetrics}
                                                scenarioName={scenario.name}
                                            />
                                        )}
                                    </LazyLoad>
                                    <LazyLoad className="h-48">
                                        <QualityOfLifeDisplay
                                            scenario={scenario}
                                            analysis={analysis}
                                        />
                                    </LazyLoad>
                                    <LazyLoad className="h-64">
                                        <WorkloadHeatmap scenario={scenario} />
                                    </LazyLoad>
                                    <LazyLoad className="h-48">
                                        <MultiYearAnalysis
                                            multiYearData={analysis.multiYearAnalysis}
                                            scenarioName={scenario.name}
                                        />
                                    </LazyLoad>
                                    <LazyLoad className="h-64">
                                        <TeamFairness scenario={scenario} />
                                    </LazyLoad>
                                    {scenario.teams > 1 && (
                                        <LazyLoad className="h-48">
                                            <TeamAnalysis scenario={scenario} />
                                        </LazyLoad>
                                    )}
                                    <LazyLoad className="h-48">
                                        <div data-tutorial="compliance">
                                            <LegalComplianceBanner scenario={scenario} />
                                        </div>
                                    </LazyLoad>
                                    <LazyLoad className="h-48">
                                        <PayEstimateDisplay scenario={scenario} />
                                    </LazyLoad>
                                </div>
                            );
                        })}
                    </div>

                    {/* Export All Buttons */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button
                            onClick={handleExportAll}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-5 rounded-lg transition-colors flex items-center gap-2"
                            aria-label="Exportar todos os cenarios para Excel"
                        >
                            <Download className="w-5 h-5" aria-hidden="true" />
                            {t.dashboard.exportExcel}
                        </button>
                        <button
                            onClick={handleExportAllPDF}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-5 rounded-lg transition-colors flex items-center gap-2"
                            aria-label="Exportar todos os cenarios para PDF"
                        >
                            <FileText className="w-5 h-5" aria-hidden="true" />
                            {t.dashboard.exportPDF}
                        </button>
                        <button
                            onClick={handleExportAllCSV}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-5 rounded-lg transition-colors flex items-center gap-2"
                            aria-label="Exportar todos os cenarios para CSV"
                        >
                            <Table2 className="w-5 h-5" aria-hidden="true" />
                            {t.dashboard.exportCSV}
                        </button>
                        <button
                            onClick={handleExportAllJSON}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-lg transition-colors flex items-center gap-2"
                            aria-label="Exportar todos os cenarios para JSON"
                        >
                            <Code2 className="w-5 h-5" aria-hidden="true" />
                            {t.dashboard.exportJSON}
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>{t.dashboard.empty}</p>
                </div>
            )}

            {/* Calendar Modal */}
            {showCalendar && selectedScenario && (
                <div 
                    ref={calendarModalRef}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Calendario Anual"
                    tabIndex={-1}
                >
                    <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Vista de Calendario Anual</h2>
                            <button
                                onClick={handleCloseCalendar}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Fechar calendario"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <LazyLoad className="h-96">
                                <YearCalendarView scenario={selectedScenario} />
                            </LazyLoad>
                        </div>
                    </div>
                </div>
            )}

            {/* Multi-Team Calendar Modal */}
            {showMultiTeamCalendar && selectedScenario && selectedScenario.teams > 1 && (
                <LazyLoad className="h-96">
                    <MultiTeamCalendarView
                        scenario={selectedScenario}
                        onClose={handleCloseMultiTeamCalendar}
                    />
                </LazyLoad>
            )}

            <div ref={generatorModalRef} data-tutorial="generator">
                <GeneratorUI
                    isOpen={showGenerator}
                    onClose={handleCloseGenerator}
                    onSelectScenario={handleLoadPreset}
                />
            </div>

            <ShortcutsHelp isOpen={shortcutsHelp.isOpen} onClose={shortcutsHelp.close} />
        </div>
    );
};

export default Dashboard;
