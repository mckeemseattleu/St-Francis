'use client';
import ReportDashboard from '@/components/Report/ReportDashboard';
import ReportForm from '@/components/Report/ReportForm';
import Spinner from '@/components/Spinner/Spinner';
import { Client } from '@/models/index';
import { CLIENTS_PATH } from '@/utils/constants';
import { DocFilter } from '@/utils/fetchData';
import { listClients } from '@/utils/queries';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export default function AnalyticsPage() {
    const [fields, setFields] = useState<DocFilter>();
    const { data, isLoading, refetch } = useQuery({
        queryKey: [CLIENTS_PATH, 'report'],
        queryFn: async () => {
            let clients: Array<Client> = [];
            clients = await listClients(fields);
            return { clients, fields };
        },
        enabled: false,
    });

    useEffect(() => {
        if (fields) refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    return (
        <>
            <h1>Analytics</h1>
            <ReportForm onSubmit={setFields} />
            {isLoading ? (
                <Spinner />
            ) : data?.clients ? (
                <ReportDashboard clients={data.clients} />
            ) : (
                'No matching data within date range'
            )}
        </>
    );
}
