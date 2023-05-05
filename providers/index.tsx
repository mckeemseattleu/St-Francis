import { QueryClient, QueryClientProvider } from 'react-query';
import AlertProvider from './AlertProvider';
import AuthProvider from './AuthProvider';
import SettingsProvider from './SettingsProvider';

interface ProvidersProps {
    children: React.ReactNode;
}

export const queryClient = new QueryClient();

export default function Providers(props: ProvidersProps) {
    const { children } = props;
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <AlertProvider>
                    <SettingsProvider>{children}</SettingsProvider>
                </AlertProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}
