import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar } from 'lucide-react';
import { useI18n } from '../i18n';
import { useToast } from '../contexts/ToastContext';
import { getAllHolidays, addCustomHoliday, removeCustomHoliday, type Holiday } from '../utils/portugueseHolidays';
import { getHolidaysForCountry, type CountryCode } from '../utils/internationalHolidays';

const MONTH_NAMES_PT = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const COUNTRIES: { code: CountryCode; label: string; flag: string }[] = [
    { code: 'PT', label: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}' },
    { code: 'BR', label: 'Brasil', flag: '\u{1F1E7}\u{1F1F7}' },
    { code: 'AO', label: 'Angola', flag: '\u{1F1E6}\u{1F1F4}' },
    { code: 'MZ', label: 'Mocambique', flag: '\u{1F1F2}\u{1F1FF}' },
];

const HolidayCalendar: React.FC = () => {
    const { lang } = useI18n();
    const { showToast } = useToast();
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [country, setCountry] = useState<CountryCode>('PT');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newMonth, setNewMonth] = useState(0);
    const [newDay, setNewDay] = useState(1);

    const monthNames = lang === 'pt' ? MONTH_NAMES_PT : MONTH_NAMES_EN;
    const dayNames = lang === 'pt' ? DAY_NAMES_PT : DAY_NAMES_EN;

    const holidays = useMemo(() => {
        const countryHolidays = getHolidaysForCountry(country, year);
        const customHolidays = getAllHolidays(year).filter(h => h.type === 'custom');
        const allHolidays = [...countryHolidays, ...customHolidays];
        return allHolidays.filter(h => h.date.getMonth() === month);
    }, [year, month, country]);

    const allYearHolidays = useMemo(() => {
        const countryHolidays = getHolidaysForCountry(country, year);
        const customHolidays = getAllHolidays(year).filter(h => h.type === 'custom');
        return [...countryHolidays, ...customHolidays];
    }, [year, country]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const calendarDays = useMemo(() => {
        const days: Array<{ day: number; isCurrentDay: boolean; holiday?: Holiday }> = [];

        // Empty cells before first day
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push({ day: 0, isCurrentDay: false });
        }

        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const isCurrentDay = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
            const holiday = allYearHolidays.find(h => h.date.getDate() === d && h.date.getMonth() === month);
            days.push({ day: d, isCurrentDay, holiday });
        }

        return days;
    }, [year, month, daysInMonth, firstDayOfWeek, allYearHolidays, today]);

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else { setMonth(m => m - 1); }
    };

    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else { setMonth(m => m + 1); }
    };

    const handleAdd = () => {
        if (!newName.trim()) {
            showToast('error', lang === 'pt' ? 'Nome obrigatorio' : 'Name is required');
            return;
        }
        addCustomHoliday({
            name: newName.trim(),
            month: newMonth,
            day: newDay,
            type: 'custom',
            isFixed: true,
        });
        setNewName('');
        setShowAddForm(false);
        showToast('success', lang === 'pt' ? 'Feriado adicionado' : 'Holiday added');
    };

    const handleRemove = (id: string) => {
        removeCustomHoliday(id);
        showToast('success', lang === 'pt' ? 'Feriado removido' : 'Holiday removed');
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'national': return 'bg-blue-600';
            case 'religious': return 'bg-purple-600';
            case 'regional': return 'bg-green-600';
            case 'custom': return 'bg-yellow-600';
            default: return 'bg-gray-600';
        }
    };

    const getTypeLabel = (type: string) => {
        if (lang === 'pt') {
            switch (type) {
                case 'national': return 'Nacional';
                case 'religious': return 'Religioso';
                case 'regional': return 'Regional';
                case 'custom': return 'Personalizado';
                default: return type;
            }
        }
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Calendario de Feriados' : 'Holiday Calendar'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Visualize e gere feriados nacionais, religiosos e personalizados.'
                        : 'View and manage national, religious, and custom holidays.'}
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" aria-label="Mes anterior">
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <span className="text-white font-semibold text-lg min-w-[180px] text-center">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" aria-label="Proximo mes">
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>

                <select
                    value={country}
                    onChange={e => setCountry(e.target.value as CountryCode)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                    ))}
                </select>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
                >
                    <Plus className="w-4 h-4" />
                    {lang === 'pt' ? 'Adicionar Feriado' : 'Add Holiday'}
                </button>
            </div>

            {/* Add Holiday Form */}
            {showAddForm && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                    <h3 className="text-white font-semibold mb-3">
                        {lang === 'pt' ? 'Novo Feriado Personalizado' : 'New Custom Holiday'}
                    </h3>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder={lang === 'pt' ? 'Nome do feriado' : 'Holiday name'}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <select
                            value={newMonth}
                            onChange={e => setNewMonth(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {monthNames.map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={newDay}
                            onChange={e => setNewDay(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAdd}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {lang === 'pt' ? 'Adicionar' : 'Add'}
                        </button>
                    </div>
                </div>
            )}

            {/* Calendar Grid */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(d => (
                        <div key={d} className="text-center text-gray-400 text-sm font-medium py-2">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, i) => (
                        <div
                            key={i}
                            className={`min-h-[80px] p-2 rounded-lg border transition-colors ${
                                cell.day === 0
                                    ? 'border-transparent'
                                    : cell.holiday
                                        ? `${getTypeColor(cell.holiday.type)} border-opacity-50`
                                        : 'border-gray-700 hover:border-gray-600'
                            } ${cell.isCurrentDay ? 'ring-2 ring-blue-400' : ''}`}
                        >
                            {cell.day > 0 && (
                                <>
                                    <span className={`text-sm ${cell.isCurrentDay ? 'font-bold text-blue-400' : 'text-gray-300'}`}>
                                        {cell.day}
                                    </span>
                                    {cell.holiday && (
                                        <div className="mt-1">
                                            <p className="text-xs text-white font-medium truncate" title={cell.holiday.name}>
                                                {cell.holiday.name}
                                            </p>
                                            <span className="text-[10px] text-gray-200 uppercase">
                                                {getTypeLabel(cell.holiday.type)}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Holiday List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <h3 className="text-white font-semibold mb-4">
                    {lang === 'pt' ? 'Todos os Feriados do Mes' : 'All Holidays This Month'}
                </h3>
                {holidays.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        {lang === 'pt' ? 'Nenhum feriado neste mes.' : 'No holidays this month.'}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {holidays.map((h, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${getTypeColor(h.type)}`} />
                                    <div>
                                        <p className="text-white font-medium">{h.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {h.date.getDate()} {monthNames[h.date.getMonth()]} &bull; {getTypeLabel(h.type)}
                                        </p>
                                    </div>
                                </div>
                                {h.type === 'custom' && (
                                    <button
                                        onClick={() => handleRemove(h.monthDay)}
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                        aria-label={lang === 'pt' ? 'Remover' : 'Remove'}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4">
                {(['national', 'religious', 'regional', 'custom'] as const).map(type => (
                    <div key={type} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
                        <span className="text-sm text-gray-400">{getTypeLabel(type)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HolidayCalendar;
