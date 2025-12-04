import Layout from './Layout';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Layout>
                <Dashboard />
            </Layout>
        </ThemeProvider>
    );
}

export default App;
