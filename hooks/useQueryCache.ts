import { Client } from '@/models/index';
import { queryClient } from '@/providers/index';
import { CLIENTS_PATH, DocFilter, VISITS_PATH } from '@/utils/index';

export default function useQueryCache() {
    // TODO: update cached query data instead of removing it, no refetch needed
    // TODO: move this logic to the updateClient helper function
    const updateClientCache = (clientData: DocFilter, isDelete = false) => {
        // Remove cached query data when update is successful, refetch on next page load
        queryClient.removeQueries([CLIENTS_PATH, clientData.id]);
        // Remove cached query data for checked-in clients query, refetch on next page load
        queryClient.removeQueries([CLIENTS_PATH, 'checkedin']);

        // Update cached query data for searched clients query, no refetch needed
        queryClient.setQueriesData([CLIENTS_PATH, 'searched'], (data: any) => {
            if (!data) return;
            if (isDelete) {
                return data['clients'].filter(
                    (client: Client) => client.id !== clientData.id
                );
            }
            data['clients']?.forEach((client: Client, index: number) => {
                if (client.id === clientData.id)
                    data['clients'][index] = { ...client, ...clientData };
            });
            return data;
        });
    };

    const updateVisitCache = (clientID: string, visitData?: DocFilter) => {
        queryClient.removeQueries([CLIENTS_PATH, clientID, VISITS_PATH]);
        if (!visitData) return;
        queryClient.removeQueries([
            CLIENTS_PATH,
            clientID,
            VISITS_PATH,
            visitData.id,
        ]);
    };

    return { updateClientCache, updateVisitCache };
}
