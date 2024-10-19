import { useMutation } from 'react-query';
import { useState } from 'react';
import { subDays } from 'date-fns';
import useAlert from '@/hooks/useAlert';
import type { Client } from '@/models/index';
import { DocFilter, FilterObject, listVisits } from '@/utils/index';
import { listClients, getSettings } from '@/utils/index';
import type { VisitWithClientId } from '@/types/visits';

export const useGetClientsSearch = () => {
    const [, setAlert] = useAlert();
    const [clients, setClients] = useState<Client[]>([]);
    const [visits, setVisits] = useState<VisitWithClientId[]>([]);

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: async (fields: DocFilter) => {
            const filter = { ...fields };
            if (filter?.filterByBirthday && !filter.birthday) {
                setAlert({
                    message: 'invalid date of birth',
                    type: 'error',
                });
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
            const clients = await listClients(filter);

            // fetch visit by clients
            const userIds = clients.map((client) => client.id);
            const visits = await getVisitsByClientIds(userIds);
            setVisits(visits);
            setClients(clients);
        },
    });

    return { mutateAsync, isLoading, clients, visits, setClients };
};

const VISITS_LIMIT = 10; //  visit limit per client

export const getVisitsByClientIds = async (userIds: string[]) => {
    const ORCA_CARD_TRESHOLD = (await getSettings()).orcaCardThreshold;
    if (!ORCA_CARD_TRESHOLD) {
        return [];
    }

    const pastDate = subDays(new Date(), ORCA_CARD_TRESHOLD);

    const promises = userIds.map(async (userId) => {
        try {
            const visits = await listVisits(
                userId,
                {
                    createdAt: { opStr: '>=', value: pastDate },
                },
                VISITS_LIMIT
            );

            // Add the clientId to each visit
            return visits.map((visit) => ({ ...visit, clientId: userId }));
        } catch (error) {
            return [];
        }
    });

    // Resolve all promises and flatten the results
    const results = await Promise.all(promises);
    const visits = results.flat();

    return visits;
};
