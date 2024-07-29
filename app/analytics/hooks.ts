import { Client } from '@/models/index';
import { CLIENTS_PATH } from '@/utils/constants';
import { DocFilter } from '@/utils/fetchData';
import { listClients } from '@/utils/queries';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export const useGetDashboardData = () => {
    const [fields, setFields] = useState<DocFilter>();

    const { data, isLoading, refetch, error } = useQuery({
        queryKey: [CLIENTS_PATH, 'report'],
        queryFn: async () => {
            let clients: Array<Client> = [];
            clients = await listClients(fields, 9999); //TODO: remove hardcoded limit
            return { clients, fields };
        },
        enabled: false,
    });

    useEffect(() => {
        if (fields) refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    return { data, isLoading, refetch, error, setFields };
};
