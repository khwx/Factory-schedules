import React, { useState, useMemo } from 'react';
import { FileText, Download, Calendar, Clock, Users, TrendingUp } from 'lucide-react';
import { useI18n } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { exportComparisonToPDF } from '../utils/pdfExport';
import { exportComparisonToCSV, exportComparisonToJSON } from '../utils/csvJsonExport';
import { exportComparison } from '../utils/export';

const Reports: React.FC = () => {
    const { lang } = useI18n();
    const { showToast } = useToast();
    const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());
    const [reportType, setReportType] = useState<'summary' | 'detailed' | 'comparison'>('summary');
    const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');

    const scenarios = useMemo(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        if (saved) {
            try { return JSON.parse(saved) as Scenario[]; }
            catch { return []; }
        }
        return [];
    }, []);

    const analyses = useMemo(() => {
        return scenarios.map(s => calculateAnalysis(s));
    }, [scenarios]);

    const toggleSelect = (id: string) => {
        setSelectedScenarios(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedScenarios.size === scenarios.length) {
            setSelectedScenarios(new Set());
        } else {
            setSelectedScenarios(new Set(scenarios.map(s => s.id)));
        }
    };

    const selectedScenarioList = useMemo(() => {
        return scenarios.filter(s => selectedScenarios.has(s.id));
    }, [scenarios, selectedScenarios]);

    const selectedAnalyses = useMemo(() => {
        return selectedScenarioList.map(s => {
            const idx = scenarios.findIndex(sc => sc.id === s.id);
            return analyses[idx];
        });
    }, [selectedScenarioList, scenarios, analyses]);

    const summaryStats = useMemo(() => {
        if (selectedScenarioList.length === 0) return null;

        const totalScenarios = selectedScenarioList.length;
        const avgHours = selectedAnalyses.reduce((sum, a) => sum + (a?.avgWeeklyHours || 0), 0) / totalScenarios;
        const avgWeekends = selectedAnalyses.reduce((sum, a) => sum + (a?.weekendsOffPerYear || 0), 0) / totalScenarios;
        const avgOffDays = selectedAnalyses.reduce((sum, a) => sum + (a?.totalOffDaysPerYear || 0), 0) / totalScenarios;
        const totalHours = selectedAnalyses.reduce((sum, a) => sum + (a?.totalAnnualHours || 0), 0);

        return { totalScenarios, avgHours, avgWeekends, avgOffDays, totalHours };
    }, [selectedScenarioList, selectedAnalyses]);

    const handleExport = async () => {
        if (selectedScenarioList.length === 0) {
            showToast('error', lang === 'pt' ? 'Selecione pelo menos um cenario' : 'Select at least one scenario');
            return;
        }

        try {
            if (exportFormat === 'pdf') {
                await exportComparisonToPDF(selectedScenarioList, selectedAnalyses);
            } else if (exportFormat === 'excel') {
                await exportComparison(selectedScenarioList, selectedAnalyses);
            } else if (exportFormat === 'csv') {
                exportComparisonToCSV(selectedScenarioList, selectedAnalyses);
            } else {
                exportComparisonToJSON(selectedScenarioList, selectedAnalyses);
            }
            showToast('success', lang === 'pt' ? 'Relatorio exportado!' : 'Report exported!');
        } catch {
            showToast('error', lang === 'pt' ? 'Erro ao exportar' : 'Export error');
        }
    };

    const getQualitativeSummary = (scenario: Scenario) => {
        const analysis = calculateAnalysis(scenario);
        const items: string[] = [];

        if (analysis.avgWeeklyHours <= 35) items.push(lang === 'pt' ? 'Horas confortaveis' : 'Comfortable hours');
        else if (analysis.avgWeeklyHours <= 40) items.push(lang === 'pt' ? 'Horas normais' : 'Normal hours');
        else items.push(lang === 'pt' ? 'Excedente de horas' : 'Overtime');

        if (analysis.weekendsOffPerYear >= 40) items.push(lang === 'pt' ? 'Muitos fins de semana livres' : 'Many free weekends');
        else if (analysis.weekendsOffPerYear >= 20) items.push(lang === 'pt' ? 'Fins de semana moderados' : 'Moderate weekends');
        else items.push(lang === 'pt' ? 'Poucos fins de semana livres' : 'Few free weekends');

        if (analysis.advancedMetrics) {
            if (analysis.advancedMetrics.maxConsecutiveWorkDays <= 5) items.push(lang === 'pt' ? 'Sequencias de trabalho razoaveis' : 'Reasonable work sequences');
            else items.push(lang === 'pt' ? 'Sequencias longas de trabalho' : 'Long work sequences');
        }

        return items;
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Relatorios' : 'Reports'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Gere relatorios detalhados dos seus cenarios de escalas.'
                        : 'Generate detailed reports from your shift scenarios.'}
                </p>
            </div>

            {/* Scenario Selection */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">
                        {lang === 'pt' ? 'Selecionar Cenarios' : 'Select Scenarios'}
                    </h3>
                    <button
                        onClick={selectAll}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {selectedScenarios.size === scenarios.length
                            ? (lang === 'pt' ? 'Desselecionar todos' : 'Deselect all')
                            : (lang === 'pt' ? 'Selecionar todos' : 'Select all')}
                    </button>
                </div>

                {scenarios.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        {lang === 'pt' ? 'Nenhum cenario disponivel. Crie um primeiro.' : 'No scenarios available. Create one first.'}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {scenarios.map((s, i) => (
                            <label
                                key={s.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selectedScenarios.has(s.id)
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedScenarios.has(s.id)}
                                    onChange={() => toggleSelect(s.id)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{s.name}</p>
                                    <p className="text-xs text-gray-400">
                                        {s.teams} {lang === 'pt' ? 'equipas' : 'teams'} &bull; {s.shiftDuration}h
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500">#{i + 1}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            {summaryStats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-xs">{lang === 'pt' ? 'Cenarios' : 'Scenarios'}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{summaryStats.totalScenarios}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">{lang === 'pt' ? 'Media Horas/Sem' : 'Avg Hours/Week'}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{summaryStats.avgHours.toFixed(1)}h</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">{lang === 'pt' ? 'Media FDS/Ano' : 'Avg Weekends/Year'}</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400">{summaryStats.avgWeekends.toFixed(0)}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">{lang === 'pt' ? 'Media Folgas/Ano' : 'Avg Off Days/Year'}</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400">{summaryStats.avgOffDays.toFixed(0)}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs">{lang === 'pt' ? 'Total Horas/Ano' : 'Total Hours/Year'}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{summaryStats.totalHours.toLocaleString()}h</p>
                    </div>
                </div>
            )}

            {/* Report Type & Export */}
            {selectedScenarios.size > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                    <h3 className="text-white font-semibold mb-4">
                        {lang === 'pt' ? 'Gerar Relatorio' : 'Generate Report'}
                    </h3>

                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">
                                {lang === 'pt' ? 'Tipo de Relatorio' : 'Report Type'}
                            </label>
                            <div className="flex gap-2">
                                {[
                                    { value: 'summary', label: lang === 'pt' ? 'Resumo' : 'Summary' },
                                    { value: 'detailed', label: lang === 'pt' ? 'Detalhado' : 'Detailed' },
                                    { value: 'comparison', label: lang === 'pt' ? 'Comparacao' : 'Comparison' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setReportType(opt.value as typeof reportType)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                            reportType === opt.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-2">
                                {lang === 'pt' ? 'Formato de Exportacao' : 'Export Format'}
                            </label>
                            <div className="flex gap-2">
                                {[
                                    { value: 'pdf', label: 'PDF' },
                                    { value: 'excel', label: 'Excel' },
                                    { value: 'csv', label: 'CSV' },
                                    { value: 'json', label: 'JSON' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setExportFormat(opt.value as typeof exportFormat)}
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                            exportFormat === opt.value
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleExport}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        {lang === 'pt' ? `Exportar ${selectedScenarios.size} cenario${selectedScenarios.size !== 1 ? 's' : ''}` : `Export ${selectedScenarios.size} scenario${selectedScenarios.size !== 1 ? 's' : ''}`}
                    </button>
                </div>
            )}

            {/* Detailed Report Preview */}
            {selectedScenarios.size > 0 && reportType !== 'comparison' && (
                <div className="space-y-4">
                    <h3 className="text-white font-semibold">
                        {reportType === 'summary'
                            ? (lang === 'pt' ? 'Resumo dos Cenarios' : 'Scenario Summary')
                            : (lang === 'pt' ? 'Relatorio Detalhado' : 'Detailed Report')}
                    </h3>
                    {selectedScenarioList.map((scenario, i) => {
                        const analysis = analyses[scenarios.findIndex(s => s.id === scenario.id)];
                        if (!analysis) return null;
                        const qualItems = getQualitativeSummary(scenario);

                        return (
                            <div key={scenario.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-white font-semibold text-lg">{scenario.name}</h4>
                                    <span className="text-xs text-gray-500">#{i + 1}</span>
                                </div>

                                {reportType === 'summary' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400">{lang === 'pt' ? 'Horas/Semana' : 'Hours/Week'}</p>
                                            <p className="text-lg font-bold text-white">{analysis.avgWeeklyHours.toFixed(1)}h</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">{lang === 'pt' ? 'Horas/Ano' : 'Hours/Year'}</p>
                                            <p className="text-lg font-bold text-white">{analysis.totalAnnualHours.toLocaleString()}h</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">{lang === 'pt' ? 'FDS/Ano' : 'Weekends/Year'}</p>
                                            <p className="text-lg font-bold text-green-400">{analysis.weekendsOffPerYear}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">{lang === 'pt' ? 'Folgas/Ano' : 'Off Days/Year'}</p>
                                            <p className="text-lg font-bold text-green-400">{analysis.totalOffDaysPerYear}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400">{lang === 'pt' ? 'Equipas' : 'Teams'}</p>
                                                <p className="text-white font-medium">{scenario.teams}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">{lang === 'pt' ? 'Turno' : 'Shift'}</p>
                                                <p className="text-white font-medium">{scenario.shiftDuration}h</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">{lang === 'pt' ? 'Padrao' : 'Pattern'}</p>
                                                <p className="text-white font-mono text-sm">{scenario.pattern}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">{lang === 'pt' ? 'Contrato' : 'Contract'}</p>
                                                <p className="text-white font-medium">{scenario.weeklyHoursContract || 40}h</p>
                                            </div>
                                        </div>
                                        {analysis.advancedMetrics && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-700">
                                                <div>
                                                    <p className="text-xs text-gray-400">{lang === 'pt' ? 'Max Trabalho Consec.' : 'Max Consec. Work'}</p>
                                                    <p className="text-white font-medium">{analysis.advancedMetrics.maxConsecutiveWorkDays} {lang === 'pt' ? 'dias' : 'days'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">{lang === 'pt' ? 'Max Folga Consec.' : 'Max Consec. Off'}</p>
                                                    <p className="text-white font-medium">{analysis.advancedMetrics.maxConsecutiveOffDays} {lang === 'pt' ? 'dias' : 'days'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">{lang === 'pt' ? 'Mini-Ferias' : 'Mini Vacations'}</p>
                                                    <p className="text-white font-medium">{analysis.advancedMetrics.miniVacations}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">{lang === 'pt' ? 'Turnos Noite' : 'Night Shifts'}</p>
                                                    <p className="text-white font-medium">{analysis.advancedMetrics.totalNightShifts}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-2 border-t border-gray-700">
                                            <p className="text-xs text-gray-400 mb-2">{lang === 'pt' ? 'Avaliacao Qualitativa' : 'Qualitative Assessment'}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {qualItems.map((item, j) => (
                                                    <span key={j} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {scenario.description && (
                                            <div className="pt-2 border-t border-gray-700">
                                                <p className="text-xs text-gray-400 mb-1">{lang === 'pt' ? 'Notas' : 'Notes'}</p>
                                                <p className="text-sm text-gray-300 italic">{scenario.description}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Reports;
