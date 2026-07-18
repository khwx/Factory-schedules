import { useState, useMemo, useCallback } from 'react';
import { Scenario, ShiftType } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { getAllHolidays } from '../utils/portugueseHolidays';
import { calculateEstimatedPay, PayConfig, DEFAULT_PAY_CONFIG, formatCurrency } from '../utils/payCalculator';
import { ChevronLeft, ChevronRight, User, Clock, Calendar, Palmtree, Moon, Printer } from 'lucide-react';
import { clsx } from 'clsx';

const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAY_NAMES_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const SHIFT_COLORS: Record<ShiftType, string> = {
    M: 'bg-blue-100 text-blue-800 border-blue-300',
    T: 'bg-amber-100 text-amber-800 border-amber-300',
    N: 'bg-purple-100 text-purple-800 border-purple-300',
    F: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function useScenarios(): Scenario[] {
    return useMemo(() => {
        try {
            const saved = localStorage.getItem('shiftsim_scenarios');
            if (saved) return JSON.parse(saved) as Scenario[];
        } catch { /* ignore */ }
        return [];
    }, []);
}

export default function EmployeeSchedule() {
    const scenarios = useScenarios();
    const [selectedScenarioId, setSelectedScenarioId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeTeam, setEmployeeTeam] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear] = useState(new Date().getFullYear());
    const [payConfig, setPayConfig] = useState<PayConfig>(DEFAULT_PAY_CONFIG);
    const [showPayEstimate, setShowPayEstimate] = useState(false);

    const activeScenarioId = selectedScenarioId || (scenarios.length > 0 ? scenarios[0].id : '');
    const scenario = scenarios.find(s => s.id === activeScenarioId);

    const teamPatterns = scenario?.teamPatterns || [];
    const teamCount = teamPatterns.length || scenario?.teams || 1;
    const teamNames = Array.from({ length: teamCount }, (_: unknown, i: number) => `Equipa ${i + 1}`);

    const calendar = useMemo(() => {
        if (!scenario) return [];
        return generateYearCalendar(scenario, currentYear, employeeTeam);
    }, [scenario, currentYear, employeeTeam]);

    const holidays = useMemo(() => getAllHolidays(currentYear), [currentYear]);

    const monthData = useMemo(() => {
        if (!scenario) return { days: [] as Array<{ date: Date; shift: ShiftType; isHoliday: boolean; isWeekend: boolean }>, totalHours: 0, workDays: 0, offDays: 0, nightShifts: 0, adjustedStartDay: 0 };
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDay = new Date(currentYear, currentMonth, 1).getDay();
        const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

        const days: Array<{ date: Date; shift: ShiftType; isHoliday: boolean; isWeekend: boolean }> = [];
        const yearStart = new Date(currentYear, 0, 1);
        const monthStartIndex = Math.floor((new Date(currentYear, currentMonth, 1).getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));

        let totalHours = 0;
        let workDays = 0;
        let offDays = 0;
        let nightShifts = 0;

        for (let i = 0; i < daysInMonth; i++) {
            const calIndex = monthStartIndex + i;
            if (calIndex < calendar.length) {
                const calDay = calendar[calIndex];
                const date = new Date(currentYear, currentMonth, i + 1);
                const isHoliday = holidays.some(h => h.date.getFullYear() === date.getFullYear() && h.date.getMonth() === date.getMonth() && h.date.getDate() === date.getDate());
                days.push({
                    date,
                    shift: calDay.shift,
                    isHoliday,
                    isWeekend: calDay.isWeekend,
                });

                if (calDay.shift !== 'F') {
                    totalHours += scenario.shiftDuration;
                    workDays++;
                    if (calDay.shift === 'N') nightShifts++;
                } else {
                    offDays++;
                }
            }
        }

        return { days, totalHours, workDays, offDays, nightShifts, adjustedStartDay };
    }, [scenario, calendar, currentMonth, currentYear, holidays]);

    const payEstimate = useMemo(() => {
        if (!scenario || !showPayEstimate) return null;
        return calculateEstimatedPay(scenario, employeeTeam, payConfig);
    }, [scenario, employeeTeam, payConfig, showPayEstimate]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const navigateMonth = (direction: number) => {
        const newMonth = currentMonth + direction;
        if (newMonth < 0) setCurrentMonth(11);
        else if (newMonth > 11) setCurrentMonth(0);
        else setCurrentMonth(newMonth);
    };

    if (!scenario) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Horario Individual do Colaborador</h2>
                    <p className="text-gray-500">Crie ou selecione um cenario para visualizar o horario individual.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="h-6 w-6 text-blue-600" />
                        Horario Individual do Colaborador
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Visualize o horario detalhado por colaborador e mes</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors no-print"
                >
                    <Printer className="h-4 w-4" />
                    Imprimir
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 no-print">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cenario</label>
                        <select
                            value={activeScenarioId}
                            onChange={e => setSelectedScenarioId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {scenarios.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipa</label>
                        <select
                            value={employeeTeam}
                            onChange={e => setEmployeeTeam(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {teamNames.map((name: string, i: number) => (
                                <option key={i} value={i}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Colaborador</label>
                        <input
                            type="text"
                            value={employeeName}
                            onChange={e => setEmployeeName(e.target.value)}
                            placeholder="Ex: Joao Silva"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showPayEstimate}
                                onChange={e => setShowPayEstimate(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Simular Remuneracao</span>
                        </label>
                    </div>
                </div>

                {showPayEstimate && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Configuracao de Remuneracao</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Taxa Horaria (€)</label>
                                <input
                                    type="number"
                                    value={payConfig.hourlyRate}
                                    onChange={e => setPayConfig(p => ({ ...p, hourlyRate: Number(e.target.value) }))}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                    step="0.5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Premio Noturno (%)</label>
                                <input
                                    type="number"
                                    value={Math.round(payConfig.nightPremium * 100)}
                                    onChange={e => setPayConfig(p => ({ ...p, nightPremium: Number(e.target.value) / 100 }))}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                    step="5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Premio Fim de Semana (%)</label>
                                <input
                                    type="number"
                                    value={Math.round(payConfig.weekendPremium * 100)}
                                    onChange={e => setPayConfig(p => ({ ...p, weekendPremium: Number(e.target.value) / 100 }))}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                    step="5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Premio Feriados (%)</label>
                                <input
                                    type="number"
                                    value={Math.round(payConfig.holidayPremium * 100)}
                                    onChange={e => setPayConfig(p => ({ ...p, holidayPremium: Number(e.target.value) / 100 }))}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                                    step="5"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            {employeeName ? `${employeeName} — ` : ''}{MONTH_NAMES_PT[currentMonth]} {currentYear}
                        </h2>
                        <p className="text-sm text-gray-500">{teamNames[employeeTeam]}</p>
                    </div>
                    <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-medium">Horas Trabalhadas</span>
                        </div>
                        <span className="text-lg font-bold text-blue-800">{monthData.totalHours}h</span>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-medium">Dias de Turno</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-800">{monthData.workDays}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <Palmtree className="h-4 w-4" />
                            <span className="text-xs font-medium">Dias de Folga</span>
                        </div>
                        <span className="text-lg font-bold text-gray-800">{monthData.offDays}</span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                            <Moon className="h-4 w-4" />
                            <span className="text-xs font-medium">Turnos Noturnos</span>
                        </div>
                        <span className="text-lg font-bold text-purple-800">{monthData.nightShifts}</span>
                    </div>
                </div>

                {payEstimate && (
                    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                        <h4 className="text-sm font-medium text-emerald-800 mb-2">Simulacao de Remuneracao Anual</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div>
                                <span className="text-xs text-emerald-600">Regulares</span>
                                <p className="font-semibold text-emerald-900">{formatCurrency(payEstimate.regularPay)}</p>
                                <p className="text-[10px] text-emerald-500">{payEstimate.regularHours}h</p>
                            </div>
                            <div>
                                <span className="text-xs text-emerald-600">Noturno</span>
                                <p className="font-semibold text-emerald-900">{formatCurrency(payEstimate.nightPay)}</p>
                                <p className="text-[10px] text-emerald-500">{payEstimate.nightHours}h</p>
                            </div>
                            <div>
                                <span className="text-xs text-emerald-600">Feriados</span>
                                <p className="font-semibold text-emerald-900">{formatCurrency(payEstimate.holidayPay)}</p>
                                <p className="text-[10px] text-emerald-500">{payEstimate.holidayHours}h</p>
                            </div>
                            <div>
                                <span className="text-xs text-emerald-600">Fins de Semana</span>
                                <p className="font-semibold text-emerald-900">{formatCurrency(payEstimate.weekendPay)}</p>
                                <p className="text-[10px] text-emerald-500">{payEstimate.weekendHours}h</p>
                            </div>
                            <div>
                                <span className="text-xs text-emerald-600">Total Anual</span>
                                <p className="text-xl font-bold text-emerald-900">{formatCurrency(payEstimate.totalPay)}</p>
                                <p className="text-[10px] text-emerald-500">{payEstimate.totalHours}h</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-emerald-600 mt-2">Media Mensal: {formatCurrency(payEstimate.monthlyAvg)}</p>
                    </div>
                )}

                <div className="mb-3 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 font-medium mr-2">Legenda:</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-300">Manha</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-300">Tarde</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-100 text-purple-800 border-purple-300">Noite</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Folga</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">Feriado</span>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {DAY_NAMES_PT.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: monthData.adjustedStartDay }, (_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {monthData.days.map((day, i) => {
                        const isHoliday = day.isHoliday;
                        return (
                            <div
                                key={i}
                                className={clsx(
                                    'aspect-square flex flex-col items-center justify-center rounded-lg border text-xs transition-all hover:scale-105',
                                    SHIFT_COLORS[day.shift],
                                    isHoliday && 'ring-2 ring-red-400',
                                )}
                            >
                                <span className="font-semibold text-[10px] md:text-xs">{day.date.getDate()}</span>
                                <span className="text-[8px] md:text-[10px] mt-0.5">
                                    {isHoliday ? 'FER' : day.shift}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo do Mes</h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
                        <div className="bg-blue-50 rounded p-2">
                            <p className="text-xs text-gray-500">Manhas</p>
                            <p className="font-bold text-blue-800">{monthData.days.filter(d => d.shift === 'M').length}</p>
                        </div>
                        <div className="bg-amber-50 rounded p-2">
                            <p className="text-xs text-gray-500">Tardes</p>
                            <p className="font-bold text-amber-800">{monthData.days.filter(d => d.shift === 'T').length}</p>
                        </div>
                        <div className="bg-purple-50 rounded p-2">
                            <p className="text-xs text-gray-500">Noites</p>
                            <p className="font-bold text-purple-800">{monthData.days.filter(d => d.shift === 'N').length}</p>
                        </div>
                        <div className="bg-emerald-50 rounded p-2">
                            <p className="text-xs text-gray-500">Folgas</p>
                            <p className="font-bold text-emerald-800">{monthData.days.filter(d => d.shift === 'F').length}</p>
                        </div>
                        <div className="bg-red-50 rounded p-2">
                            <p className="text-xs text-gray-500">Feriados</p>
                            <p className="font-bold text-red-800">{monthData.days.filter(d => d.isHoliday).length}</p>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-500">FDS Trab.</p>
                            <p className="font-bold text-gray-800">{monthData.days.filter(d => d.isWeekend && d.shift !== 'F').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Proximo Mes</h3>
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {DAY_NAMES_PT.map(day => (
                        <div key={day} className="text-center text-[10px] font-semibold text-gray-400 py-1">
                            {day}
                        </div>
                    ))}
                    {(() => {
                        const nextMonth = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
                        const nextYear = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;
                        const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
                        const startDay = new Date(nextYear, nextMonth, 1).getDay();
                        const adjustedStart = startDay === 0 ? 6 : startDay - 1;
                        const yearStart = new Date(currentYear, 0, 1);
                        const monthStartIndex = Math.floor((new Date(nextYear, nextMonth, 1).getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <>
                                {Array.from({ length: adjustedStart }, (_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}
                                {Array.from({ length: Math.min(daysInNextMonth, 14) }, (_, i) => {
                                    const calIndex = monthStartIndex + i;
                                    const shift: ShiftType = calIndex < calendar.length ? calendar[calIndex].shift : 'F';
                                    const date = new Date(nextYear, nextMonth, i + 1);
                                    const isHoliday = holidays.some(h => h.date.getFullYear() === date.getFullYear() && h.date.getMonth() === date.getMonth() && h.date.getDate() === date.getDate());
                                    return (
                                        <div
                                            key={i}
                                            className={clsx(
                                                'aspect-square flex flex-col items-center justify-center rounded text-[10px] border',
                                                SHIFT_COLORS[shift],
                                                isHoliday && 'ring-2 ring-red-400',
                                            )}
                                        >
                                            <span className="font-semibold">{date.getDate()}</span>
                                            <span>{isHoliday ? 'FER' : shift}</span>
                                        </div>
                                    );
                                })}
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
