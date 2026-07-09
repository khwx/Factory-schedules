import React, { Suspense, LazyExoticComponent, ComponentType } from 'react';
import { Skeleton } from '../components/Skeleton';

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
    factory: () => Promise<{ default: ComponentType<P> }>,
    FallbackComponent?: React.ComponentType
): LazyExoticComponent<ComponentType<P>> {
    return React.lazy(factory);
}

export default LazyLoad;
