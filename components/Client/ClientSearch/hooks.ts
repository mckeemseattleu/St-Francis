import { useMutation } from 'react-query';
import { useState } from 'react';
import { Client, Visit } from 'models';
import { DocFilter, listClients } from '@/utils/index';

export const useGetClientsSearch = () => {
    const [clients, setClients] = useState<(Client & { isDuplicate?: boolean })[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async (fields: DocFilter) => {
            const filter = { ...fields };

            const fetchedClients = await listClients(filter);

            // Identify duplicates
            const duplicateClients = fetchedClients.filter((client, index, self) =>
                index !== self.findIndex((t) => 
                    t.firstName?.toLowerCase() === client.firstName?.toLowerCase() && 
                    t.lastName?.toLowerCase() === client.lastName?.toLowerCase()
                )
            );

            // Flag duplicates in the clients array
            const clientsWithDuplicateFlag = fetchedClients.map(client => ({
                ...client,
                isDuplicate: duplicateClients.some(d => 
                    d.firstName?.toLowerCase() === client.firstName?.toLowerCase() && 
                    d.lastName?.toLowerCase() === client.lastName?.toLowerCase()
                )
            }));

            setClients(clientsWithDuplicateFlag);
        },
    });

    return { mutateAsync, isLoading, clients, visits, setClients };
};