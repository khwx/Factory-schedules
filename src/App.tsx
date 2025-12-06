import Layout from './Layout';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';

import { Analytics } from '@vercel/analytics/react';

function App() {
    return (
        <ThemeProvider>
            <Layout>
                <Dashboard />
                <Analytics />
            </Layout>
        </ThemeProvider>
    );
}

export default App;
