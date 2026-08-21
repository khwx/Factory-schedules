import React, { useState, useMemo } from 'react';
import { Euro, Calculator, TrendingUp, Users, Clock, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useI18n } from '../i18n';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { calculateEstimatedPay, formatCurrency, DEFAULT_PAY_CONFIG, type PayConfig } from '../utils/payCalculator';

const COLORS = ['#60A5FA', '#4ADE80', '#F472B6', '#FBBF24', '#A78BFA'];

const CostCalculator: React.FC = () => {
    const { t } = useI18n();
    const [selectedId, setSelectedId] = useState<string>('');
    const [teamCount, setTeamCount] = useState(1);
    const [hourlyRate, setHourlyRate] = useState(DEFAULT_PAY_CONFIG.hourlyRate);
    const [nightPremium, setNightPremium] = useState(DEFAULT_PAY_CONFIG.nightPremium * 100);
    const [holidayPremium, setHolidayPremium] = useState(DEFAULT_PAY_CONFIG.holidayPremium * 100);
    const [weekendPremium, setWeekendPremium] = useState(DEFAULT_PAY_CONFIG.weekendPremium * 100);

    const scenarios = useMemo(() => {
        const saved = localStorage.getItem('shiftsim_scenarios');
        if (saved) {
            try { return JSON.parse(saved) as Scenario[]; }
            catch { return []; }
        }
        return [];
    }, []);

    const selectedScenario = useMemo(() => {
        return scenarios.find(s => s.id === selectedId) || scenarios[0] || null;
    }, [scenarios, selectedId]);

    const analysis = useMemo(() => {
        if (!selectedScenario) return null;
        return calculateAnalysis(selectedScenario);
    }, [selectedScenario]);

    const payConfig: PayConfig = useMemo(() => ({
        hourlyRate,
        nightPremium: nightPremium / 100,
        holidayPremium: holidayPremium / 100,
        weekendPremium: weekendPremium / 100,
    }), [hourlyRate, nightPremium, holidayPremium, weekendPremium]);

    const payEstimate = useMemo(() => {
        if (!selectedScenario) return null;
        return calculateEstimatedPay(selectedScenario, 0, payConfig);
    }, [selectedScenario, payConfig]);

    // Cost comparison across teams
    const teamCostData = useMemo(() => {
        if (!selectedScenario || !payEstimate) return [];
        const data = [];
        for (let i = 0; i < Math.min(teamCount, selectedScenario.teams); i++) {
            const estimate = calculateEstimatedPay(selectedScenario, i, payConfig);
            data.push({
                name: `${t.costCalculator.scenario} ${String.fromCharCode(65 + i)}`,
                'Horas Regulares': estimate.regularHours,
                'Horas Noite': estimate.nightHours,
                'Horas Feriado': estimate.holidayHours,
                'Horas FDS': estimate.weekendHours,
                'Custo Total': Math.round(estimate.totalPay),
            });
        }
        return data;
    }, [selectedScenario, teamCount, payConfig, payEstimate, t]);

    // Monthly cost projection
    const monthlyProjection = useMemo(() => {
        if (!payEstimate) return [];
        const months = t.calendar.months.map(m => m.substring(0, 3));

        let cumulative = 0;
        return months.map((month) => {
            const monthPay = payEstimate.totalPay / 12;
            cumulative += monthPay;
            return {
                month,
                'Custo Mensal': Math.round(monthPay),
                'Custo Acumulado': Math.round(cumulative),
            };
        });
    }, [payEstimate, t]);

    // Cost breakdown pie
    const pieData = useMemo(() => {
        if (!payEstimate) return [];
        return [
            { name: t.costCalculator.regular, value: payEstimate.regularPay },
            { name: t.costCalculator.night, value: payEstimate.nightPay },
            { name: t.costCalculator.holiday, value: payEstimate.holidayPay },
            { name: t.costCalculator.weekend, value: payEstimate.weekendPay },
        ].filter(d => d.value > 0);
    }, [payEstimate, t]);

    const totalTeamCost = useMemo(() => {
        if (!payEstimate) return 0;
        return payEstimate.totalPay * teamCount;
    }, [payEstimate, teamCount]);

    const tooltipStyle = {
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
        color: '#fff',
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <Euro className="w-8 h-8 text-blue-400" />
                    {t.costCalculator.title}
                </h1>
                <p className="text-gray-400">
                    {t.costCalculator.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="space-y-6">
                    {/* Scenario Selection */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-400" />
                            {t.costCalculator.scenario}
                        </h3>
                        <select
                            value={selectedId || (scenarios[0]?.id || '')}
                            onChange={e => setSelectedId(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {scenarios.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.teams} {t.costCalculator.teams})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pay Configuration */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-3">
                            {t.costCalculator.payConfig}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {t.costCalculator.hourlyRate}
                                </label>
                                <input
                                    type="number"
                                    value={hourlyRate}
                                    onChange={e => setHourlyRate(Number(e.target.value))}
                                    min="1"
                                    max="50"
                                    step="0.25"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {t.costCalculator.nightPremium}
                                </label>
                                <input
                                    type="number"
                                    value={nightPremium}
                                    onChange={e => setNightPremium(Number(e.target.value))}
                                    min="0"
                                    max="100"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {t.costCalculator.holidayPremium}
                                </label>
                                <input
                                    type="number"
                                    value={holidayPremium}
                                    onChange={e => setHolidayPremium(Number(e.target.value))}
                                    min="0"
                                    max="200"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {t.costCalculator.weekendPremium}
                                </label>
                                <input
                                    type="number"
                                    value={weekendPremium}
                                    onChange={e => setWeekendPremium(Number(e.target.value))}
                                    min="0"
                                    max="100"
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {t.costCalculator.numberOfTeams}
                                </label>
                                <input
                                    type="number"
                                    value={teamCount}
                                    onChange={e => setTeamCount(Number(e.target.value))}
                                    min="1"
                                    max={selectedScenario?.teams || 10}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-gray-400" />
                            {t.costCalculator.notes}
                        </h3>
                        <ul className="text-xs text-gray-400 space-y-1">
                            <li>{t.costCalculator.noteNight}</li>
                            <li>{t.costCalculator.noteHoliday}</li>
                            <li>{t.costCalculator.noteEstimated}</li>
                        </ul>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {payEstimate && analysis ? (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs">{t.costCalculator.hoursPerTeam}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{payEstimate.totalHours.toLocaleString()}h</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Euro className="w-4 h-4" />
                                        <span className="text-xs">{t.costCalculator.costPerTeam}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(payEstimate.totalPay)}</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs">{t.costCalculator.totalCost}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalTeamCost)}</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-xs">{t.costCalculator.monthlyAvg}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">{formatCurrency(totalTeamCost / 12)}</p>
                                </div>
                            </div>

                            {/* Cost Breakdown Table */}
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                <h3 className="text-white font-semibold mb-4">
                                    {t.costCalculator.breakdownTitle}
                                </h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-2 text-gray-400">{t.costCalculator.colType}</th>
                                            <th className="text-right py-2 text-gray-400">{t.costCalculator.colHours}</th>
                                            <th className="text-right py-2 text-gray-400">{t.costCalculator.colRate}</th>
                                            <th className="text-right py-2 text-gray-400">{t.costCalculator.colSubtotal}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{t.costCalculator.regular} (M/T)</td>
                                            <td className="py-2 text-right text-white">{payEstimate.regularHours}h</td>
                                            <td className="py-2 text-right text-gray-400">{formatCurrency(hourlyRate)}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.regularPay)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{t.costCalculator.night} (N)</td>
                                            <td className="py-2 text-right text-white">{payEstimate.nightHours}h</td>
                                            <td className="py-2 text-right text-purple-400">{formatCurrency(hourlyRate * (1 + nightPremium / 100))}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.nightPay)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{t.costCalculator.holiday}</td>
                                            <td className="py-2 text-right text-white">{payEstimate.holidayHours}h</td>
                                            <td className="py-2 text-right text-yellow-400">{formatCurrency(hourlyRate * (1 + holidayPremium / 100))}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.holidayPay)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{t.costCalculator.weekend}</td>
                                            <td className="py-2 text-right text-white">{payEstimate.weekendHours}h</td>
                                            <td className="py-2 text-right text-green-400">{formatCurrency(hourlyRate * (1 + weekendPremium / 100))}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.weekendPay)}</td>
                                        </tr>
                                        <tr className="bg-gray-700/30">
                                            <td className="py-2 text-white font-semibold" colSpan={3}>{t.costCalculator.totalPerTeam}</td>
                                            <td className="py-2 text-right text-white font-bold text-lg">{formatCurrency(payEstimate.totalPay)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Monthly Projection */}
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        {t.costCalculator.monthlyProjection}
                                    </h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={monthlyProjection}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                                            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                            <Bar dataKey="Custo Mensal" fill="#60A5FA" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Cost Breakdown Pie */}
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <h3 className="text-white font-semibold mb-4">
                                        {t.costCalculator.costDistribution}
                                    </h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={3}
                                                dataKey="value"
                                                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Team Comparison */}
                            {teamCostData.length > 1 && (
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <h3 className="text-white font-semibold mb-4">
                                        {t.costCalculator.teamComparison}
                                    </h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={teamCostData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
                                            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                            <Bar dataKey="Horas Regulares" stackId="a" fill="#60A5FA" />
                                            <Bar dataKey="Horas Noite" stackId="a" fill="#A78BFA" />
                                            <Bar dataKey="Horas Feriado" stackId="a" fill="#FBBF24" />
                                            <Bar dataKey="Horas FDS" stackId="a" fill="#4ADE80" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {/* Annual Summary */}
                            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20 p-6">
                                <h3 className="text-white font-semibold text-lg mb-4">
                                    {t.costCalculator.annualSummary}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">{t.costCalculator.totalTeams}</p>
                                        <p className="text-xl font-bold text-white">{teamCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{t.costCalculator.costPerYear}</p>
                                        <p className="text-xl font-bold text-blue-400">{formatCurrency(totalTeamCost)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{t.costCalculator.costPerMonth}</p>
                                        <p className="text-xl font-bold text-green-400">{formatCurrency(totalTeamCost / 12)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{t.costCalculator.costPerDay}</p>
                                        <p className="text-xl font-bold text-yellow-400">{formatCurrency(totalTeamCost / 365)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                            <Euro className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>{t.costCalculator.emptyState}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostCalculator;
