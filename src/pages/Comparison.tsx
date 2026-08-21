import React, { useState, useMemo } from 'react';
import { GitCompareArrows, Trophy, TrendingDown, Minus, Printer, Download } from 'lucide-react';
import { useI18n } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { exportComparisonToPDF } from '../utils/pdfExport';
import { exportComparison } from '../utils/export';
import { exportComparisonToCSV, exportComparisonToJSON } from '../utils/csvJsonExport';
import ComplianceComparison from '../components/ComplianceComparison';

interface ComparisonRow {
    label: string;
    values: number[];
    unit?: string;
    better?: 'lower' | 'higher';
    format?: (value: number) => string;
    category: 'config' | 'metric' | 'quality';
}

const Comparison: React.FC = () => {
    const { t } = useI18n();
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
                label: t.comparison.rowPattern,
                values: selectedScenarios.map(s => s.pattern.length),
                category: 'config',
            },
            {
                label: t.comparison.rowTeams,
                values: selectedScenarios.map(s => s.teams),
                category: 'config',
            },
            {
                label: t.comparison.rowShiftDuration,
                values: selectedScenarios.map(s => s.shiftDuration),
                unit: 'h',
                category: 'config',
            },
            {
                label: t.comparison.rowContractHours,
                values: selectedScenarios.map(s => s.weeklyHoursContract || 40),
                unit: 'h',
                category: 'config',
            },
            {
                label: t.comparison.rowAvgWeeklyHours,
                values: selectedAnalyses.map(a => a?.avgWeeklyHours || 0),
                unit: 'h',
                better: 'lower',
                format: (v) => v.toFixed(1),
                category: 'metric',
            },
            {
                label: t.comparison.rowTotalAnnualHours,
                values: selectedAnalyses.map(a => a?.totalAnnualHours || 0),
                unit: 'h',
                format: (v) => Math.round(v).toLocaleString(),
                category: 'metric',
            },
            {
                label: t.comparison.rowWeekendsOff,
                values: selectedAnalyses.map(a => a?.weekendsOffPerYear || 0),
                better: 'higher',
                category: 'metric',
            },
            {
                label: t.comparison.rowTotalOffDays,
                values: selectedAnalyses.map(a => a?.totalOffDaysPerYear || 0),
                better: 'higher',
                category: 'metric',
            },
            {
                label: t.comparison.rowMaxConsecWorkDays,
                values: selectedAnalyses.map(a => a?.advancedMetrics?.maxConsecutiveWorkDays || 0),
                better: 'lower',
                category: 'quality',
            },
            {
                label: t.comparison.rowMaxConsecOffDays,
                values: selectedAnalyses.map(a => a?.advancedMetrics?.maxConsecutiveOffDays || 0),
                better: 'higher',
                category: 'quality',
            },
            {
                label: t.comparison.rowMiniVacations,
                values: selectedAnalyses.map(a => a?.advancedMetrics?.miniVacations || 0),
                better: 'higher',
                category: 'quality',
            },
            {
                label: t.comparison.rowNightShiftsYear,
                values: selectedAnalyses.map(a => a?.advancedMetrics?.totalNightShifts || 0),
                better: 'lower',
                category: 'quality',
            },
            {
                label: t.comparison.rowFridaysOff,
                values: selectedAnalyses.map(a => a?.advancedMetrics?.fridayNightsOff || 0),
                better: 'higher',
                category: 'quality',
            },
            {
                label: t.comparison.rowHolidaysWorked,
                values: selectedAnalyses.map(a => a?.advancedMetrics?.holidaysWorked || 0),
                better: 'lower',
                category: 'quality',
            },
        ];
    }, [selectedScenarios, selectedAnalyses, t]);

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
            showToast('success', t.comparison.toastExported);
        } catch {
            showToast('error', t.comparison.toastExportError);
        }
    };

    const categories = [
        { key: 'config', label: t.comparison.categoryConfig },
        { key: 'metric', label: t.comparison.categoryMetric },
        { key: 'quality', label: t.comparison.categoryQuality },
    ] as const;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <GitCompareArrows className="w-8 h-8 text-blue-400" />
                    {t.comparison.title}
                </h1>
                <p className="text-gray-400">
                    {t.comparison.subtitle}
                </p>
            </div>

            {/* Scenario Selection */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6 no-print">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{t.comparison.select}</h3>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-400">
                            <input
                                type="checkbox"
                                checked={highlightBest}
                                onChange={e => setHighlightBest(e.target.checked)}
                                className="rounded border-gray-600 bg-gray-700 text-blue-500"
                            />
                            {t.comparison.highlightBest}
                        </label>
                        <button onClick={selectAll} className="text-sm text-blue-400 hover:text-blue-300">
                            {selectedIds.size === scenarios.length ? t.comparison.deselect : t.comparison.all}
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
                        {t.comparison.print}
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
                    <p>{t.comparison.selectAtLeast2}</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden comparison-print">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 bg-gray-900/50 text-gray-400 font-medium border-b border-gray-700 w-1/5">
                                        {t.comparison.metric}
                                    </th>
                                    {selectedScenarios.map(s => (
                                        <th key={s.id} className="p-4 bg-gray-900/50 text-white font-semibold border-b border-gray-700 border-l border-gray-700">
                                            {s.name}
                                            <div className="text-xs text-gray-500 font-normal mt-1">
                                                {s.teams} {t.comparison.teamsUnit} &bull; {s.shiftDuration}h
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
                                        {t.comparison.qualitativeAnalysis}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3 border-b border-gray-700 text-gray-300 text-sm align-top">
                                        {t.comparison.observations}
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
                                        {t.comparison.patternViz}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3 border-b border-gray-700 text-gray-300 text-sm">
                                        {t.comparison.patternLabel}
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

            {/* Legal Compliance Comparison */}
            {selectedScenarios.length >= 2 && (
                <div className="mt-6">
                    <ComplianceComparison scenarios={selectedScenarios} />
                </div>
            )}
        </div>
    );
};

export default Comparison;
