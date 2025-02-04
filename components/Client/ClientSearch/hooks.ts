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

            // Convert birthday from Timestamp to string for comparison
            const normalizeBirthday = (client: Client) => {
                if (client.birthday && client.birthday.seconds) {
                    return new Date(client.birthday.seconds * 1000).toISOString().split('T')[0]; // Format as YYYY-MM-DD
                }
                return null; // Handle cases where birthday might be missing
            };

            // Identify duplicates
            const duplicateClients = fetchedClients.filter((client, index, self) => {
                const normalizedBirthday = normalizeBirthday(client);
                const isDuplicate = index !== self.findIndex((t) => 
                    t.firstName?.toLowerCase() === client.firstName?.toLowerCase() && 
                    t.lastName?.toLowerCase() === client.lastName?.toLowerCase() &&
                    normalizeBirthday(t) === normalizedBirthday // Compare normalized birthdays
                );

                return isDuplicate;
            });

            // Flag duplicates in the clients array
            const clientsWithDuplicateFlag = fetchedClients.map(client => ({
                ...client,
                isDuplicate: duplicateClients.some(d => 
                    d.firstName?.toLowerCase() === client.firstName?.toLowerCase() && 
                    d.lastName?.toLowerCase() === client.lastName?.toLowerCase() &&
                    normalizeBirthday(d) === normalizeBirthday(client) // Compare normalized birthdays
                )
            }));

            setClients(clientsWithDuplicateFlag);
        },
    });

    return { mutateAsync, isLoading, clients, visits, setClients };
};