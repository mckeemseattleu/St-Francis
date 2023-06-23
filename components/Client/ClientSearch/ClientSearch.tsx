'use client';
import { ClientList, ClientSearchForm } from '@/components/Client/index';
import type { DocFilter } from '@/utils/index';
import { CLIENTS_PATH, listClients } from '@/utils/index';
import type { Client } from 'models';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useAlert } from '@/hooks/index';
import { FilterObject } from '@/utils/fetchData';
export default function ClientsSearch() {
    const [fields, setFields] = useState<DocFilter>();
    const queryClient = useQueryClient();
    const [, setAlert] = useAlert();
    const { data, isLoading, refetch } = useQuery({
        queryKey: [CLIENTS_PATH, 'searched'],
        queryFn: async () => {
            let clients: Array<Client> = [];
            const filter = { ...fields };
            if (filter?.filterByBirthday && !filter.birthday) {
                setAlert({
                    message: 'invalid date of birth',
                    type: 'error',
                });
                return { clients, fields };
            }
            if (filter?.filterByBirthday && filter?.birthday) {
                filter.birthday = new Date(filter.birthday as string);
                delete filter.filterByBirthday;
            }
            if (!Object.keys(filter).length)
                filter.updatedAt = {
                    opStr: '>=',
                    value: new Date(new Date().toDateString()),
                } as FilterObject;

            clients = await listClients(filter);
            return { clients, fields };
        },
        enabled: false,
    });

    const handleClear = () =>
        queryClient.resetQueries([CLIENTS_PATH, 'searched']);

    useEffect(() => {
        if (fields) refetch();
        // TODO: remove useEffect approach
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
