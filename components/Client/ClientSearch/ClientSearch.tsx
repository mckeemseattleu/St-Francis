'use client';

import { ClientList, ClientSearchForm } from '@/components/Client/index';
import type { DocFilter } from '@/utils/index';
import { useGetClientsSearch } from './hooks';
import { VisitWithClientId } from '@/types/index';
import { useState, useEffect } from 'react';

export default function ClientsSearch() {
    const { mutateAsync, isLoading, clients, visits, setClients } = useGetClientsSearch();
    const [visitsWithClientId, setVisitsWithClientId] = useState<VisitWithClientId[]>([]);

    useEffect(() => {
        // Transform visits to include clientId
        const transformedVisits = visits.flatMap(visit => 
            clients.filter(client => client.id === visit.id).map(client => ({
                ...visit,
                clientId: client.id
            }))
        );
        setVisitsWithClientId(transformedVisits);
    }, [visits, clients]);

    const handleSubmit = (formFields: DocFilter) => {
        mutateAsync(formFields);
    };

    const handleClear = () => {
        setClients([]);
        setVisitsWithClientId([]);
    };

    return (
        <>
            <ClientSearchForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onClear={handleClear}
            />
            <ClientList
                clients={clients}
                visits={visitsWithClientId}
                noDataMessage="No Matching Clients"
                isLoading={isLoading}
            />
        </>
    );
}