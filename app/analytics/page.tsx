'use client';
import ReportDashboard from '@/components/Report/ReportDashboard';
import ReportForm from '@/components/Report/ReportForm';
import Spinner from '@/components/Spinner/Spinner';
import { useAlert, useSettings } from '@/hooks/index';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Client } from '@/models/index';
import { CLIENTS_PATH } from '@/utils/constants';
import { DocFilter } from '@/utils/fetchData';
import { toDateString } from '@/utils/formatDate';
import { listClients } from '@/utils/queries';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const DEFAULT_DAILY_QUERY_LIMIT = 50000;
const MAX_QUERY_LIMIT = 10000;
const CLEAR_DATE_RANGE = 7;

export default function AnalyticsPage() {
    const [fields, setFields] = useState<DocFilter>();
    const { settings } = useSettings();
    const [_, setAlert] = useAlert();
    const [queryCount, setQueryCount] = useLocalStorage(
        toDateString(new Date()),
        settings?.reportingQueryLimit || DEFAULT_DAILY_QUERY_LIMIT
    );

    const { data, isLoading, refetch } = useQuery({
        queryKey: [CLIENTS_PATH, 'report'],
        queryFn: async () => {
            let clients: Array<Client> = [];
            if (queryCount === -1) {
                setAlert({
                    type: 'error',
                    message: "You've reached your daily query limit!",
                });
            } else {
                clients = await listClients(fields, MAX_QUERY_LIMIT);
                const newQueryCount =
                    (queryCount || DEFAULT_DAILY_QUERY_LIMIT) - clients.length;
                if (clients.length === MAX_QUERY_LIMIT) {
                    setAlert({
                        type: 'error',
                        message:
                            `Your query returned maximum of ${MAX_QUERY_LIMIT} clients. ` +
                            'This number might not be accurate! ' +
                            'Try narrowing your search date range.',
                    });
                }
                setQueryCount(newQueryCount < 0 ? -1 : newQueryCount);
            }
            return { clients, fields };
        },
        enabled: false,
    });

    useEffect(() => {
        if (fields) refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    useEffect(() => {
        if (
            settings?.reportingQueryLimit &&
            queryCount === DEFAULT_DAILY_QUERY_LIMIT
        ) {
            setQueryCount(settings.reportingQueryLimit);
        }
    }, [settings?.reportingQueryLimit]);

    useEffect(() => {
        for (let i = 1; i <= CLEAR_DATE_RANGE; i++) {
            const previousDate = new Date();
            previousDate.setDate(previousDate.getDate() - i);
            localStorage.removeItem(toDateString(previousDate));
        }
    }, []);

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
