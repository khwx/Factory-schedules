import React, { useState, useMemo } from 'react';
import { GitCompareArrows, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { Scenario } from '../types';

interface ScheduleDiffProps {
    scenarios: Scenario[];
}

interface DiffResult {
    day: number;
    teamA: string;
    teamB: string;
    isDifferent: boolean;
}

const ScheduleDiff: React.FC<ScheduleDiffProps> = ({ scenarios }) => {
    const { lang } = useI18n();
    const [selectedA, setSelectedA] = useState<string>('');
    const [selectedB, setSelectedB] = useState<string>('');
    const [maxDays, setMaxDays] = useState(28);

    const scenarioA = useMemo(() => scenarios.find(s => s.id === selectedA), [scenarios, selectedA]);
    const scenarioB = useMemo(() => scenarios.find(s => s.id === selectedB), [scenarios, selectedB]);

    const diffs = useMemo((): DiffResult[] => {
        if (!scenarioA || !scenarioB) return [];
        const results: DiffResult[] = [];
        const minLen = Math.min(scenarioA.pattern.length, scenarioB.pattern.length, maxDays);

        for (let i = 0; i < minLen; i++) {
            results.push({
                day: i + 1,
                teamA: scenarioA.pattern[i] || 'F',
                teamB: scenarioB.pattern[i] || 'F',
                isDifferent: (scenarioA.pattern[i] || 'F') !== (scenarioB.pattern[i] || 'F'),
            });
        }
        return results;
    }, [scenarioA, scenarioB, maxDays]);

    const diffCount = useMemo(() => diffs.filter(d => d.isDifferent).length, [diffs]);
    const sameCount = useMemo(() => diffs.filter(d => !d.isDifferent).length, [diffs]);
    const diffPercentage = diffs.length > 0 ? Math.round((diffCount / diffs.length) * 100) : 0;

    const getShiftColor = (char: string) => {
        switch (char) {
            case 'M': return 'bg-yellow-500 text-white';
            case 'T': return 'bg-orange-500 text-white';
            case 'N': return 'bg-blue-600 text-white';
            case 'F': return 'bg-gray-600 text-gray-300';
            default: return 'bg-gray-700 text-gray-400';
        }
    };

    const getShiftLabel = (char: string) => {
        switch (char) {
            case 'M': return lang === 'pt' ? 'Manha' : 'Morning';
            case 'T': return lang === 'pt' ? 'Tarde' : 'Afternoon';
            case 'N': return lang === 'pt' ? 'Noite' : 'Night';
            case 'F': return lang === 'pt' ? 'Folga' : 'Off';
            default: return '?';
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <GitCompareArrows className="w-5 h-5 text-blue-400" />
                {lang === 'pt' ? 'Comparacao de Padroes' : 'Pattern Comparison'}
            </h3>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <select
                    value={selectedA}
                    onChange={e => setSelectedA(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="">{lang === 'pt' ? 'Selecionar cenario A' : 'Select scenario A'}</option>
                    {scenarios.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <div className="flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>

                <select
                    value={selectedB}
                    onChange={e => setSelectedB(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="">{lang === 'pt' ? 'Selecionar cenario B' : 'Select scenario B'}</option>
                    {scenarios.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <select
                    value={maxDays}
                    onChange={e => setMaxDays(Number(e.target.value))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 w-32"
                >
                    {[7, 14, 21, 28, 30, 60].map(d => (
                        <option key={d} value={d}>{d} {lang === 'pt' ? 'dias' : 'days'}</option>
                    ))}
                </select>
            </div>

            {scenarioA && scenarioB ? (
                <>
                    {/* Stats */}
                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-gray-400">
                                {sameCount} {lang === 'pt' ? 'iguais' : 'same'} ({100 - diffPercentage}%)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm text-gray-400">
                                {diffCount} {lang === 'pt' ? 'diferentes' : 'different'} ({diffPercentage}%)
                            </span>
                        </div>
                    </div>

                    {/* Pattern Visual */}
                    <div className="space-y-2 mb-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">{scenarioA.name}</p>
                            <div className="flex h-6 rounded overflow-hidden">
                                {diffs.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 flex items-center justify-center text-xs font-bold ${getShiftColor(d.teamA)} ${
                                            d.isDifferent ? 'ring-2 ring-red-400 ring-inset' : ''
                                        }`}
                                        title={`Dia ${d.day}: ${getShiftLabel(d.teamA)}`}
                                    >
                                        {d.teamA}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">{scenarioB.name}</p>
                            <div className="flex h-6 rounded overflow-hidden">
                                {diffs.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 flex items-center justify-center text-xs font-bold ${getShiftColor(d.teamB)} ${
                                            d.isDifferent ? 'ring-2 ring-red-400 ring-inset' : ''
                                        }`}
                                        title={`Dia ${d.day}: ${getShiftLabel(d.teamB)}`}
                                    >
                                        {d.teamB}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Diff Table */}
                    <div className="overflow-x-auto max-h-48 overflow-y-auto">
                        <table className="w-full text-xs">
                            <thead className="sticky top-0 bg-gray-800">
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-1 px-2 text-gray-400">{lang === 'pt' ? 'Dia' : 'Day'}</th>
                                    <th className="text-center py-1 px-2 text-gray-400">{scenarioA.name}</th>
                                    <th className="text-center py-1 px-2 text-gray-400">{scenarioB.name}</th>
                                    <th className="text-center py-1 px-2 text-gray-400">{lang === 'pt' ? 'Igual' : 'Same'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diffs.map(d => (
                                    <tr key={d.day} className={`border-b border-gray-700/50 ${d.isDifferent ? 'bg-red-500/5' : ''}`}>
                                        <td className="py-1 px-2 text-gray-300">{d.day}</td>
                                        <td className="py-1 px-2 text-center">
                                            <span className={`inline-block w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${getShiftColor(d.teamA)}`}>
                                                {d.teamA}
                                            </span>
                                        </td>
                                        <td className="py-1 px-2 text-center">
                                            <span className={`inline-block w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${getShiftColor(d.teamB)}`}>
                                                {d.teamB}
                                            </span>
                                        </td>
                                        <td className="py-1 px-2 text-center">
                                            {d.isDifferent ? (
                                                <span className="text-red-400">Diferente</span>
                                            ) : (
                                                <span className="text-green-400">Igual</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center py-6">
                    {lang === 'pt' ? 'Selecione dois cenarios para comparar.' : 'Select two scenarios to compare.'}
                </p>
            )}
        </div>
    );
};

export default ScheduleDiff;
