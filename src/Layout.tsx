import React, { useState, useEffect } from 'react';
import { Sun, Moon, Settings, Download, Upload, FilePlus2, WifiOff, Globe } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useToast } from './contexts/ToastContext';
import { useI18n } from './i18n';
import { useTutorial, TutorialOverlay, HelpButton } from './components/Tutorial';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();
    const { t, lang, setLang } = useI18n();
    const tutorial = useTutorial();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

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

                showToast('success', lang === 'pt' ? 'Backup restaurado com sucesso! A pagina vai recarregar.' : 'Backup restored successfully! Page will reload.');
                setTimeout(() => window.location.reload(), 1500);
            } catch (_error) {
                showToast('error', lang === 'pt' ? 'Erro ao restaurar backup. Ficheiro invalido.' : 'Error restoring backup. Invalid file.');
            }
        };
        reader.readAsText(file);
    };

    const handleBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);

                if (!data.scenarios || !Array.isArray(data.scenarios)) {
                    showToast('error', lang === 'pt' ? 'Formato invalido. O ficheiro deve conter um array "scenarios".' : 'Invalid format. File must contain a "scenarios" array.');
                    return;
                }

                const existing = JSON.parse(localStorage.getItem('shiftsim_scenarios') || '[]');
                const newScenarios = data.scenarios.map((s: { name: string; teams: number; shiftDuration: number; pattern: string; }) => ({
                    ...s,
                    id: crypto.randomUUID(),
                }));

                const combined = [...existing, ...newScenarios];
                localStorage.setItem('shiftsim_scenarios', JSON.stringify(combined));

                showToast('success', lang === 'pt' ? `${newScenarios.length} cenarios importados! A pagina vai recarregar.` : `${newScenarios.length} scenarios imported! Page will reload.`);
                setTimeout(() => window.location.reload(), 1500);
            } catch (_error) {
                showToast('error', lang === 'pt' ? 'Erro ao importar cenarios. Ficheiro invalido.' : 'Error importing scenarios. Invalid file.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <a href="#main-content" className="sr-only focus:not-sr-only absolute top-0 left-0 p-2 bg-white bg-opacity-90 text-black z-50">
                {lang === 'pt' ? 'Pular para conteudo principal' : 'Skip to main content'}
            </a>

            <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-semibold">{t.header.title}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {!isOnline && (
                                    <span className="flex items-center gap-1 text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded" role="status" aria-live="polite">
                                        <WifiOff className="w-3 h-3" />
                                        {t.header.offline}
                                    </span>
                                )}
                                <button
                                    onClick={handleBackup}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title={t.header.backup}
                                    aria-label={t.header.backup}
                                >
                                    <Download className="w-5 h-5 text-gray-400" />
                                </button>

                                <label className="relative inline-flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title={t.header.restore}>
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleRestore}
                                        className="hidden"
                                        id="file-restore-input"
                                        aria-label={t.header.restore}
                                    />
                                </label>

                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title={t.header.settings}
                                    aria-label={t.header.settings}
                                >
                                    <Settings className="w-5 h-5 text-gray-400" />
                                </button>

                                <HelpButton onClick={tutorial.start} />

                                <button
                                    onClick={toggleTheme}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title={theme === 'dark' ? t.header.lightTheme : t.header.darkTheme}
                                    aria-label={theme === 'dark' ? t.header.lightTheme : t.header.darkTheme}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="w-5 h-5 text-yellow-400" />
                                    ) : (
                                        <Moon className="w-5 h-5 text-blue-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {showSettings && (
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                    <div className="container mx-auto">
                        <h3 className="text-lg font-semibold mb-4">{t.header.settings}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm">Backup & Restore</h4>
                                <p className="text-xs text-gray-400 mb-3">
                                    {t.header.backup} & {t.header.restore}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleBackup}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
                                    >
                                        <Download className="w-4 h-4 inline mr-2" />
                                        {t.header.backup}
                                    </button>
                                    <label className="relative inline-flex items-center flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors cursor-pointer">
                                        <Upload className="w-4 h-4 inline mr-2" />
                                        {t.header.restore}
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleRestore}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <label className="relative inline-flex items-center w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors cursor-pointer">
                                        <FilePlus2 className="w-4 h-4 inline mr-2" />
                                        {t.header.bulkImport}
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleBulkImport}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm">{t.header.theme}</h4>
                                <p className="text-xs text-gray-400 mb-3">
                                    {t.header.theme}
                                </p>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-sm transition-colors"
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun className="w-4 h-4 inline mr-2" />
                                            {t.header.lightTheme}
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-4 h-4 inline mr-2" />
                                            {t.header.darkTheme}
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm">{lang === 'pt' ? 'Idioma' : 'Language'}</h4>
                                <p className="text-xs text-gray-400 mb-3">
                                    {lang === 'pt' ? 'Escolha o idioma da aplicacao.' : 'Choose the application language.'}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setLang('pt')}
                                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 ${lang === 'pt' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                                    >
                                        <Globe className="w-4 h-4" />
                                        Portugues
                                    </button>
                                    <button
                                        onClick={() => setLang('en')}
                                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                                    >
                                        <Globe className="w-4 h-4" />
                                        English
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main id="main-content" className="container mx-auto py-8">
                {children}
            </main>

            <TutorialOverlay
                isActive={tutorial.isActive}
                currentStep={tutorial.currentStep}
                onNext={tutorial.next}
                onPrev={tutorial.prev}
                onClose={tutorial.close}
                totalSteps={tutorial.totalSteps}
            />
        </div>
    );
};

export default Layout;
