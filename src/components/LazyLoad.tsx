import React, { Suspense, LazyExoticComponent, ComponentType } from 'react';

interface LazyLoadProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({ 
    children, 
    fallback = <div className="animate-pulse bg-gray-700 rounded h-64" /> 
}) => {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    );
};

export function lazyLoad<P extends object>(
    factory: () => Promise<{ default: ComponentType<P> }>
): LazyExoticComponent<ComponentType<P>> {
    return React.lazy(factory);
}

export default LazyLoad;
