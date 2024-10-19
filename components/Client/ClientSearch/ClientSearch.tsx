'use client';

import { ClientList, ClientSearchForm } from '@/components/Client/index';
import type { DocFilter } from '@/utils/index';
import { useGetClientsSearch } from './hooks';

export default function ClientsSearch() {
    const { mutateAsync, isLoading, clients, visits, setClients } =
        useGetClientsSearch();

    const handleSubmit = (formFields: DocFilter) => {
        mutateAsync(formFields);
    };

    const handleClear = () => {
        setClients([]);
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
                visits={visits}
                noDataMessage="No Matching Clients"
                isLoading={isLoading}
            />
        </>
    );
}
