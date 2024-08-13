import { firestore } from '@/firebase/firebase';
import { format } from 'date-fns';
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from 'firebase/firestore';
import { ClientDataRow, ReportDateRange, VisitDataRow } from './types';
import { Client, Visit } from '@/models/index';

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

/**
 * Prepares a Firestore query to retrieve visits for a specific client within a given date range.
 * @param clientId - The ID of the client.
 * @param dateRange - The date range for the visits.
 * @returns A Firestore query object.
 */
const prepareVisitQuery = (clientId: string, dateRange: ReportDateRange) => {
    const { startDate, endDate } = dateRange;
    const { start, end } = parseDateRange(startDate, endDate);

    return query(
        collection(firestore, 'clients', clientId, 'visits'),
        where('createdAt', '>=', start),
        where('createdAt', '<=', end)
    );
};

/**
 * Prepares a Firestore query to retrieve clients based on a given date range.
 *
 * @param reportData - The report date range.
 * @returns The Firestore query to retrieve clients.
 */
const prepareClientQuery = (reportData: ReportDateRange) => {
    const { startDate, endDate } = reportData;
    const { start, end } = parseDateRange(startDate, endDate);

    return query(
        collection(firestore, 'clients'),
        where('lastVisit', '!=', null),
        where('lastVisit', '>=', start),
        where('lastVisit', '<=', end)
    );
};

/**
 * Retrieves the visits for the given clients within the specified date range.
 * @param clients - An array of client objects.
 * @param dateRange - The date range for which to retrieve the visits.
 * @returns An array of visit objects.
 */
export const getClientsVisits = async (
    clients: Client[],
    dateRange: ReportDateRange
) => {
    const visits: Visit[] = [];

    // get all visits for each client in the date range
    const promises = clients.map(async (client) => {
        const query = prepareVisitQuery(client.id, dateRange);
        const querySnapshot = await getDocs(query);
        querySnapshot.forEach((doc) => {
            const visit = doc.data();
            visits.push(visit as Visit);
        });
    });

    await Promise.all(promises);
    return visits;
};

/**
 * Retrieves a list of clients based on the provided report date range.
 * @param reportDateRange - The date range for the report.
 * @returns A Promise that resolves to an array of clients.
 */
export const getClients = async (reportDateRange: ReportDateRange) => {
    const query = prepareClientQuery(reportDateRange);
    const querySnapshot = await getDocs(query);
    const listClients: Client[] = [];
    querySnapshot.forEach((doc) => {
        const client = doc.data();
        listClients.push(client as Client);
    });

    return listClients;
};

// Generic grouping function by client or visit
const groupByMonth = <T>(
    data: T[],
    getDate: (item: T) => Date
): Map<string, T[]> => {
    return data.reduce((acc, item) => {
        const date = getDate(item);
        const month = format(date, 'MMMM-yy');

        if (!acc.has(month)) {
            acc.set(month, []);
        }

        acc.get(month)?.push(item);
        return acc;
    }, new Map<string, T[]>());
};

// Specific function for visits
const groupVisitsByMonth = (visits: Visit[]): Map<string, Visit[]> => {
    return groupByMonth(visits, (visit) =>
        (visit.createdAt as Timestamp).toDate()
    );
};

// Specific function for clients
const groupClientsByMonth = (clients: Client[]): Map<string, Client[]> => {
    return groupByMonth(clients, (client) =>
        (client.lastVisit as Timestamp).toDate()
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
export const generateVisitData = (visits: Visit[]): VisitDataRow[] => {
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
    clientsOfMonth: Client[],
    month: string
): ClientDataRow => {
    const genderData = getGenderData(clientsOfMonth);
    const menCount = genderData.find((g) => g.name === 'Male')?.value || 0;
    const womenCount = genderData.find((g) => g.name === 'Female')?.value || 0;
    const otherCount = genderData.find((g) => g.name === 'Other')?.value || 0;
    const kidsCount = clientsOfMonth.reduce((acc, client) => acc + (client.numKids || 0), 0);
    const sumCount = menCount + womenCount + otherCount + kidsCount;
    const newClientsCount = clientsOfMonth.filter((client) => isNewClient(client)).length;
    const daysCount = new Set(clientsOfMonth.map((client) => client.lastVisit?.toDate().getDate())).size;

    return {
        month,
        men: menCount,
        women: womenCount,
        other: otherCount,
        kids: kidsCount,
        clientsTotal: sumCount,
        days: daysCount,
        newClients: newClientsCount,
    };
};

/**
 * Generates client data for a report.
 *
 * @param clients - An array of client objects.
 * @returns An array of client data rows.
 */
export const generateClientData = (clients: Client[]): ClientDataRow[] => {
    const data: ClientDataRow[] = [];
    const groupedClients = groupClientsByMonth(clients);

    groupedClients.forEach((clientsOfMonth, month) => {
        const monthlyData = calculateClientsMonthlyData(clientsOfMonth, month);
        data.push(monthlyData);
    });

    return data;
};

// Helper function to convert an array of objects to CSV format
const arrayToCSV = (data: ClientDataRow[] | VisitDataRow[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0])
        // custom header names for specific fields in dollars
        .map((el) => {
            if (el === 'orcaCard') {
                return 'orcaCard ($)';
            }
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
