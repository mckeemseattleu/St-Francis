'use client';

import ReportDashboard from '@/components/Report/ReportDashboard';
import ReportForm from '@/components/Report/ReportForm';
import Spinner from '@/components/Spinner/Spinner';
import { useGetDashboardData } from './hooks';

export default function AnalyticsPage() {
    const { data, error, isLoading, setFields } = useGetDashboardData();

    const renderContent = () => {
        if (isLoading) return <Spinner />;

        if (data && data.clients) {
            return <ReportDashboard clients={data.clients} />;
        }

        if (error) {
            return (
                <p>
                    Failed to load clients data. Please try again later or
                    contact Administrator if error persist.
                </p>
            );
        }
    };

    return (
        <>
            <h1>Analytics</h1>
            <ReportForm onSubmit={setFields} />
            {renderContent()}
        </>
    );
}
