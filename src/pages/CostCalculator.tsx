import React, { useState, useMemo } from 'react';
import { Euro, Calculator, TrendingUp, Users, Clock, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useI18n } from '../i18n';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';
import { calculateEstimatedPay, formatCurrency, DEFAULT_PAY_CONFIG, type PayConfig } from '../utils/payCalculator';

const COLORS = ['#60A5FA', '#4ADE80', '#F472B6', '#FBBF24', '#A78BFA'];

const CostCalculator: React.FC = () => {
    const { lang } = useI18n();
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
                name: `${lang === 'pt' ? 'Equipa' : 'Team'} ${String.fromCharCode(65 + i)}`,
                'Horas Regulares': estimate.regularHours,
                'Horas Noite': estimate.nightHours,
                'Horas Feriado': estimate.holidayHours,
                'Horas FDS': estimate.weekendHours,
                'Custo Total': Math.round(estimate.totalPay),
            });
        }
        return data;
    }, [selectedScenario, teamCount, payConfig, payEstimate, lang]);

    // Monthly cost projection
    const monthlyProjection = useMemo(() => {
        if (!payEstimate) return [];
        const months = lang === 'pt'
            ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
    }, [payEstimate, lang]);

    // Cost breakdown pie
    const pieData = useMemo(() => {
        if (!payEstimate) return [];
        return [
            { name: lang === 'pt' ? 'Regular' : 'Regular', value: payEstimate.regularPay },
            { name: lang === 'pt' ? 'Noite' : 'Night', value: payEstimate.nightPay },
            { name: lang === 'pt' ? 'Feriado' : 'Holiday', value: payEstimate.holidayPay },
            { name: lang === 'pt' ? 'FDS' : 'Weekend', value: payEstimate.weekendPay },
        ].filter(d => d.value > 0);
    }, [payEstimate, lang]);

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
                    {lang === 'pt' ? 'Calculadora de Custos' : 'Cost Calculator'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Simule custos laborais por cenario, equipa e tipo de turno.'
                        : 'Simulate labor costs by scenario, team, and shift type.'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="space-y-6">
                    {/* Scenario Selection */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-400" />
                            {lang === 'pt' ? 'Cenario' : 'Scenario'}
                        </h3>
                        <select
                            value={selectedId || (scenarios[0]?.id || '')}
                            onChange={e => setSelectedId(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {scenarios.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.teams} {lang === 'pt' ? 'equipas' : 'teams'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pay Configuration */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-3">
                            {lang === 'pt' ? 'Configuracao Salarial' : 'Pay Configuration'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    {lang === 'pt' ? 'Taxa Horaria (EUR)' : 'Hourly Rate (EUR)'}
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
                                    {lang === 'pt' ? 'Acrescimo Noturno (%)' : 'Night Premium (%)'}
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
                                    {lang === 'pt' ? 'Acrescimo Feriado (%)' : 'Holiday Premium (%)'}
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
                                    {lang === 'pt' ? 'Acrescimo FDS (%)' : 'Weekend Premium (%)'}
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
                                    {lang === 'pt' ? 'Numero de Equipas' : 'Number of Teams'}
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
                            {lang === 'pt' ? 'Notas' : 'Notes'}
                        </h3>
                        <ul className="text-xs text-gray-400 space-y-1">
                            <li>{lang === 'pt' ? 'Acrescimo noturno: 25% minimo legal PT' : 'Night premium: 25% minimum legal PT'}</li>
                            <li>{lang === 'pt' ? 'Acrescimo feriado: 100% dia util, 50% dia descanso' : 'Holiday premium: 100% work day, 50% rest day'}</li>
                            <li>{lang === 'pt' ? 'Valores estimados, sujeitos a negociacao coletiva' : 'Estimated values, subject to collective bargaining'}</li>
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
                                        <span className="text-xs">{lang === 'pt' ? 'Horas/Equipa' : 'Hours/Team'}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{payEstimate.totalHours.toLocaleString()}h</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Euro className="w-4 h-4" />
                                        <span className="text-xs">{lang === 'pt' ? 'Custo/Equipa' : 'Cost/Team'}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(payEstimate.totalPay)}</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs">{lang === 'pt' ? 'Custo Total' : 'Total Cost'}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalTeamCost)}</p>
                                </div>
                                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-xs">{lang === 'pt' ? 'Media Mensal' : 'Monthly Avg'}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-400">{formatCurrency(totalTeamCost / 12)}</p>
                                </div>
                            </div>

                            {/* Cost Breakdown Table */}
                            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                                <h3 className="text-white font-semibold mb-4">
                                    {lang === 'pt' ? 'Detalhe por Tipo de Turno' : 'Breakdown by Shift Type'}
                                </h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-2 text-gray-400">{lang === 'pt' ? 'Tipo' : 'Type'}</th>
                                            <th className="text-right py-2 text-gray-400">{lang === 'pt' ? 'Horas' : 'Hours'}</th>
                                            <th className="text-right py-2 text-gray-400">{lang === 'pt' ? 'Taxa' : 'Rate'}</th>
                                            <th className="text-right py-2 text-gray-400">{lang === 'pt' ? 'Subtotal' : 'Subtotal'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{lang === 'pt' ? 'Regular (M/T)' : 'Regular (M/T)'}</td>
                                            <td className="py-2 text-right text-white">{payEstimate.regularHours}h</td>
                                            <td className="py-2 text-right text-gray-400">{formatCurrency(hourlyRate)}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.regularPay)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{lang === 'pt' ? 'Noite (N)' : 'Night (N)'}</td>
                                            <td className="py-2 text-right text-white">{payEstimate.nightHours}h</td>
                                            <td className="py-2 text-right text-purple-400">{formatCurrency(hourlyRate * (1 + nightPremium / 100))}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.nightPay)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{lang === 'pt' ? 'Feriado' : 'Holiday'}</td>
                                            <td className="py-2 text-right text-white">{payEstimate.holidayHours}h</td>
                                            <td className="py-2 text-right text-yellow-400">{formatCurrency(hourlyRate * (1 + holidayPremium / 100))}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.holidayPay)}</td>
                                        </tr>
                                        <tr className="border-b border-gray-700/50">
                                            <td className="py-2 text-gray-300">{lang === 'pt' ? 'Fim de Semana' : 'Weekend'}</td>
                                            <td className="py-2 text-right text-white">{payEstimate.weekendHours}h</td>
                                            <td className="py-2 text-right text-green-400">{formatCurrency(hourlyRate * (1 + weekendPremium / 100))}/h</td>
                                            <td className="py-2 text-right text-white font-medium">{formatCurrency(payEstimate.weekendPay)}</td>
                                        </tr>
                                        <tr className="bg-gray-700/30">
                                            <td className="py-2 text-white font-semibold" colSpan={3}>{lang === 'pt' ? 'Total por Equipa' : 'Total per Team'}</td>
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
                                        {lang === 'pt' ? 'Projecao Mensal' : 'Monthly Projection'}
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
                                        {lang === 'pt' ? 'Distribuicao de Custo' : 'Cost Distribution'}
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
                                        {lang === 'pt' ? 'Comparacao entre Equipas' : 'Team Comparison'}
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
                                    {lang === 'pt' ? 'Resumo Anual' : 'Annual Summary'}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400">{lang === 'pt' ? 'Total Equipas' : 'Total Teams'}</p>
                                        <p className="text-xl font-bold text-white">{teamCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{lang === 'pt' ? 'Custo Total/Ano' : 'Total Cost/Year'}</p>
                                        <p className="text-xl font-bold text-blue-400">{formatCurrency(totalTeamCost)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{lang === 'pt' ? 'Custo Total/Mes' : 'Total Cost/Month'}</p>
                                        <p className="text-xl font-bold text-green-400">{formatCurrency(totalTeamCost / 12)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">{lang === 'pt' ? 'Custo Total/Dia' : 'Total Cost/Day'}</p>
                                        <p className="text-xl font-bold text-yellow-400">{formatCurrency(totalTeamCost / 365)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                            <Euro className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>{lang === 'pt' ? 'Selecione um cenario para calcular custos.' : 'Select a scenario to calculate costs.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostCalculator;
