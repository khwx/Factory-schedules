import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Activity, Users, Clock, Calendar, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart as RePieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis } from 'recharts';
import { useI18n } from '../i18n';
import { Scenario } from '../types';
import { calculateAnalysis } from '../utils/calculations';

const COLORS = ['#60A5FA', '#4ADE80', '#F472B6', '#FBBF24', '#A78BFA', '#FB923C', '#2DD4BF', '#F87171'];

const AnalyticsDashboard: React.FC = () => {
    const { lang } = useI18n();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

    // Radar chart data: compare scenarios on multiple dimensions
    const radarData = useMemo(() => {
        if (selectedScenarios.length === 0) return [];

        const metrics = [
            { key: 'weekends', label: lang === 'pt' ? 'Fins de Semana' : 'Weekends', max: 60 },
            { key: 'offDays', label: lang === 'pt' ? 'Dias Folga' : 'Off Days', max: 150 },
            { key: 'hours', label: lang === 'pt' ? 'Horas Semanais' : 'Weekly Hours', max: 50 },
            { key: 'nights', label: lang === 'pt' ? 'Turnos Noite' : 'Night Shifts', max: 150 },
            { key: 'fridayOff', label: lang === 'pt' ? 'Sextas Livres' : 'Fridays Off', max: 52 },
            { key: 'miniVacations', label: lang === 'pt' ? 'Mini-Ferias' : 'Mini Vacations', max: 20 },
        ];

        return metrics.map(m => {
            const dataPoint: Record<string, string | number> = { metric: m.label };
            selectedScenarios.forEach((s, i) => {
                const analysis = selectedAnalyses[i];
                if (!analysis) return;
                const am = analysis.advancedMetrics;
                let value = 0;
                switch (m.key) {
                    case 'weekends': value = analysis.weekendsOffPerYear; break;
                    case 'offDays': value = analysis.totalOffDaysPerYear; break;
                    case 'hours': value = analysis.avgWeeklyHours; break;
                    case 'nights': value = am?.totalNightShifts || 0; break;
                    case 'fridayOff': value = am?.fridayNightsOff || 0; break;
                    case 'miniVacations': value = am?.miniVacations || 0; break;
                }
                const shortName = s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name;
                dataPoint[shortName] = Math.round((value / m.max) * 100);
            });
            return dataPoint;
        });
    }, [selectedScenarios, selectedAnalyses, lang]);

    // Pie chart: distribution of shift types across all selected scenarios
    const pieData = useMemo(() => {
        if (selectedScenarios.length === 0) return [];

        let morning = 0, afternoon = 0, night = 0, off = 0;

        selectedScenarios.forEach(s => {
            const pattern = s.pattern;
            for (const ch of pattern) {
                switch (ch) {
                    case 'M': morning++; break;
                    case 'T': afternoon++; break;
                    case 'N': night++; break;
                    case 'F': off++; break;
                }
            }
        });

        return [
            { name: lang === 'pt' ? 'Manha' : 'Morning', value: morning },
            { name: lang === 'pt' ? 'Tarde' : 'Afternoon', value: afternoon },
            { name: lang === 'pt' ? 'Noite' : 'Night', value: night },
            { name: lang === 'pt' ? 'Folga' : 'Off', value: off },
        ].filter(d => d.value > 0);
    }, [selectedScenarios, lang]);

    // Scatter: hours vs weekends (bubble = teams)
    const scatterData = useMemo(() => {
        return selectedScenarios.map((s, i) => {
            const a = selectedAnalyses[i];
            if (!a) return null;
            return {
                name: s.name,
                hours: a.avgWeeklyHours,
                weekends: a.weekendsOffPerYear,
                teams: s.teams,
            };
        }).filter(Boolean);
    }, [selectedScenarios, selectedAnalyses]);

    // Bar chart: comparison of key metrics
    const comparisonBarData = useMemo(() => {
        return selectedScenarios.map((s, i) => {
            const a = selectedAnalyses[i];
            if (!a) return null;
            const shortName = s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name;
            return {
                name: shortName,
                [lang === 'pt' ? 'Horas/Semana' : 'Hours/Week']: a.avgWeeklyHours,
                [lang === 'pt' ? 'FDS/Ano' : 'Weekends/Year']: a.weekendsOffPerYear,
                [lang === 'pt' ? 'Folgas/Ano' : 'Off Days/Year']: a.totalOffDaysPerYear,
            };
        }).filter(Boolean);
    }, [selectedScenarios, selectedAnalyses, lang]);

    // Night shift impact line chart
    const nightImpactData = useMemo(() => {
        return selectedScenarios.map((s, i) => {
            const a = selectedAnalyses[i];
            if (!a) return null;
            const am = a.advancedMetrics;
            const shortName = s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name;
            return {
                name: shortName,
                [lang === 'pt' ? 'Turnos Noite' : 'Night Shifts']: am?.totalNightShifts || 0,
                [lang === 'pt' ? 'Noites Consec.' : 'Consec. Nights']: am?.maxConsecutiveNightShifts || 0,
                [lang === 'pt' ? 'Sextas Livres' : 'Fridays Off']: am?.fridayNightsOff || 0,
            };
        }).filter(Boolean);
    }, [selectedScenarios, selectedAnalyses, lang]);

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
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Painel Analitico' : 'Analytics Dashboard'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Visualizacoes avancadas e comparacoes entre cenarios.'
                        : 'Advanced visualizations and scenario comparisons.'}
                </p>
            </div>

            {/* Scenario Selection */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{lang === 'pt' ? 'Selecionar Cenarios' : 'Select Scenarios'}</h3>
                    <button onClick={selectAll} className="text-sm text-blue-400 hover:text-blue-300">
                        {selectedIds.size === scenarios.length ? (lang === 'pt' ? 'Desselecionar' : 'Deselect') : (lang === 'pt' ? 'Selecionar Todos' : 'Select All')}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {scenarios.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => toggleSelect(s.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                selectedIds.has(s.id)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                        >
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            {s.name}
                        </button>
                    ))}
                </div>
            </div>

            {selectedScenarios.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{lang === 'pt' ? 'Selecione cenarios para ver as analises.' : 'Select scenarios to view analytics.'}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Key Metrics Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Users className="w-4 h-4" />
                                <span className="text-xs">{lang === 'pt' ? 'Cenarios' : 'Scenarios'}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{selectedScenarios.length}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs">{lang === 'pt' ? 'Media Horas' : 'Avg Hours'}</span>
                            </div>
                            <p className="text-2xl font-bold text-white">
                                {(selectedAnalyses.reduce((s, a) => s + (a?.avgWeeklyHours || 0), 0) / selectedScenarios.length).toFixed(1)}h
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs">{lang === 'pt' ? 'Media FDS' : 'Avg Weekends'}</span>
                            </div>
                            <p className="text-2xl font-bold text-green-400">
                                {(selectedAnalyses.reduce((s, a) => s + (a?.weekendsOffPerYear || 0), 0) / selectedScenarios.length).toFixed(0)}
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Zap className="w-4 h-4" />
                                <span className="text-xs">{lang === 'pt' ? 'Noites Mes' : 'Nights/Month'}</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-400">
                                {(selectedAnalyses.reduce((s, a) => s + (a?.advancedMetrics?.nightShiftsPerMonth || 0), 0) / selectedScenarios.length).toFixed(1)}
                            </p>
                        </div>
                    </div>

                    {/* Comparison Bar Chart */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            {lang === 'pt' ? 'Comparacao de Metricas' : 'Metrics Comparison'}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonBarData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                <Bar dataKey={lang === 'pt' ? 'Horas/Semana' : 'Hours/Week'} fill="#60A5FA" />
                                <Bar dataKey={lang === 'pt' ? 'FDS/Ano' : 'Weekends/Year'} fill="#4ADE80" />
                                <Bar dataKey={lang === 'pt' ? 'Folgas/Ano' : 'Off Days/Year'} fill="#A78BFA" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Radar + Pie Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Radar Chart */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-400" />
                                {lang === 'pt' ? 'Perfil de Qualidade' : 'Quality Profile'}
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#374151" />
                                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                    <PolarRadiusAxis tick={{ fill: '#6B7280', fontSize: 10 }} domain={[0, 100]} />
                                    {selectedScenarios.map((s, i) => {
                                        const shortName = s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name;
                                        return (
                                            <Radar
                                                key={s.id}
                                                name={shortName}
                                                dataKey={shortName}
                                                stroke={COLORS[i % COLORS.length]}
                                                fill={COLORS[i % COLORS.length]}
                                                fillOpacity={0.15}
                                            />
                                        );
                                    })}
                                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-yellow-400" />
                                {lang === 'pt' ? 'Distribuicao de Turnos' : 'Shift Distribution'}
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RePieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={i} fill={['#FBBF24', '#FB923C', '#6366F1', '#6B7280'][i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Night Shift Impact */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            {lang === 'pt' ? 'Impacto do Turno Noturno' : 'Night Shift Impact'}
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={nightImpactData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                                <Line type="monotone" dataKey={lang === 'pt' ? 'Turnos Noite' : 'Night Shifts'} stroke="#A78BFA" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey={lang === 'pt' ? 'Noites Consec.' : 'Consec. Nights'} stroke="#F472B6" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey={lang === 'pt' ? 'Sextas Livres' : 'Fridays Off'} stroke="#4ADE80" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Scatter: Hours vs Weekends */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-pink-400" />
                            {lang === 'pt' ? 'Horas vs Fins de Semana (tamanho = equipas)' : 'Hours vs Weekends (size = teams)'}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="hours" name={lang === 'pt' ? 'Horas' : 'Hours'} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} label={{ value: lang === 'pt' ? 'Horas/Semana' : 'Hours/Week', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
                                <YAxis dataKey="weekends" name={lang === 'pt' ? 'FDS' : 'Weekends'} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} label={{ value: lang === 'pt' ? 'FDS/Ano' : 'Weekends/Year', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                                <ZAxis dataKey="teams" range={[100, 500]} name={lang === 'pt' ? 'Equipas' : 'Teams'} />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(_: unknown, __: unknown, props: { payload?: { name?: string; hours?: number; weekends?: number; teams?: number } }) => {
                                        const p = props.payload;
                                        return [`${p?.name || ''} (${p?.teams || 0} equipas)`, ''];
                                    }}
                                />
                                <Scatter data={scatterData} fill="#F472B6" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
