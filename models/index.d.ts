import { Timestamp } from 'firebase/firestore';

export declare type Client = {
    readonly id: string;
    readonly notes?: string | null;
    readonly gender?: string | null;
    readonly race?: string | null;
    readonly numKids?: number | null;
    readonly birthday?: Timestamp | null;
    readonly isBanned?: boolean | null;
    readonly lastName?: string | null;
    readonly firstName?: string | null;
    readonly lastNameLower?: string | null;
    readonly firstNameLower?: string | null;
    readonly createdAt?: Timestamp | null;
    readonly updatedAt?: Timestamp | null;
    readonly postalCode?: string | null;
    readonly isCheckedIn?: boolean | null;
    readonly middleInitial?: string | null;
    readonly numInFamily?: number | null;
    readonly lastBackpack?: Timestamp | null;
    readonly lastBusTicket?: Timestamp | null;
    readonly lastSleepingbag?: Timestamp | null;
    readonly BerthaPittsCampbellResident?: boolean | null;
    readonly lastFinancialAssistanceDate?: Timestamp | null;
    readonly lastFinancialAssistanceValue?: string | null;
    readonly lastVisit?: Timestamp | null;
    readonly unhoused?: boolean | null;
};

export declare type Visit = {
    readonly id: string;
    readonly kids?: boolean | null;
    readonly mens?: boolean | null;
    readonly soap?: boolean | null;
    readonly mensQ?: number | null;
    readonly kidsQ?: number | null;
    readonly notes?: string | null;
    readonly razor?: boolean | null;
    readonly boyAge?: string | null;
    readonly diaper?: number | null;
    readonly lotion?: boolean | null;
    readonly womens?: boolean | null;
    readonly girlAge?: string | null;
    readonly womensQ?: string | null;
    readonly backpack?: boolean | null;
    readonly giftCard?: number | null;
    readonly busTicket?: number | null;
    readonly household?: string | null;
    readonly createdAt?: Timestamp | null;
    readonly toothbrush?: boolean | null;
    readonly toothpaste?: boolean | null;
    readonly clothingBoy?: boolean | null;
    readonly clothingMen?: boolean | null;
    readonly sleepingBag?: boolean | null;
    readonly clothingGirl?: boolean | null;
    readonly lastBackpack?: string | null;
    readonly clothingWomen?: boolean | null;
    readonly lastSleepingBag?: Timestamp | null; // Warning: lastSleepingbag on Client
    readonly shampooConditioner?: string | null;
    readonly financialAssistance?: number | null;
    readonly lastFinancialAssistance?: string | null;
};

export declare type Settings = {
    readonly id: string;
    readonly daysEarlyThreshold?: number;
    readonly backpackThreshold?: number;
    readonly sleepingBagThreshold?: number;
    readonly earlyOverride?: boolean;
    readonly createdAt?: Timestamp | null;
    readonly updatedAt?: Timestamp | null;
};
