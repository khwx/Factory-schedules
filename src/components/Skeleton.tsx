import React from 'react';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`animate-pulse bg-gray-700 rounded ${className}`}
                    aria-hidden="true"
                />
            ))}
        </>
    );
};

export const ScenarioCardSkeleton: React.FC = () => {
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="p-4 space-y-4">
                <Skeleton className="h-4 w-full" />
                <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                </div>
            </div>
        </div>
    );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
    rows = 5, 
    cols = 4 
}) => {
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="h-8 flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-2">
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton key={j} className="h-12 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const ChartSkeleton: React.FC = () => {
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
};
