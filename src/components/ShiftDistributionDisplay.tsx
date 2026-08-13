import React, { useMemo } from 'react';
import { PieChart, Gauge } from 'lucide-react';
import { Scenario } from '../types';
import { computeShiftDistribution, assessErgonomics } from '../utils/shiftDistribution';

interface ShiftDistributionDisplayProps {
    scenario: Scenario;
    year?: number;
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
    M: { label: 'Manhã', color: 'bg-yellow-500' },
    T: { label: 'Tarde', color: 'bg-orange-500' },
    N: { label: 'Noite', color: 'bg-blue-600' },
    F: { label: 'Folga', color: 'bg-gray-600' },
};

const ShiftDistributionDisplay: React.FC<ShiftDistributionDisplayProps> = ({
    scenario,
    year = new Date().getFullYear(),
}) => {
    const distribution = useMemo(() => computeShiftDistribution(scenario, year), [scenario, year]);
    const assessment = useMemo(() => assessErgonomics(distribution), [distribution]);

    const items = [
        { key: 'morning', label: TYPE_CONFIG.M.label, count: distribution.morning, pct: distribution.morningPct, color: TYPE_CONFIG.M.color },
        { key: 'afternoon', label: TYPE_CONFIG.T.label, count: distribution.afternoon, pct: distribution.afternoonPct, color: TYPE_CONFIG.T.color },
        { key: 'night', label: TYPE_CONFIG.N.label, count: distribution.night, pct: distribution.nightPct, color: TYPE_CONFIG.N.color },
        { key: 'off', label: TYPE_CONFIG.F.label, count: distribution.off, pct: distribution.offPct, color: TYPE_CONFIG.F.color },
    ];

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-white">Distribuição de Turnos — {scenario.name}</h3>
            </div>

            <div className="p-4">
                {/* Ergonomic summary */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-900/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Densidade Nocturna</div>
                        <div className="flex items-center gap-1 text-sm font-medium text-white capitalize">
                            <Gauge className="w-4 h-4 text-purple-400" />
                            {assessment.nightDensity}
                        </div>
                    </div>
                    <div className="bg-gray-900/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Dias de Folga</div>
                        <div className="flex items-center gap-1 text-sm font-medium text-white capitalize">
                            <Gauge className="w-4 h-4 text-green-400" />
                            {assessment.offDensity}
                        </div>
                    </div>
                    <div className="bg-gray-900/30 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Dias Trabalho/Semana</div>
                        <div className="text-sm font-medium text-white">
                            {distribution.avgWorkPerWeek}
                        </div>
                    </div>
                </div>

                {/* Stacked bar */}
                <div className="flex h-4 rounded overflow-hidden mb-4">
                    {items.map(item => (
                        <div
                            key={item.key}
                            className={`${item.color}`}
                            style={{ width: `${item.pct}%` }}
                            title={`${item.label}: ${item.pct}%`}
                        />
                    ))}
                </div>

                {/* Legend with counts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {items.map(item => (
                        <div key={item.key} className="bg-gray-700/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                <span className="text-xs text-gray-400">{item.label}</span>
                            </div>
                            <div className="text-lg font-bold text-white">{item.count}</div>
                            <div className="text-xs text-gray-500">{item.pct}%</div>
                        </div>
                    ))}
                </div>

                {/* Suggestions */}
                {assessment.suggestions.length > 0 && (
                    <div className="mt-4 space-y-1 border-t border-gray-700 pt-3">
                        {assessment.suggestions.map((s, i) => (
                            <p key={i} className="text-xs text-gray-400">• {s}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShiftDistributionDisplay;