import React, { useState, useEffect } from 'react';
import { Sun, Moon, Settings, Download, Upload, FilePlus2, WifiOff } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useToast } from './contexts/ToastContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { theme, toggleTheme } = useTheme();
    const { showToast } = useToast();

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

                showToast('success', 'Backup restaurado com sucesso! A pagina vai recarregar.');
                setTimeout(() => window.location.reload(), 1500);
            } catch (_error) {
                showToast('error', 'Erro ao restaurar backup. Ficheiro invalido.');
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
                    showToast('error', 'Formato invalido. O ficheiro deve conter um array "scenarios".');
                    return;
                }

                const existing = JSON.parse(localStorage.getItem('shiftsim_scenarios') || '[]');
                const newScenarios = data.scenarios.map((s: { name: string; teams: number; shiftDuration: number; pattern: string; }) => ({
                    ...s,
                    id: crypto.randomUUID(),
                }));

                const combined = [...existing, ...newScenarios];
                localStorage.setItem('shiftsim_scenarios', JSON.stringify(combined));

                showToast('success', `${newScenarios.length} cenarios importados! A pagina vai recarregar.`);
                setTimeout(() => window.location.reload(), 1500);
            } catch (_error) {
                showToast('error', 'Erro ao importar cenarios. Ficheiro invalido.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Skip to main content link */}
            <a href="#main-content" className="sr-only focus:not-sr-only absolute top-0 left-0 p-2 bg-white bg-opacity-90 text-black z-50">
                Pular para conteúdo principal
            </a>

            <header className="bg-gray-800 border-b border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                {/* Logo and Title */}
                                <span className="text-xl font-semibold">ShiftSim Factory</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Offline indicator */}
                                {!isOnline && (
                                    <span className="flex items-center gap-1 text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded" role="status" aria-live="polite">
                                        <WifiOff className="w-3 h-3" />
                                        Offline
                                    </span>
                                )}
                                {/* Backup Button */}
                                <button
                                    onClick={handleBackup}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Fazer Backup"
                                    aria-label="Fazer backup das configurações"
                                >
                                    <Download className="w-5 h-5 text-gray-400" />
                                </button>

                                {/* Restore Button */}
                                <label className="relative inline-flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title="Restaurar Backup">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleRestore}
                                        className="hidden"
                                        id="file-restore-input"
                                        aria-label="Selecionar arquivo de backup para restaurar"
                                    />
                                </label>

                                {/* Settings Button */}
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Configurações"
                                    aria-label="Abrir painel de configurações"
                                >
                                    <Settings className="w-5 h-5 text-gray-400" />
                                </button>

                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                                    aria-label={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
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

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                    <div className="container mx-auto">
                        <h3 className="text-lg font-semibold mb-4">Configurações</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm">Backup & Restore</h4>
                                <p className="text-xs text-gray-400 mb-3">
                                    Guarde ou restaure todos os seus cenários e configurações.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleBackup}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
                                    >
                                        <Download className="w-4 h-4 inline mr-2" />
                                        Fazer Backup
                                    </button>
                                    <label className="relative inline-flex items-center flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors cursor-pointer">
                                        <Upload className="w-4 h-4 inline mr-2" />
                                        Restaurar
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
                                        Importar Multiplos Cenarios (JSON)
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
                                <h4 className="font-semibold mb-2 text-sm">Tema</h4>
                                <p className="text-xs text-gray-400 mb-3">
                                    Escolha entre tema claro ou escuro.
                                </p>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-sm transition-colors"
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Sun className="w-4 h-4 inline mr-2" />
                                            Mudar para Tema Claro
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="w-4 h-4 inline mr-2" />
                                            Mudar para Tema Escuro
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main id="main-content" className="container mx-auto py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
