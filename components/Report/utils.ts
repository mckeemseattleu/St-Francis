import { firestore } from '@/firebase/firebase';
import { format } from 'date-fns';
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    collectionGroup,
    documentId,
} from 'firebase/firestore';
import { ClientDataRow, ReportDateRange, VisitDataRow } from './types';
import { Client, Visit } from '@/models/index';
import { CLIENTS_PATH, VISITS_PATH } from '@/utils/index';

const CHUNK_SIZE = 30;

type VisitWithClientId = Visit & { clientId: string };

/**
 * Retrieves visits within a specified date range and includes associated client IDs.
 *
 * @param dateRange - The date range for which to retrieve visits.
 * @returns An object containing a list of visits with client IDs and an array of client IDs.
 *
 */
export const getVisitsWithClientIds = async (dateRange: ReportDateRange) => {
    const { startDate, endDate } = dateRange;
    const { start, end } = parseDateRange(startDate, endDate);

    const visitRef = collectionGroup(firestore, VISITS_PATH);

    const q = query(
        visitRef,
        where('createdAt', '>=', start),
        where('createdAt', '<=', end)
    );

    const querySnapshot = await getDocs(q);

    const listVisits: VisitWithClientId[] = [];
    const clientIds: string[] = [];

    querySnapshot.forEach((doc) => {
        const fullPath = doc.ref.path;
        const segments = fullPath.split('/');
        const clientId = segments[1];
        clientIds.push(clientId);
        listVisits.push({ ...(doc.data() as Visit), clientId });
    });

    return { listVisits, clientIds };
};

/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to be split into chunks.
 * @param size - The size of each chunk.
 * @returns An array containing the chunks.
 */
const chunkArray = (array: string[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

/**
 * Fetches clients from Firestore based on an array of user IDs.
 * The function splits the array of user IDs into chunks of a specified size
 *
 * @param userIds - An array of user IDs to fetch clients for.
 * @returns A promise that resolves to an array of clients.
 *
 * @example
 * ```typescript
 * const userIds = ['id1', 'id2', 'id3'];
 * const clients = await getClientsByIds(userIds);
 * ```
 */
export const getClientsByIds = async (userIds: string[]) => {
    const clientsRef = collection(firestore, CLIENTS_PATH);

    // Split the array of user IDs into chunks of 30
    const userChunks = chunkArray(userIds, CHUNK_SIZE);

    // Map over chunks and return promises for each query
    const promises = userChunks.map(async (chunk) => {
        try {
            const q = query(clientsRef, where(documentId(), 'in', chunk));
            const querySnapshot = await getDocs(q);

            // Collect users from the querySnapshot
            return querySnapshot.docs.map((doc) => doc.data() as Client);
        } catch (error) {
            return [];
        }
    });

    // Resolve all promises and flatten the results
    const results = await Promise.all(promises);
    const clients = results.flat(); // Flatten the array of arrays into a single array

    return clients;
};

/**
 * Parses the start and end dates and returns an object with the parsed dates.
 * The start date is inclusive and the end date is set to the end of the day.
 *
 * @param startDate - The start date in the format "YYYY-MM-DD".
 * @param endDate - The end date in the format "YYYY-MM-DD".
 * @returns An object with the parsed start and end dates.
 */
const parseDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate.split('-').join('/'));
    const end = new Date(endDate.split('-').join('/'));
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

// Generic grouping function by client or visit
/**
 * Groups an array of data items by month.
 *
 * @template T - The type of the data items.
 * @param data - The array of data items to be grouped.
 * @param (item: T) => Date} getDate - A function that extracts the date from a data item.
 * @param clients - An optional array of clients to be included in the grouping.
 * @returns {Map<string, (T | Client)[]>} A map where the keys are month strings (formatted as 'MMMM-yy') and the values are arrays of data items or clients.
 */
const groupByMonth = <T>(
    data: T[],
    getDate: (item: T) => Date,
    clients?: Client[]
): Map<string, (T | Client)[]> => {
    return data.reduce((acc, item) => {
        const date = getDate(item);
        const month = format(date, 'MMMM-yy');

        // If the month key doesn't exist, create it
        if (!acc.has(month)) {
            acc.set(month, []);
        }

        // find client by id
        const client = clients?.find(
            (client) => client.id === (item as VisitWithClientId).clientId
        );

        const currentMonth = acc.get(month);
        if (client && currentMonth) {
            currentMonth.push(client);

            // for groups visits by month
        } else if (!clients && currentMonth) {
            currentMonth.push(item);
        }

        return acc;
    }, new Map<string, (T | Client)[]>());
};

// Specific function for visits
const groupVisitsByMonth = (visits: Visit[]): Map<string, Visit[]> => {
    return groupByMonth(visits, (visit) =>
        (visit.createdAt as Timestamp).toDate()
    );
};

// Specific function for clients
/**
 * Groups clients by the month of their visits.
 *
 * @param clients - An array of clients.
 * @param visitsWithClientId - An array of visits, each associated with a client ID.
 * @returns A Map where the keys are month strings and the values are arrays of clients who had visits in those months.
 */
const groupClientsByMonth = (
    clients: Client[],
    visitsWithClientId: VisitWithClientId[]
): Map<string, Client[]> => {
    return groupByMonth(
        visitsWithClientId,
        (visit) => (visit.createdAt as Timestamp).toDate(),
        clients
    );
};

/**
 * Calculates the counts of various visit items for a given array of visits in a month.
 * @param visitsOfMonth - An array of Visit objects representing the visits in a month.
 * @returns An object containing the counts of various visit items.
 */
// prettier-ignore
const calculateVisitsCounts = (visitsOfMonth: Visit[]): VisitDataRow => {
    const backpackCount = visitsOfMonth.filter(visit => visit.backpack).length;
    const busTicketCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.busTicket || 0), 0);
    const orcaCardCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.orcaCard || 0), 0);
    const giftcardCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.giftCard || 0), 0);
    const diaperCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.diaper || 0), 0);
    const clothingWomenCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.womensQ || 0), 0);
    const clothingMenCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.mensQ || 0), 0);
    const sleepingBagCount = visitsOfMonth.filter(visit => visit.sleepingBag).length;
    const financialAssistanceCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.financialAssistance || 0), 0);
    const clothingKidsCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.kidsQ || 0), 0);
    const householdItemQCount = visitsOfMonth.reduce((acc, visit) => acc + (visit.householdItemQ || 0), 0);

    const firstVisit = visitsOfMonth[0];
    const month = firstVisit?.createdAt ? format(firstVisit.createdAt.toDate(), 'MMMM-yy') : '';

    return {
        month: month,
        backpack: backpackCount,
        busTicket: busTicketCount,
        orcaCard: orcaCardCount,
        giftcard: giftcardCount,
        clothingKids: clothingKidsCount,
        diaper: diaperCount,
        clothingWomen: clothingWomenCount,
        clothingMen: clothingMenCount,
        sleepingBag: sleepingBagCount,
        financialAssistance: financialAssistanceCount,
        householdItemQ: householdItemQCount
    };
};

/**
 * Generates visit data by grouping visits by month and calculating counts.
 * @param visits - An array of Visit objects.
 * @returns An array of VisitDataRow objects representing the calculated counts for each month.
 */
export const generateVisitData = (
    visits: VisitWithClientId[]
): VisitDataRow[] => {
    const data: VisitDataRow[] = [];
    const groupedVisits = groupVisitsByMonth(visits);

    groupedVisits.forEach((visitsOfMonth) => {
        const counts = calculateVisitsCounts(visitsOfMonth);
        data.push(counts);
    });

    return data;
};

// Helper function to calculate gender data
const getGenderData = (
    clients: Client[]
): { name: string; value: number }[] => {
    const genderCountsMap: Record<string, number> = {
        Male: 0,
        Female: 0,
        Other: 0,
    };

    clients.forEach((client) => {
        if (client.gender === 'Male') {
            genderCountsMap['Male']++;
        } else if (client.gender === 'Female') {
            genderCountsMap['Female']++;
        } else {
            genderCountsMap['Other']++;
        }
    });

    return Object.entries(genderCountsMap).map(([name, value]) => ({
        name,
        value,
    }));
};

// Helper function to check if a client is new
const isNewClient = (client: Client): boolean => {
    if (client.createdAt && client.lastVisit) {
        const createdAtDate = client.createdAt.toDate();
        const lastVisitDate = client.lastVisit.toDate();
        return (
            createdAtDate.getMonth() === lastVisitDate.getMonth() &&
            createdAtDate.getFullYear() === lastVisitDate.getFullYear()
        );
    }
    return false;
};

/**
 * Calculates the monthly data for clients.
 *
 * @param clientsOfMonth - An array of Client objects representing the clients for the month.
 * @param month - The month for which the data is being calculated.
 * @returns An object containing the calculated monthly data for clients.
 */
// prettier-ignore
const calculateClientsMonthlyData = (
    clientsOfMonth: Client[] ,
    month: string
): ClientDataRow => {
    const genderData = getGenderData(clientsOfMonth);
    const menCount = genderData.find((g) => g.name === 'Male')?.value || 0;
    const womenCount = genderData.find((g) => g.name === 'Female')?.value || 0;
    const otherCount = genderData.find((g) => g.name === 'Other')?.value || 0;
    const kidsCount = clientsOfMonth.reduce((acc, client) => acc + (client.numKids || 0), 0);
    const sumCount = menCount + womenCount + otherCount;
    const newClientsCount = clientsOfMonth.filter((client) => isNewClient(client)).length;

    return {
        month,
        men: menCount,
        women: womenCount,
        other: otherCount,
        clientsTotal: sumCount,
        kids: kidsCount,
        newClients: newClientsCount,
    };
};

/**
 * Generates client data for a report.
 *
 * @param clients - An array of client objects.
 * @returns An array of client data rows.
 */
export const generateClientData = (
    clients: Client[],
    visitsWithClientId: VisitWithClientId[]
): ClientDataRow[] => {
    const clientDataRow: ClientDataRow[] = [];
    const groupedClients = groupClientsByMonth(clients, visitsWithClientId);

    groupedClients.forEach((clientsOfMonth, month) => {
        const monthlyData = calculateClientsMonthlyData(clientsOfMonth, month);
        clientDataRow.push(monthlyData);
    });

    return clientDataRow;
};

// Helper function to convert an array of objects to CSV format
const arrayToCSV = (data: ClientDataRow[] | VisitDataRow[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0])
        // custom header names for specific fields in dollars
        .map((el) => {
            if (el === 'giftcard') {
                return 'giftcard ($)';
            }
            if (el === 'financialAssistance') {
                return 'financialAssistance ($)';
            }
            if (el === 'householdItemQ') {
                return 'householdItems';
            }
            return el;
        })
        .join(',');
    const rows = data.map((row) => Object.values(row).join(',')).join('\n');

    return `${headers}\n${rows}`;
};

// Helper function to sum values by a specific key
const sumByKey = (
    arr: (ClientDataRow | VisitDataRow)[],
    key: string
): number => {
    return arr.reduce((acc: number, obj) => {
        const value = obj[key as keyof (ClientDataRow | VisitDataRow)];
        return acc + (parseInt(value as string, 10) || 0);
    }, 0);
};

// Helper function to generate a total row
const generateTotalRow = (
    data: ClientDataRow[] | VisitDataRow[],
    label: string
): string => {
    if (data.length === 0) return '';
    const totalRow = [
        label,
        ...Object.keys(data[0])
            .slice(1)
            .map((key) => sumByKey(data, key)),
    ].join(',');

    return totalRow;
};

// Helper function to generate a CSV section with a title and total row
const generateCSVSection = (
    title: string,
    data: ClientDataRow[] | VisitDataRow[],
    totalLabel: string
): string => {
    const csvData = arrayToCSV(data);
    const totalRow = generateTotalRow(data, totalLabel);

    return `${title}:\n${csvData}\n${totalRow}`;
};

// Main function to generate the CSV file
// prettier-ignore
export const generateCSV = (
    clientsData: ClientDataRow[],
    visitsData: VisitDataRow[],
    reportDateRange: ReportDateRange
) => {
    const reportPeriod = `Report period: ${reportDateRange.startDate} - ${reportDateRange.endDate}`;

    const clientsSection = generateCSVSection('By clients', clientsData, 'Total:');
    const productsSection = generateCSVSection('By products', visitsData, 'Total:');

    const csv = `${reportPeriod}\n\n${clientsSection}\n\n${productsSection}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${new Date().toISOString()}.csv`;
    a.click();
};
