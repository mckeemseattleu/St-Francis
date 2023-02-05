import { QueryClient, QueryClientProvider } from 'react-query';
import AuthProvider from './AuthProvider';
import SettingsProvider from './SettingsProvider';

interface ProvidersProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function Providers(props: ProvidersProps) {
    const { children } = props;
    return (
        <AuthProvider>
            <SettingsProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
