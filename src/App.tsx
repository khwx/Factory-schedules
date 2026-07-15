import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './components/Dashboard';
import HolidayCalendar from './pages/HolidayCalendar';
import Reports from './pages/Reports';
import TeamRoster from './pages/TeamRoster';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SettingsPage from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import { LayoutDashboard, Calendar, FileText, Users, BarChart3, Settings } from 'lucide-react';

import { Analytics } from '@vercel/analytics/react';

function Navigation() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analitica
                    </NavLink>
                    <NavLink
                        to="/calendar"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                    >
                        <Calendar className="w-4 h-4" />
                        Feriados
                    </NavLink>
                    <NavLink
                        to="/roster"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                    >
                        <Users className="w-4 h-4" />
                        Equipas
                    </NavLink>
                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                    >
                        <FileText className="w-4 h-4" />
                        Relatorios
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                    >
                        <Settings className="w-4 h-4" />
                        Configuracoes
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <I18nProvider>
                <ThemeProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <Layout>
                                <Navigation />
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                                    <Route path="/calendar" element={<HolidayCalendar />} />
                                    <Route path="/roster" element={<TeamRoster />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                                <Analytics />
                            </Layout>
                        </BrowserRouter>
                    </ToastProvider>
                </ThemeProvider>
            </I18nProvider>
        </ErrorBoundary>
    );
}

export default App;
