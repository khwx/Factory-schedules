import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, GitCompareArrows, Euro, BookOpen } from 'lucide-react';
import { useI18n } from '../i18n';

export default function MobileBottomNav() {
    const location = useLocation();
    const { t } = useI18n();

    const mobileItems = [
        { to: '/', icon: LayoutDashboard, label: t.mobileNav.home },
        { to: '/analytics', icon: BarChart3, label: t.mobileNav.analytics },
        { to: '/compare', icon: GitCompareArrows, label: t.mobileNav.compare },
        { to: '/costs', icon: Euro, label: t.mobileNav.costs },
        { to: '/templates', icon: BookOpen, label: t.mobileNav.templates },
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
