import { useMutation } from 'react-query';
import type { ReportDateRange } from './types';
import {
    generateVisitData,
    generateClientData,
    generateCSV,
    getVisitsWithClientIds,
    getClientsByIds,
} from './utils';

export const useGenerateReport = () => {
    const { mutateAsync, isError, isLoading } = useMutation({
        mutationFn: async (reportDateRange: ReportDateRange) => {
            // get data from firebase
            const { listVisits, clientIds } = await getVisitsWithClientIds(
                reportDateRange
            );

            // get clients from firebase by clients ids
            const listClients = await getClientsByIds(clientIds);

            // generate data by clients and by products
            const clientsData = generateClientData(listClients, listVisits);
            const reportVisits = generateVisitData(listVisits);

            // generate csv
            generateCSV(clientsData, reportVisits, reportDateRange);
        },
    });
    return { mutateAsync, isError, isLoading };
};
