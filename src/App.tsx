import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import { LayoutDashboard, Calendar, FileText, Users, BarChart3, Settings, GitCompareArrows, Euro, BookOpen, HelpCircle, UserCircle, Loader2 } from 'lucide-react';

import { Analytics } from '@vercel/analytics/react';

const Dashboard = lazy(() => import('./components/Dashboard'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const Comparison = lazy(() => import('./pages/Comparison'));
const CostCalculator = lazy(() => import('./pages/CostCalculator'));
const ScheduleTemplates = lazy(() => import('./pages/ScheduleTemplates'));
const HolidayCalendar = lazy(() => import('./pages/HolidayCalendar'));
const TeamRoster = lazy(() => import('./pages/TeamRoster'));
const Reports = lazy(() => import('./pages/Reports'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const EmployeeSchedule = lazy(() => import('./pages/EmployeeSchedule'));

function PageLoader() {
    return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
    );
}

const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/analytics', icon: BarChart3, label: 'Analitica' },
    { to: '/compare', icon: GitCompareArrows, label: 'Comparar' },
    { to: '/costs', icon: Euro, label: 'Custos' },
    { to: '/templates', icon: BookOpen, label: 'Modelos' },
    { to: '/calendar', icon: Calendar, label: 'Feriados' },
    { to: '/roster', icon: Users, label: 'Equipas' },
    { to: '/employee', icon: UserCircle, label: 'Colaborador' },
    { to: '/reports', icon: FileText, label: 'Relatorios' },
    { to: '/settings', icon: Settings, label: 'Config' },
    { to: '/help', icon: HelpCircle, label: 'Ajuda' },
];

function Navigation() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30" role="navigation" aria-label="Main navigation">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide" role="menubar">
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`
                            }
                            role="menuitem"
                        >
                            <item.icon className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}

function MobileBottomNav() {
    const location = useLocation();
    const mobileItems = [
        { to: '/', icon: LayoutDashboard, label: 'Home' },
        { to: '/analytics', icon: BarChart3, label: 'Analitica' },
        { to: '/compare', icon: GitCompareArrows, label: 'Comparar' },
        { to: '/costs', icon: Euro, label: 'Custos' },
        { to: '/templates', icon: BookOpen, label: 'Modelos' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40 safe-area-bottom" role="navigation" aria-label="Mobile navigation">
            <div className="flex items-center justify-around py-2">
                {mobileItems.map(item => {
                    const isActive = item.to === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.to);
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors min-w-[48px] ${
                                isActive ? 'text-blue-400' : 'text-gray-500'
                            }`}
                        >
                            <item.icon className="w-5 h-5" aria-hidden="true" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </NavLink>
                    );
                })}
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
                                <Suspense fallback={<PageLoader />}>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/analytics" element={<AnalyticsDashboard />} />
                                        <Route path="/compare" element={<Comparison />} />
                                        <Route path="/costs" element={<CostCalculator />} />
                                        <Route path="/templates" element={<ScheduleTemplates />} />
                                        <Route path="/calendar" element={<HolidayCalendar />} />
                                        <Route path="/roster" element={<TeamRoster />} />
                                        <Route path="/employee" element={<EmployeeSchedule />} />
                                        <Route path="/reports" element={<Reports />} />
                                        <Route path="/settings" element={<SettingsPage />} />
                                        <Route path="/help" element={<HelpPage />} />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </Suspense>
                                <MobileBottomNav />
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
