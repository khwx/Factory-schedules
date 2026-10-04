import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Users, BarChart3, Settings, GitCompareArrows, Euro, BookOpen, HelpCircle, UserCircle, Brain, Building2 } from 'lucide-react';
import { useI18n } from '../i18n';

export default function Navigation() {
    const { t } = useI18n();
    const NAV_ITEMS = [
        { to: '/', icon: LayoutDashboard, label: t.navigation.dashboard, end: true },
        { to: '/analytics', icon: BarChart3, label: t.navigation.analytics },
        { to: '/compare', icon: GitCompareArrows, label: t.navigation.compare },
        { to: '/costs', icon: Euro, label: t.navigation.costs },
        { to: '/optimizer', icon: Brain, label: t.navigation.optimizer },
        { to: '/workforce', icon: Building2, label: t.navigation.workforce },
        { to: '/templates', icon: BookOpen, label: t.navigation.templates },
        { to: '/calendar', icon: Calendar, label: t.navigation.calendar },
        { to: '/roster', icon: Users, label: t.navigation.roster },
        { to: '/employee', icon: UserCircle, label: t.navigation.employee },
        { to: '/reports', icon: FileText, label: t.navigation.reports },
        { to: '/settings', icon: Settings, label: t.navigation.settings },
        { to: '/help', icon: HelpCircle, label: t.navigation.help },
    ];
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
