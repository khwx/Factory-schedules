import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Users, BarChart3, Settings, GitCompareArrows, Euro, BookOpen, HelpCircle, UserCircle, Brain, Building2 } from 'lucide-react';

const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/analytics', icon: BarChart3, label: 'Analitica' },
    { to: '/compare', icon: GitCompareArrows, label: 'Comparar' },
    { to: '/costs', icon: Euro, label: 'Custos' },
    { to: '/optimizer', icon: Brain, label: 'Otimizar' },
    { to: '/workforce', icon: Building2, label: 'Efetivo' },
    { to: '/templates', icon: BookOpen, label: 'Modelos' },
    { to: '/calendar', icon: Calendar, label: 'Feriados' },
    { to: '/roster', icon: Users, label: 'Equipas' },
    { to: '/employee', icon: UserCircle, label: 'Colaborador' },
    { to: '/reports', icon: FileText, label: 'Relatorios' },
    { to: '/settings', icon: Settings, label: 'Config' },
    { to: '/help', icon: HelpCircle, label: 'Ajuda' },
];

export default function Navigation() {
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
