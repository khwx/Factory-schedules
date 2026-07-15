import React, { useState, useMemo } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Globe, Download, Upload, FilePlus2, Trash2, Plus, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useI18n } from '../i18n';
import { getCustomHolidays, addCustomHoliday, removeCustomHoliday } from '../utils/portugueseHolidays';

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const { lang, setLang } = useI18n();

    const [customHolidays, setCustomHolidays] = useState<Array<{ id: string; name: string; month: number; day: number }>>(() => {
        try { return getCustomHolidays(); }
        catch { return []; }
    });
    const [newHolidayName, setNewHolidayName] = useState('');
    const [newHolidayMonth, setNewHolidayMonth] = useState(0);
    const [newHolidayDay, setNewHolidayDay] = useState(1);

    const monthNames = lang === 'pt'
        ? ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleBackup = () => {
        const data = {
            scenarios: localStorage.getItem('shiftsim_scenarios') || '[]',
            customHolidays: localStorage.getItem('shiftsim_custom_holidays') || '[]',
            theme: localStorage.getItem('shiftsim_theme') || 'dark',
            timestamp: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shiftsim-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('success', lang === 'pt' ? 'Backup feito com sucesso!' : 'Backup successful!');
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.scenarios) localStorage.setItem('shiftsim_scenarios', data.scenarios);
                if (data.customHolidays) localStorage.setItem('shiftsim_custom_holidays', data.customHolidays);
                if (data.theme) localStorage.setItem('shiftsim_theme', data.theme);
                showToast('success', lang === 'pt' ? 'Backup restaurado! A pagina vai recarregar.' : 'Backup restored! Page will reload.');
                setTimeout(() => window.location.reload(), 1500);
            } catch {
                showToast('error', lang === 'pt' ? 'Erro ao restaurar backup.' : 'Error restoring backup.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (!data.scenarios || !Array.isArray(data.scenarios)) {
                    showToast('error', lang === 'pt' ? 'Formato invalido.' : 'Invalid format.');
                    return;
                }
                const existing = JSON.parse(localStorage.getItem('shiftsim_scenarios') || '[]');
                const newScenarios = data.scenarios.map((s: Record<string, unknown>) => ({
                    ...s,
                    id: crypto.randomUUID(),
                }));
                localStorage.setItem('shiftsim_scenarios', JSON.stringify([...existing, ...newScenarios]));
                showToast('success', lang === 'pt' ? `${newScenarios.length} cenarios importados!` : `${newScenarios.length} scenarios imported!`);
                setTimeout(() => window.location.reload(), 1500);
            } catch {
                showToast('error', lang === 'pt' ? 'Erro ao importar.' : 'Import error.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleAddHoliday = () => {
        if (!newHolidayName.trim()) {
            showToast('error', lang === 'pt' ? 'Nome obrigatorio' : 'Name is required');
            return;
        }
        const holiday = addCustomHoliday({
            name: newHolidayName.trim(),
            month: newHolidayMonth,
            day: newHolidayDay,
            type: 'custom',
            isFixed: true,
        });
        setCustomHolidays(prev => [...prev, holiday]);
        setNewHolidayName('');
        showToast('success', lang === 'pt' ? 'Feriado adicionado' : 'Holiday added');
    };

    const handleRemoveHoliday = (id: string) => {
        removeCustomHoliday(id);
        setCustomHolidays(prev => prev.filter(h => h.id !== id));
        showToast('success', lang === 'pt' ? 'Feriado removido' : 'Holiday removed');
    };

    const handleClearAllData = () => {
        if (!window.confirm(lang === 'pt' ? 'Tem certeza? Isto ira apagar TODOS os dados.' : 'Are you sure? This will delete ALL data.')) return;
        localStorage.removeItem('shiftsim_scenarios');
        localStorage.removeItem('shiftsim_custom_holidays');
        localStorage.removeItem('shiftsim_theme');
        localStorage.removeItem('shiftsim_lang');
        localStorage.removeItem('shiftsim_preferences');
        showToast('success', lang === 'pt' ? 'Dados apagados! A pagina vai recarregar.' : 'Data cleared! Page will reload.');
        setTimeout(() => window.location.reload(), 1500);
    };

    const scenarioCount = useMemo(() => {
        try {
            const saved = localStorage.getItem('shiftsim_scenarios');
            return saved ? JSON.parse(saved).length : 0;
        } catch { return 0; }
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                    <SettingsIcon className="w-8 h-8 text-blue-400" />
                    {lang === 'pt' ? 'Configuracoes' : 'Settings'}
                </h1>
                <p className="text-gray-400">
                    {lang === 'pt'
                        ? 'Gerir tema, idioma, dados e preferencias da aplicacao.'
                        : 'Manage theme, language, data, and application preferences.'}
                </p>
            </div>

            <div className="space-y-6">
                {/* Theme */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                        {lang === 'pt' ? 'Tema' : 'Theme'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {lang === 'pt' ? 'Escolha entre tema claro e escuro.' : 'Choose between light and dark theme.'}
                    </p>
                    <button
                        onClick={toggleTheme}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-3"
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="w-5 h-5 text-yellow-400" />
                                {lang === 'pt' ? 'Mudar para Tema Claro' : 'Switch to Light Theme'}
                            </>
                        ) : (
                            <>
                                <Moon className="w-5 h-5 text-blue-400" />
                                {lang === 'pt' ? 'Mudar para Tema Escuro' : 'Switch to Dark Theme'}
                            </>
                        )}
                    </button>
                </div>

                {/* Language */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-400" />
                        {lang === 'pt' ? 'Idioma' : 'Language'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {lang === 'pt' ? 'Escolha o idioma da aplicacao.' : 'Choose the application language.'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setLang('pt')}
                            className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-3 ${
                                lang === 'pt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <Globe className="w-5 h-5" />
                            Portugues
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-3 ${
                                lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            <Globe className="w-5 h-5" />
                            English
                        </button>
                    </div>
                </div>

                {/* Backup & Restore */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-purple-400" />
                        {lang === 'pt' ? 'Backup e Restauracao' : 'Backup & Restore'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {lang === 'pt'
                            ? `Atualmente tem ${scenarioCount} cenario${scenarioCount !== 1 ? 's' : ''} guardado${scenarioCount !== 1 ? 's' : ''}.`
                            : `You currently have ${scenarioCount} saved scenario${scenarioCount !== 1 ? 's' : ''}.`}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleBackup}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            {lang === 'pt' ? 'Fazer Backup' : 'Download Backup'}
                        </button>
                        <label className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5" />
                            {lang === 'pt' ? 'Restaurar Backup' : 'Restore Backup'}
                            <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                        </label>
                        <label className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <FilePlus2 className="w-5 h-5" />
                            {lang === 'pt' ? 'Importar Cenarios' : 'Import Scenarios'}
                            <input type="file" accept=".json" onChange={handleBulkImport} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Custom Holidays */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-yellow-400" />
                        {lang === 'pt' ? 'Feriados Personalizados' : 'Custom Holidays'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {lang === 'pt'
                            ? 'Adicione feriados da sua empresa ou regiao local.'
                            : 'Add your company or regional holidays.'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <input
                            type="text"
                            value={newHolidayName}
                            onChange={e => setNewHolidayName(e.target.value)}
                            placeholder={lang === 'pt' ? 'Nome do feriado' : 'Holiday name'}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <select
                            value={newHolidayMonth}
                            onChange={e => setNewHolidayMonth(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {monthNames.map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={newHolidayDay}
                            onChange={e => setNewHolidayDay(Number(e.target.value))}
                            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 w-24"
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddHoliday}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {lang === 'pt' ? 'Adicionar' : 'Add'}
                        </button>
                    </div>

                    {customHolidays.length > 0 ? (
                        <div className="space-y-2">
                            {customHolidays.map(h => (
                                <div key={h.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{h.name}</p>
                                        <p className="text-xs text-gray-400">{h.day} de {monthNames[h.month]}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveHoliday(h.id)}
                                        className="text-gray-400 hover:text-red-400 transition-colors p-2"
                                        aria-label={lang === 'pt' ? 'Remover' : 'Remove'}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            {lang === 'pt' ? 'Nenhum feriado personalizado.' : 'No custom holidays.'}
                        </p>
                    )}
                </div>

                {/* App Info */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        {lang === 'pt' ? 'Sobre a Aplicacao' : 'About'}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-400">
                        <p><strong className="text-gray-300">ShiftSim Factory</strong> v1.0.0</p>
                        <p>{lang === 'pt' ? 'Simulador de escalas industriais para o mercado portugues.' : 'Industrial shift schedule simulator for the Portuguese market.'}</p>
                        <p>{lang === 'pt' ? 'Licenca: MIT' : 'License: MIT'}</p>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-gray-800 rounded-lg border border-red-500/30 p-6">
                    <h3 className="text-red-400 font-semibold text-lg mb-4">
                        {lang === 'pt' ? 'Zona de Perigo' : 'Danger Zone'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {lang === 'pt'
                            ? 'Apagar todos os dados da aplicacao (cenarios, feriados personalizados, preferencias).'
                            : 'Delete all application data (scenarios, custom holidays, preferences).'}
                    </p>
                    <button
                        onClick={handleClearAllData}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        {lang === 'pt' ? 'Apagar Todos os Dados' : 'Clear All Data'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
