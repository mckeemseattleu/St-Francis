import { useMutation } from 'react-query';
import type { ReportDateRange } from './types';
import {
    getClients,
    getClientsVisits,
    generateVisitData,
    generateClientData,
    generateCSV,
} from './utils';

export const useGenerateReport = () => {
    const { mutateAsync, isError, isLoading } = useMutation({
        mutationFn: async (reportDateRange: ReportDateRange) => {
            // get data from firebase
            const listClients = await getClients(reportDateRange);
            const clientsVisits = await getClientsVisits(
                listClients,
                reportDateRange
            );

            // generate data by clients and by products
            const clientsData = generateClientData(listClients);
            const reportVisits = generateVisitData(clientsVisits);

            // generate csv
            generateCSV(clientsData, reportVisits, reportDateRange);
        },
    });
    return { mutateAsync, isError, isLoading };
};
