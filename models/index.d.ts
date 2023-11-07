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
    readonly unhoused?: boolean | null;
    readonly createdAt?: Timestamp | null;
    readonly firstName?: string | null;
    readonly lastVisit?: Timestamp | null;
    readonly sheltered?: boolean | null;
    readonly updatedAt?: Timestamp | null;
    readonly postalCode?: string | null;
    readonly isCheckedIn?: boolean | null;
    readonly BPCResident?: boolean | null;
    readonly middleInitial?: string | null;
    readonly lastBackpack?: Timestamp | null;
    readonly lastBusTicket?: Timestamp | null;
    readonly lastNameLower?: string | null;
    readonly firstNameLower?: string | null;
    readonly lastSleepingBag?: Timestamp | null;
    readonly idv1?: string;
};

export declare type Visit = {
    readonly id: string;
    readonly mensQ?: number | null;
    readonly kidsQ?: number | null;
    readonly notes?: string | null;
    readonly boyAge?: string | null;
    readonly diaper?: number | null;
    readonly girlAge?: string | null;
    readonly womensQ?: number | null;
    readonly backpack?: boolean | null;
    readonly giftCard?: number | null;
    readonly busTicket?: number | null;
    readonly orcaCard?: number | null;
    readonly household?: string | null;
    readonly createdAt?: Timestamp | null;
    readonly clothingBoy?: boolean | null;
    readonly clothingMen?: boolean | null;
    readonly sleepingBag?: boolean | null;
    readonly food?: boolean | null;
    readonly clothingGirl?: boolean | null;
    readonly clothingWomen?: boolean | null;
    readonly financialAssistance?: number | null;
    readonly idv1?: string;
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
