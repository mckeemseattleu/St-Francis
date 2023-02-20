'use client';
import { ClientList, ClientSearchForm } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import { fetchData } from '@/utils/fetchData';
import type { DocFilter } from '@/utils/fetchData';

import type { Client } from 'models';
import { useState } from 'react';

export default function ClientsSearch() {
    const [clients, setClients] = useState<Array<Client>>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (fields: DocFilter) => {
        setLoading(true);
        const data = await fetchData<Client>(fields);
        setClients(data);
        setLoading(false);
    };

    return (
        <>
            <ClientSearchForm onSubmit={handleSearch} />
            {loading ? (
                <Spinner />
            ) : (
                <ClientList
                    clients={clients}
                    noDataMessage="No Matching Clients"
                />
            )}
        </>
    );
}
