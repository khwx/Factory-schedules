import Layout from './Layout';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

import { Analytics } from '@vercel/analytics/react';

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <ToastProvider>
                    <Layout>
                        <Dashboard />
                        <Analytics />
                    </Layout>
                </ToastProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
