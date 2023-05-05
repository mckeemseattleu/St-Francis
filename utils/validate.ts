import { Client, Settings } from '@/models/index';
import { getSettings } from '@/utils/index';

/**
 * Calculate validation data (days between last and threshold)
 * @param client Client document
 * @param settings Settings document
 * @returns validated result and validation data (days left)
 */
export const validateClient = async (
    client: Client | null = null,
    settings: Settings | null = null
) => {
    // TODO: Validate for edge cases with daylight savings and different timezones
    if (!client) return { validated: false };
    if (!settings) settings = await getSettings();
    const {
        daysEarlyThreshold = 0,
        backpackThreshold = 0,
        sleepingBagThreshold = 0,
        earlyOverride = false,
    } = settings;
    // Bypass validation if earlyOverride is true
    if (earlyOverride) return { validated: true };
    const { lastVisit, lastBackpack, lastSleepingBag } = client;
    // Calculate days duration
    const daysVisit = daysBetween(lastVisit?.toDate());
    const daysBackpack = daysBetween(lastBackpack?.toDate());
    const daysSleepingBag = daysBetween(lastSleepingBag?.toDate());
    // Calculate days left for eligibility (if negative, default to 0)
    const daysVisitLeft = toUint(daysEarlyThreshold - daysVisit);
    const daysBackpackLeft = toUint(backpackThreshold - daysBackpack);
    const daysSleepingBagLeft = toUint(sleepingBagThreshold - daysSleepingBag);
    const validated =
        !daysVisitLeft && !daysBackpackLeft && !daysSleepingBagLeft;

    return {
        validated,
        data: {
            daysVisitLeft,
            daysBackpackLeft,
            daysSleepingBagLeft,
        },
    };
};

const daysBetween = (from: Date | undefined, to: Date = new Date()) => {
    if (!from) return Number.MAX_SAFE_INTEGER;
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.abs((to.getTime() - from.getTime()) / msPerDay);
};

const toUint = (value: number) => Math.round(value > 0 ? value : 0);
