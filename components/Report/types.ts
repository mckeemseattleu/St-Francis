export type ReportDateRange = {
    startDate: string;
    endDate: string;
};

export type ClientDataRow = {
    month: string;
    men: number;
    women: number;
    other: number;
    kids: number;
    clientsTotal: number;
    newClients: number;
};

export type VisitDataRow = {
    month: string;
    backpack: number;
    busTicket: number;
    orcaCard: number;
    giftcard: number;
    clothingKids: number;
    diaper: number;
    clothingWomen: number;
    clothingMen: number;
    sleepingBag: number;
    financialAssistance: number;
    householdItemQ: number;
};
