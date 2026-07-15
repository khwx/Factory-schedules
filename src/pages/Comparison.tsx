import React, { useState, useMemo } from 'react';
import { GitCompareArrows, Trophy, TrendingDown, Minus, Printer, Download } from 'lucide-react';
import { useI18n } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { exportComparisonToPDF } from '../utils/pdfExport';
import { exportComparison } from '../utils/export';
import { exportComparisonToCSV, exportComparisonToJSON } from '../utils/csvJsonExport';

interface ComparisonRow {
    label: string;
    values: number[];
    unit?: string;
    better?: 'lower' | 'higher';
    format?: (value: number) => string;
    category: 'config' | 'metric' | 'quality';
}

const Comparison: React.FC = () => {
    const { lang } = useI18n();
    const { showToast } = useToast();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [highlightBest, setHighlightBest] = useState(true);

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

    const selectedScenarios = useMemo(() => {
        return scenarios.filter(s => selectedIds.has(s.id));
    }, [scenarios, selectedIds]);

    const selectedAnalyses = useMemo(() => {
        return selectedScenarios.map(s => {
            const idx = scenarios.findIndex(sc => sc.id === s.id);
            return analyses[idx];
        });
    }, [selectedScenarios, scenarios, analyses]);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedIds.size === scenarios.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(scenarios.map(s => s.id)));
        }
    };

    const rows: ComparisonRow[] = useMemo(() => {
        if (selectedAnalyses.length === 0) return [];
        return [
            {
                label: lang === 'pt' ? 'Padrao' : 'Pattern',
                values: selectedScenarios.map(s => s.pattern.length),
                category: 'config',
            },
            {
                label: lang === 'pt' ? 'Equipas' : 'Teams',
                values: selectedScenarios.map(s => s.teams),
                category: 'config',
            },
            {
                label: lang === 'pt' ? 'Duracao Turno' : 'Shift Duration',
                values: selectedScenarios.map(s => s.shiftDuration),
                unit: 'h',
                category: 'config',
            },
            {
                label: lang === 'pt' ? 'Horas Contrato' : 'Contract Hours',
                values: selectedScenarios.map(s => s.weeklyHoursContract || 40),
                unit: 'h',
                category: 'config',
            },
            {
                label: lang === 'pt' ? 'Horas Semanais Medias' : 'Avg Weekly Hours',
                values: selectedAnalyses.map(a => a?.avgWeeklyHours || 0),
                unit: 'h',
                better: 'lower',
                format: (v) => v.toFixed(1),
                category: 'metric',
            },
            {
                label: lang === 'pt' ? 'Horas Anuais Totais' : 'Total Annual Hours',
                values: selectedAnalyses.map(a => a?.totalAnnualHours || 0),
                unit: 'h',
                format: (v) => Math.round(v).toLocaleString(),
                category: 'metric',
            },
            {
                label: lang === 'pt' ? 'Fins de Semana Folga' : 'Weekends Off',
                values: selectedAnalyses.map(a => a?.weekendsOffPerYear || 0),
                better: 'higher',
                category: 'metric',
            },
            {
                label: lang === 'pt' ? 'Total Dias Folga' : 'Total Off Days',
                values: selectedAnalyses.map(a => a?.totalOffDaysPerYear || 0),
                better: 'higher',
                category: 'metric',
            },
            {
                label: lang === 'pt' ? 'Max Dias Trabalho Consec.' : 'Max Consec. Work Days',
                values: selectedAnalyses.map(a => a?.advancedMetrics?.maxConsecutiveWorkDays || 0),
                better: 'lower',
                category: 'quality',
            },
            {
                label: lang === 'pt' ? 'Max Dias Folga Consec.' : 'Max Consec. Off Days',
                values: selectedAnalyses.map(a => a?.advancedMetrics?.maxConsecutiveOffDays || 0),
                better: 'higher',
                category: 'quality',
            },
            {
                label: lang === 'pt' ? 'Mini-Ferias (3+ dias)' : 'Mini Vacations (3+ days)',
                values: selectedAnalyses.map(a => a?.advancedMetrics?.miniVacations || 0),
                better: 'higher',
                category: 'quality',
            },
            {
                label: lang === 'pt' ? 'Turnos Noite/Ano' : 'Night Shifts/Year',
                values: selectedAnalyses.map(a => a?.advancedMetrics?.totalNightShifts || 0),
                better: 'lower',
                category: 'quality',
            },
            {
                label: lang === 'pt' ? 'Sextas Livres' : 'Fridays Off',
                values: selectedAnalyses.map(a => a?.advancedMetrics?.fridayNightsOff || 0),
                better: 'higher',
                category: 'quality',
            },
            {
                label: lang === 'pt' ? 'Feriados Trabalhados' : 'Holidays Worked',
                values: selectedAnalyses.map(a => a?.advancedMetrics?.holidaysWorked || 0),
                better: 'lower',
                category: 'quality',
            },
        ];
    }, [selectedScenarios, selectedAnalyses, lang]);

    const getBestIndex = (row: ComparisonRow): number | null => {
        if (!row.better || row.values.length < 2) return null;
        const uniqueValues = [...new Set(row.values)];
        if (uniqueValues.length < 2) return null;
        const best = row.better === 'lower' ? Math.min(...row.values) : Math.max(...row.values);
        return row.values.indexOf(best);
    };

    const getWorstIndex = (row: ComparisonRow): number | null => {
        if (!row.better || row.values.length < 2) return null;
        const uniqueValues = [...new Set(row.values)];
        if (uniqueValues.length < 2) return null;
        const worst = row.better === 'lower' ? Math.max(...row.values) : Math.min(...row.values);
        return row.values.indexOf(worst);
    };

    const getValueColor = (row: ComparisonRow, _value: number, idx: number): string => {
        if (!highlightBest || !row.better || row.values.length < 2) return 'text-white';
        const bestIdx = getBestIndex(row);
        const worstIdx = getWorstIndex(row);
        if (idx === bestIdx) return 'text-green-400 font-bold';
        if (idx === worstIdx) return 'text-red-400';
        return 'text-gray-300';
    };

    const getValueIcon = (row: ComparisonRow, _value: number, idx: number) => {
        if (!highlightBest || !row.better || row.values.length < 2) return null;
        const bestIdx = getBestIndex(row);
        const worstIdx = getWorstIndex(row);
        if (idx === bestIdx) return <Trophy className="w-4 h-4 text-yellow-400 inline ml-2" />;
        if (idx === worstIdx) return <TrendingDown className="w-4 h-4 text-red-400 inline ml-2" />;
        return <Minus className="w-4 h-4 text-gray-500 inline ml-2" />;
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
        if (selectedScenarios.length === 0) return;
        try {
            if (format === 'pdf') await exportComparisonToPDF(selectedScenarios, selectedAnalyses);
            else if (format === 'excel') await exportComparison(selectedScenarios, selectedAnalyses);
            else if (format === 'csv') exportComparisonToCSV(selectedScenarios, selectedAnalyses);
            else exportComparisonToJSON(selectedScenarios, selectedAnalyses);
            showToast('success', lang === 'pt' ? 'Exportado!' : 'Exported!');
        } catch {
            showToast('error', lang === 'pt' ? 'Erro ao exportar' : 'Export error');
        }
    };

    const categories = [
        { key: 'config', label: lang === 'pt' ? 'Configuracao' : 'Configuration' },
        { key: 'metric', label: lang === 'pt' ? 'Metricas' : 'Metrics' },
        { key: 'quality', label: lang === 'pt' ? 'Qualidade de Vida' : 'Quality of Life' },
    ] as const;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <GitCompareArrows className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Comparacao de Cenarios' : 'Scenario Comparison'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Compare cenarios lado a lado com indicadores de melhor/pior.'
                        : 'Compare scenarios side by side with best/worst indicators.'}
                </p>
            </div>

            {/* Scenario Selection */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6 no-print">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{lang === 'pt' ? 'Selecionar' : 'Select'}</h3>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-400">
                            <input
                                type="checkbox"
                                checked={highlightBest}
                                onChange={e => setHighlightBest(e.target.checked)}
                                className="rounded border-gray-600 bg-gray-700 text-blue-500"
                            />
                            {lang === 'pt' ? 'Destacar melhor/pior' : 'Highlight best/worst'}
                        </label>
                        <button onClick={selectAll} className="text-sm text-blue-400 hover:text-blue-300">
                            {selectedIds.size === scenarios.length ? (lang === 'pt' ? 'Desselecionar' : 'Deselect') : (lang === 'pt' ? 'Todos' : 'All')}
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {scenarios.map(s => (
                        <button
                            key={s.id}
                            onClick={() => toggleSelect(s.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                selectedIds.has(s.id)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Export Buttons */}
            {selectedScenarios.length >= 2 && (
                <div className="flex gap-2 mb-6 no-print">
                    <button onClick={handlePrint} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        {lang === 'pt' ? 'Imprimir' : 'Print'}
                    </button>
                    <button onClick={() => handleExport('pdf')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                    <button onClick={() => handleExport('excel')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                    <button onClick={() => handleExport('csv')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        CSV
                    </button>
                </div>
            )}

            {selectedScenarios.length < 2 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                    <GitCompareArrows className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{lang === 'pt' ? 'Selecione pelo menos 2 cenarios para comparar.' : 'Select at least 2 scenarios to compare.'}</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden comparison-print">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 bg-gray-900/50 text-gray-400 font-medium border-b border-gray-700 w-1/5">
                                        {lang === 'pt' ? 'Metrica' : 'Metric'}
                                    </th>
                                    {selectedScenarios.map(s => (
                                        <th key={s.id} className="p-4 bg-gray-900/50 text-white font-semibold border-b border-gray-700 border-l border-gray-700">
                                            {s.name}
                                            <div className="text-xs text-gray-500 font-normal mt-1">
                                                {s.teams} {lang === 'pt' ? 'equipas' : 'teams'} &bull; {s.shiftDuration}h
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <React.Fragment key={cat.key}>
                                        <tr className="bg-gray-900/30">
                                            <td className="p-3 border-b border-gray-700 text-gray-300 font-semibold text-sm" colSpan={selectedScenarios.length + 1}>
                                                {cat.label}
                                            </td>
                                        </tr>
                                        {rows.filter(r => r.category === cat.key).map((row, rowIdx) => (
                                            <tr key={rowIdx} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="p-3 border-b border-gray-700 text-gray-300 text-sm">
                                                    {row.label}
                                                </td>
                                                {row.values.map((value, i) => (
                                                    <td key={i} className={`p-3 border-b border-gray-700 border-l border-gray-700 font-mono text-sm ${getValueColor(row, value, i)}`}>
                                                        {row.format ? row.format(value) : value}
                                                        {row.unit && <span className="text-gray-500 ml-1">{row.unit}</span>}
                                                        {getValueIcon(row, value, i)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* Qualitative Analysis */}
                                <tr className="bg-gray-900/30">
                                    <td className="p-3 border-b border-gray-700 text-gray-300 font-semibold text-sm" colSpan={selectedScenarios.length + 1}>
                                        {lang === 'pt' ? 'Analise Qualitativa' : 'Qualitative Analysis'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3 border-b border-gray-700 text-gray-300 text-sm align-top">
                                        {lang === 'pt' ? 'Observacoes' : 'Observations'}
                                    </td>
                                    {selectedAnalyses.map((analysis, i) => (
                                        <td key={i} className="p-3 border-b border-gray-700 border-l border-gray-700 align-top">
                                            <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                                                {analysis?.qualitative.map((q, idx) => (
                                                    <li key={idx}>{q}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    ))}
                                </tr>

                                {/* Pattern Visual */}
                                <tr className="bg-gray-900/30">
                                    <td className="p-3 border-b border-gray-700 text-gray-300 font-semibold text-sm" colSpan={selectedScenarios.length + 1}>
                                        {lang === 'pt' ? 'Visualizacao do Padrao' : 'Pattern Visualization'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3 border-b border-gray-700 text-gray-300 text-sm">
                                        {lang === 'pt' ? 'Padrao' : 'Pattern'}
                                    </td>
                                    {selectedScenarios.map(s => (
                                        <td key={s.id} className="p-3 border-b border-gray-700 border-l border-gray-700">
                                            <div className="flex h-4 rounded overflow-hidden">
                                                {s.pattern.split('').map((ch, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 ${
                                                            ch === 'M' ? 'bg-yellow-500'
                                                                : ch === 'T' ? 'bg-orange-500'
                                                                : ch === 'N' ? 'bg-blue-600'
                                                                : 'bg-gray-600'
                                                        }`}
                                                        title={`Day ${i + 1}: ${ch}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 font-mono">{s.pattern}</p>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comparison;
