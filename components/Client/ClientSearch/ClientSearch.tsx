'use client';
import { ClientList, ClientSearchForm } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import type { DocFilter } from '@/utils/index';

import { listClients } from '@/utils/queries';
import type { Client } from 'models';
import { useState } from 'react';
import { useQuery } from 'react-query';

export default function ClientsSearch() {
    const [fields, setFields] = useState<DocFilter>({});

    const { data, isLoading, refetch } = useQuery(
        'clients',
        () => listClients(fields),
        { enabled: false }
    );
    const handleSearch = async (fields: DocFilter) => {
        setFields(fields);
        await refetch();
    };

    if (isLoading) return <Spinner />;

    return (
        <>
            <ClientSearchForm onSubmit={handleSearch} />
            <ClientList
                clients={data || ([] as Array<Client>)}
                noDataMessage="No Matching Clients"
            />
        </>
    );
}
