import { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Skeleton } from './Skeleton';

interface LazyErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface LazyErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class LazyErrorBoundary extends Component<LazyErrorBoundaryProps, LazyErrorBoundaryState> {
    public state: LazyErrorBoundaryState = { hasError: false, error: null };

    public static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Lazy component error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="bg-gray-800 border border-red-700/50 rounded-lg p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-300 text-sm mb-3">
                        Erro ao carregar componente.
                    </p>
                    {this.state.error && (
                        <p className="text-red-400 text-xs font-mono mb-3 break-all">
                            {this.state.error.message}
                        </p>
                    )}
                    <button
                        onClick={this.handleRetry}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded transition-colors inline-flex items-center gap-2"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Recarregar
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export function LazyLoad({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <LazyErrorBoundary>
            <Suspense fallback={<Skeleton className={className || 'h-48'} />}>
                {children}
            </Suspense>
        </LazyErrorBoundary>
    );
}

export default LazyErrorBoundary;
