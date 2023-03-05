'use client';
import { ClientList, ClientSearchForm } from '@/components/Client/index';
import type { DocFilter } from '@/utils/index';
import { CLIENTS_PATH, listClients } from '@/utils/queries';
import type { Client } from 'models';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

export default function ClientsSearch() {
    const [fields, setFields] = useState<DocFilter>();
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: [CLIENTS_PATH, 'searched'],
        queryFn: async () => {
            const clients = await listClients(fields);
            return { clients, fields };
        },
        enabled: false,
    });

    const handleClear = () =>
        queryClient.resetQueries([CLIENTS_PATH, 'searched']);

    useEffect(() => {
        if (fields) refetch();
    }, [fields]);

    return (
        <>
            <ClientSearchForm
                onSubmit={setFields}
                onClear={handleClear}
                initialFields={data?.fields}
            />
            <ClientList
                clients={(data?.clients as Client[]) || []}
                noDataMessage="No Matching Clients"
                isLoading={isLoading}
            />
        </>
    );
}
