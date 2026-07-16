import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './components/Dashboard';
import HolidayCalendar from './pages/HolidayCalendar';
import Reports from './pages/Reports';
import TeamRoster from './pages/TeamRoster';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SettingsPage from './pages/Settings';
import Comparison from './pages/Comparison';
import CostCalculator from './pages/CostCalculator';
import ScheduleTemplates from './pages/ScheduleTemplates';
import HelpPage from './pages/HelpPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import { LayoutDashboard, Calendar, FileText, Users, BarChart3, Settings, GitCompareArrows, Euro, BookOpen, HelpCircle } from 'lucide-react';

import { Analytics } from '@vercel/analytics/react';

function Navigation() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30" role="navigation" aria-label="Main navigation">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide" role="menubar">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <BarChart3 className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Analitica</span>
                    </NavLink>
                    <NavLink
                        to="/compare"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <GitCompareArrows className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Comparar</span>
                    </NavLink>
                    <NavLink
                        to="/costs"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <Euro className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Custos</span>
                    </NavLink>
                    <NavLink
                        to="/templates"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <BookOpen className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Modelos</span>
                    </NavLink>
                    <NavLink
                        to="/calendar"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Feriados</span>
                    </NavLink>
                    <NavLink
                        to="/roster"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <Users className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Equipas</span>
                    </NavLink>
                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <FileText className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Relatorios</span>
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <Settings className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Config</span>
                    </NavLink>
                    <NavLink
                        to="/help"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`
                        }
                        role="menuitem"
                    >
                        <HelpCircle className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Ajuda</span>
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
                                    <Route path="/compare" element={<Comparison />} />
                                    <Route path="/costs" element={<CostCalculator />} />
                                    <Route path="/templates" element={<ScheduleTemplates />} />
                                    <Route path="/calendar" element={<HolidayCalendar />} />
                                    <Route path="/roster" element={<TeamRoster />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="/help" element={<HelpPage />} />
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
