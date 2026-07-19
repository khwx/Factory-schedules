import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Scenario } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { getAllHolidays } from '../utils/portugueseHolidays';
import { Users, TrendingUp, AlertTriangle, CheckCircle, Plus, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { clsx } from 'clsx';

const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

interface StaffingRule {
    id: string;
    month: number; // 0-11
    minStaff: number;
    maxStaff: number;
    description: string;
    descriptionEn: string;
}

const DEFAULT_STAFFING_RULES: StaffingRule[] = [
    { id: '1', month: 11, minStaff: 3, maxStaff: 5, description: 'Natal/Ano Novo - pico de producao', descriptionEn: 'Christmas/New Year - production peak' },
    { id: '2', month: 0, minStaff: 2, maxStaff: 4, description: 'Janeiro - retorno das ferias', descriptionEn: 'January - post-holiday return' },
    { id: '3', month: 5, minStaff: 3, maxStaff: 5, description: 'Junho - pico de verao', descriptionEn: 'June - summer peak' },
    { id: '4', month: 7, minStaff: 3, maxStaff: 5, description: 'Agosto - pico de verao/ferias', descriptionEn: 'August - summer/holiday peak' },
    { id: '5', month: 10, minStaff: 2, maxStaff: 4, description: 'Novembro - preparacao Black Friday', descriptionEn: 'November - Black Friday prep' },
];

export default function WorkforcePlanning() {
    const { lang } = useI18n();
    const [selectedId, setSelectedId] = useState('');
    const [staffPerTeam, setStaffPerTeam] = useState(5);
    const [teamCount, setTeamCount] = useState(4);
    const [staffingRules] = useState<StaffingRule[]>(DEFAULT_STAFFING_RULES);
    const [customRules, setCustomRules] = useState<StaffingRule[]>([]);
    const [showAddRule, setShowAddRule] = useState(false);
    const [newRuleMonth, setNewRuleMonth] = useState(new Date().getMonth());
    const [newRuleMin, setNewRuleMin] = useState(1);
    const [newRuleMax, setNewRuleMax] = useState(3);
    const [newRuleDesc, setNewRuleDesc] = useState('');

    const scenarios = useMemo(() => {
        try {
            const saved = localStorage.getItem('shiftsim_scenarios');
            if (saved) return JSON.parse(saved) as Scenario[];
        } catch { /* ignore */ }
        return [];
    }, []);

    const activeId = selectedId || (scenarios.length > 0 ? scenarios[0].id : '');
    const scenario = scenarios.find(s => s.id === activeId);

    const year = new Date().getFullYear();
    const holidays = useMemo(() => getAllHolidays(year), [year]);

    const monthlyAnalysis = useMemo(() => {
        if (!scenario) return [];

        const results: Array<{
            month: number;
            monthName: string;
            totalStaff: number;
            availableStaff: number;
            deficit: number;
            surplus: number;
            minRequired: number;
            maxAllowed: number;
            status: 'ok' | 'deficit' | 'surplus';
            workDays: number;
            holidays: number;
        }> = [];

        for (let month = 0; month < 12; month++) {
            const calendar = generateYearCalendar(scenario, year, 0);
            const yearStart = new Date(year, 0, 1);
            const monthStartIndex = Math.floor((new Date(year, month, 1).getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            let workDays = 0;
            let holidaysInMonth = 0;

            for (let i = 0; i < daysInMonth; i++) {
                const calIndex = monthStartIndex + i;
                if (calIndex < calendar.length) {
                    const calDay = calendar[calIndex];
                    const isHoliday = holidays.some(h => h.date.getFullYear() === year && h.date.getMonth() === month && h.date.getDate() === i + 1);

                    if (calDay.shift !== 'F') {
                        workDays++;
                        if (isHoliday) holidaysInMonth++;
                    }
                }
            }

            // Apply rules
            const rule = [...staffingRules, ...customRules].find(r => r.month === month);
            const minRequired = rule?.minStaff || 1;
            const maxAllowed = rule?.maxStaff || staffPerTeam * teamCount;

            const totalStaff = staffPerTeam * teamCount;
            // Available staff = total - estimated off (simplified)
            const avgOffPerMonth = workDays * 0.3; // rough estimate
            const availableStaff = Math.max(0, Math.round(totalStaff - avgOffPerMonth));

            let deficit = 0;
            let surplus = 0;
            let status: 'ok' | 'deficit' | 'surplus' = 'ok';

            if (availableStaff < minRequired) {
                deficit = minRequired - availableStaff;
                status = 'deficit';
            } else if (availableStaff > maxAllowed) {
                surplus = availableStaff - maxAllowed;
                status = 'surplus';
            }

            results.push({
                month,
                monthName: MONTH_NAMES_PT[month],
                totalStaff,
                availableStaff,
                deficit,
                surplus,
                minRequired,
                maxAllowed,
                status,
                workDays,
                holidays: holidaysInMonth,
            });
        }

        return results;
    }, [scenario, staffPerTeam, teamCount, staffingRules, customRules, holidays, year]);

    const totalDeficit = monthlyAnalysis.reduce((sum, m) => sum + m.deficit, 0);
    const totalSurplus = monthlyAnalysis.reduce((sum, m) => sum + m.surplus, 0);
    const monthsWithIssues = monthlyAnalysis.filter(m => m.status !== 'ok').length;

    const handleAddRule = () => {
        if (newRuleDesc.trim() && newRuleMax >= newRuleMin) {
            const rule: StaffingRule = {
                id: `custom-${Date.now()}`,
                month: newRuleMonth,
                minStaff: newRuleMin,
                maxStaff: newRuleMax,
                description: newRuleDesc,
                descriptionEn: newRuleDesc,
            };
            setCustomRules([...customRules, rule]);
            setShowAddRule(false);
            setNewRuleDesc('');
            setNewRuleMin(1);
            setNewRuleMax(3);
        }
    };

    const handleRemoveRule = (id: string) => {
        setCustomRules(customRules.filter(r => r.id !== id));
    };

    if (!scenario) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Planeamento de Equipas</h2>
                    <p className="text-gray-500">Crie ou selecione um cenario para planear as necessidades de pessoal.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-600" />
                        {lang === 'pt' ? 'Planeamento de Pessoal' : 'Workforce Planning'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {lang === 'pt' ? 'Planeie as necessidades de equipas por mes com base no cenario' : 'Plan team staffing needs per month based on scenario'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cenario</label>
                        <select
                            value={activeId}
                            onChange={e => setSelectedId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {scenarios.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipas</label>
                        <input
                            type="number"
                            value={teamCount}
                            onChange={e => setTeamCount(Math.max(1, Number(e.target.value)))}
                            min="1"
                            max="20"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pessoas/Equipa</label>
                        <input
                            type="number"
                            value={staffPerTeam}
                            onChange={e => setStaffPerTeam(Math.max(1, Number(e.target.value)))}
                            min="1"
                            max="50"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Pessoal</label>
                        <input
                            type="number"
                            value={staffPerTeam * teamCount}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 font-bold"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setShowAddRule(!showAddRule)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            {lang === 'pt' ? 'Regra Personalizada' : 'Custom Rule'}
                        </button>
                    </div>
                </div>

                {showAddRule && (
                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-indigo-800 mb-3">{lang === 'pt' ? 'Adicionar Regra de Pessoal' : 'Add Staffing Rule'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Mes</label>
                                <select
                                    value={newRuleMonth}
                                    onChange={e => setNewRuleMonth(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                >
                                    {MONTH_NAMES_PT.map((m, i) => (
                                        <option key={i} value={i}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Minimo</label>
                                <input
                                    type="number"
                                    value={newRuleMin}
                                    onChange={e => setNewRuleMin(Math.max(0, Number(e.target.value)))}
                                    min="0"
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Maximo</label>
                                <input
                                    type="number"
                                    value={newRuleMax}
                                    onChange={e => setNewRuleMax(Math.max(newRuleMin, Number(e.target.value)))}
                                    min={newRuleMin}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Descricao</label>
                                <input
                                    type="text"
                                    value={newRuleDesc}
                                    onChange={e => setNewRuleDesc(e.target.value)}
                                    placeholder={lang === 'pt' ? 'Ex: Pico de producao sazonal' : 'Ex: Seasonal production peak'}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button onClick={handleAddRule} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                                {lang === 'pt' ? 'Adicionar' : 'Add'}
                            </button>
                            <button onClick={() => setShowAddRule(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">
                                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                )}

                {customRules.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{lang === 'pt' ? 'Regras Personalizadas' : 'Custom Rules'}</h4>
                        <div className="flex flex-wrap gap-2">
                            {customRules.map(r => (
                                <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
                                    <span className="font-medium">{MONTH_NAMES_PT[r.month]}</span>
                                    <span className="text-gray-500">{r.minStaff}-{r.maxStaff} pessoas</span>
                                    <span className="text-gray-400">-</span>
                                    <span className="text-gray-600">{r.description}</span>
                                    <button onClick={() => handleRemoveRule(r.id)} className="text-red-500 hover:text-red-700 ml-1">
                                        <Minus className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{lang === 'pt' ? 'Meses OK' : 'Months OK'}</p>
                            <p className="text-2xl font-bold text-emerald-600">{12 - monthsWithIssues}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{lang === 'pt' ? 'Deficit Total' : 'Total Deficit'}</p>
                            <p className="text-2xl font-bold text-red-600">{totalDeficit}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{lang === 'pt' ? 'Excedente Total' : 'Total Surplus'}</p>
                            <p className="text-2xl font-bold text-amber-600">{totalSurplus}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <Users className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{lang === 'pt' ? 'Total Pessoal' : 'Total Staff'}</p>
                            <p className="text-2xl font-bold text-indigo-600">{staffPerTeam * teamCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {lang === 'pt' ? 'Analise Mensal de Necessidades' : 'Monthly Staffing Analysis'}
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    <div className="grid grid-cols-12 gap-1 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500">
                        <div className="col-span-2">{lang === 'pt' ? 'Mes' : 'Month'}</div>
                        <div className="col-span-1 text-center">Total</div>
                        <div className="col-span-1 text-center">Disp.</div>
                        <div className="col-span-1 text-center">Min</div>
                        <div className="col-span-1 text-center">Max</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-1 text-center">Def.</div>
                        <div className="col-span-1 text-center">Exc.</div>
                        <div className="col-span-1 text-center">D.Trab.</div>
                        <div className="col-span-1 text-center">Feriados</div>
                        <div className="col-span-2">Acao</div>
                    </div>
                    {monthlyAnalysis.map(m => (
                        <div key={m.month} className="grid grid-cols-12 gap-1 px-4 py-3 items-center hover:bg-gray-50">
                            <div className="col-span-2 font-medium text-gray-800">{m.monthName}</div>
                            <div className="col-span-1 text-center text-sm">{m.totalStaff}</div>
                            <div className="col-span-1 text-center text-sm text-blue-600 font-medium">{m.availableStaff}</div>
                            <div className="col-span-1 text-center text-sm">{m.minRequired}</div>
                            <div className="col-span-1 text-center text-sm">{m.maxAllowed}</div>
                            <div className="col-span-1 text-center">
                                <span className={clsx(
                                    'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-medium',
                                    m.status === 'ok' ? 'bg-emerald-100 text-emerald-700' :
                                    m.status === 'deficit' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                )}>
                                    {m.status === 'ok' ? (lang === 'pt' ? 'OK' : 'OK') :
                                    m.status === 'deficit' ? (lang === 'pt' ? 'Falta' : 'Deficit') :
                                    (lang === 'pt' ? 'Exced.' : 'Surplus')}
                                </span>
                            </div>
                            <div className="col-span-1 text-center text-sm text-red-600 font-medium">{m.deficit > 0 ? m.deficit : '-'}</div>
                            <div className="col-span-1 text-center text-sm text-amber-600 font-medium">{m.surplus > 0 ? m.surplus : '-'}</div>
                            <div className="col-span-1 text-center text-sm text-gray-500">{m.workDays}</div>
                            <div className="col-span-1 text-center text-sm text-gray-500">{m.holidays}</div>
                            <div className="col-span-2">
                                {m.status === 'deficit' && (
                                    <div className="flex items-center gap-1 text-red-600 text-xs">
                                        <ArrowUpRight className="h-3 w-3" />
                                        <span>{lang === 'pt' ? 'Contratar' : 'Hire'}: {m.deficit}</span>
                                    </div>
                                )}
                                {m.status === 'surplus' && (
                                    <div className="flex items-center gap-1 text-amber-600 text-xs">
                                        <ArrowDownRight className="h-3 w-3" />
                                        <span>{lang === 'pt' ? 'Redistribuir' : 'Reallocate'}: {m.surplus}</span>
                                    </div>
                                )}
                                {m.status === 'ok' && (
                                    <span className="text-emerald-600 text-xs">{lang === 'pt' ? 'Equilibrado' : 'Balanced'}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
                    {lang === 'pt' ? 'Resumo de Contratacoes Sugeridas' : 'Suggested Hiring Summary'}
                </h3>
                <div className="space-y-2">
                    {monthlyAnalysis.filter(m => m.status === 'deficit').map(m => (
                        <div key={m.month} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-sm font-bold">
                                    {m.month + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{m.monthName}</p>
                                    <p className="text-xs text-gray-500">{m.workDays} dias uteis, {m.holidays} feriados</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-red-600">+{m.deficit} {lang === 'pt' ? 'pessoas' : 'people'}</p>
                                <p className="text-xs text-gray-500">Disponiveis: {m.availableStaff} / Min: {m.minRequired}</p>
                            </div>
                        </div>
                    ))}
                    {monthlyAnalysis.filter(m => m.status === 'surplus').map(m => (
                        <div key={m.month} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-bold">
                                    {m.month + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{m.monthName}</p>
                                    <p className="text-xs text-gray-500">{lang === 'pt' ? 'Excedente de pessoal' : 'Staff surplus'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-amber-600">-{m.surplus} {lang === 'pt' ? 'pessoas' : 'people'}</p>
                                <p className="text-xs text-gray-500">Disponiveis: {m.availableStaff} / Max: {m.maxAllowed}</p>
                            </div>
                        </div>
                    ))}
                    {monthlyAnalysis.every(m => m.status === 'ok') && (
                        <div className="text-center py-8 text-gray-500">
                            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
                            <p>{lang === 'pt' ? 'Todas as necessidades estao atendidas!' : 'All staffing needs are met!'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}