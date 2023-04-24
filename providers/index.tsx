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
            <SettingsProvider>
                <QueryClientProvider client={queryClient}>
                    <AlertProvider>{children}</AlertProvider>
                </QueryClientProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
