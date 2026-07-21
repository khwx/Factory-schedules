import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import MobileBottomNav from './components/MobileBottomNav';
import { Loader2 } from 'lucide-react';

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
const ScheduleOptimizer = lazy(() => import('./pages/ScheduleOptimizer'));
const WorkforcePlanning = lazy(() => import('./pages/WorkforcePlanning'));

function PageLoader() {
    return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
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
                                        <Route path="/optimizer" element={<ScheduleOptimizer />} />
                                        <Route path="/workforce" element={<WorkforcePlanning />} />
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
