import React, { useState } from 'react';
import { Sun, Moon, Settings, Download, Upload } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const [showSettings, setShowSettings] = useState(false);

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

                alert('Backup restaurado com sucesso! A página vai recarregar.');
                window.location.reload();
            } catch (error) {
                alert('Erro ao restaurar backup. Ficheiro inválido.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            ShiftSim Factory
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Backup Button */}
                        <button
                            onClick={handleBackup}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Fazer Backup"
                        >
                            <Download className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Restore Button */}
                        <label className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title="Restaurar Backup">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleRestore}
                                className="hidden"
                            />
                        </label>

                        {/* Settings Button */}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Configurações"
                        >
                            <Settings className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-blue-400" />
                            )}
                        </button>
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
                                    <label className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors cursor-pointer text-center">
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

            <main className="container mx-auto py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
