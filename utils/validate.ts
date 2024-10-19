import { Client, Settings, Visit } from '@/models/index';
import { getSettings } from '@/utils/index';
import { subDays, isAfter } from 'date-fns';

/**
 * Calculate validation data (days between last and threshold)
 * @param client Client document
 * @param settings Settings document
 * @returns validated result and validation data (days left)
 */
export const validateClient = (
    client: Client | null = null,
    settings: Settings,
    clientVisits: Visit[] | undefined
) => {
    if (!client || !settings) return { validated: false };
    const {
        daysEarlyThreshold = 0,
        backpackThreshold = 0,
        sleepingBagThreshold = 0,
        earlyOverride = false,
        orcaCardThreshold = 0,
    } = settings;
    // Bypass validation if earlyOverride is true
    if (earlyOverride) return { validated: true };
    const { lastBackpack, lastSleepingBag, lastOrcaCard } = client;

    // Calculate days duration
    const daysVisit = daysBetween(findShoppingWithDate(clientVisits, settings));
    const daysBackpack = daysBetween(lastBackpack?.toDate());
    const daysSleepingBag = daysBetween(lastSleepingBag?.toDate());
    const daysOrcaCard = daysBetween(
        lastOrcaCard?.toDate() ?? findLastOrcaCardDate(clientVisits)
    );

    // Calculate days left for eligibility (if negative, default to 0)
    const daysVisitLeft = toUint(daysEarlyThreshold - daysVisit);
    const daysBackpackLeft = toUint(backpackThreshold - daysBackpack);
    const daysSleepingBagLeft = toUint(sleepingBagThreshold - daysSleepingBag);
    const daysOrcaCardLeft = toUint(orcaCardThreshold - daysOrcaCard);
    const validated =
        !daysVisitLeft &&
        !daysBackpackLeft &&
        !daysSleepingBagLeft &&
        !daysOrcaCardLeft;

    return {
        validated,
        data: {
            daysVisitLeft,
            daysBackpackLeft,
            daysSleepingBagLeft,
            daysOrcaCardLeft,
        },
    };
};

const daysBetween = (from: Date | undefined, to: Date = new Date()) => {
    if (!from) return Number.MAX_SAFE_INTEGER;
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.abs((to.getTime() - from.getTime()) / msPerDay);
};

const toUint = (value: number) => Math.round(value > 0 ? value : 0);

const findShoppingWithDate = (
    clientVisits: Visit[] | undefined,
    settings: Settings
) => {
    const shopping_theshold = settings.daysEarlyThreshold;
    if (!shopping_theshold) return;
    const treshholdDate = subDays(new Date(), shopping_theshold);
    const visitWithShopping = clientVisits?.find((visit) => {
        if (!visit.createdAt) return;
        return (
            ((visit.mensQ && visit.mensQ > 0) ||
                (visit.kidsQ && visit.kidsQ > 0) ||
                (visit.diaper && visit.diaper > 0) ||
                (visit.womensQ && visit.womensQ > 0) ||
                (visit.giftCard && visit.giftCard > 0) ||
                (visit.busTicket && visit.busTicket > 0) ||
                visit.householdItem || // If householdItem is truthy
                (visit.householdItemQ && visit.householdItemQ > 0) ||
                (visit.financialAssistance && visit.financialAssistance > 0)) &&
            isAfter(visit.createdAt.toDate(), treshholdDate)
        );
    });

    return visitWithShopping
        ? visitWithShopping.createdAt?.toDate()
        : undefined;
};

const findLastOrcaCardDate = (clientVisits: Visit[] | undefined) => {
    const lastOrcaCard = clientVisits?.find((visit) => {
        if (!visit.createdAt) return;
        return visit.orcaCard && visit.orcaCard > 0;
    });

    return lastOrcaCard ? lastOrcaCard.createdAt?.toDate() : undefined;
};
