import { getSettings } from '@/utils/index';
import { validateClient } from '@/utils/validate';
import '@testing-library/jest-dom';
import { Timestamp } from 'firebase/firestore';

jest.mock('@/utils/index', () => ({
    __esModule: true,
    getSettings: jest.fn(),
}));

describe('validateClient', () => {
    const mockClient = {
        id: 'ID',
        lastVisit: new Timestamp(0, 0),
        lastBackpack: new Timestamp(0, 0),
        lastSleepingBag: new Timestamp(0, 0),
    };
    const mockSettings = {
        id: 'default',
        daysEarlyThreshold: 0,
        backpackThreshold: 0,
        sleepingBagThreshold: 0,
        earlyOverride: false,
    };
    (getSettings as jest.Mock).mockReturnValue(mockSettings);
    it('should validate eligible client', async () => {
        const result = await validateClient(mockClient, mockSettings, []);
        expect(result?.data?.daysVisitLeft).toBe(0);
        expect(result?.data?.daysBackpackLeft).toBe(0);
        expect(result?.data?.daysSleepingBagLeft).toBe(0);
        expect(result.validated).toBe(true);
    });
    it('shoudld validate ineligible client', async () => {
        const result = await validateClient(
            {
                ...mockClient,
                lastVisit: Timestamp.fromDate(new Date()),
                lastBackpack: Timestamp.fromDate(new Date()),
                lastSleepingBag: Timestamp.fromDate(new Date()),
            },
            {
                ...mockSettings,
                daysEarlyThreshold: 10,
                backpackThreshold: 10,
                sleepingBagThreshold: 10,
            },
            []
        );
        expect(result?.data?.daysVisitLeft).toBe(0);
        expect(result?.data?.daysBackpackLeft).toBe(10);
        expect(result?.data?.daysSleepingBagLeft).toBe(10);
        expect(result.validated).toBe(false);
    });
    it('should validate failed if no client', async () => {
        const result = await validateClient(null, mockSettings, []);
        expect(result.validated).toBe(false);
    });

    it('should bypass validation if earlyOverride is true', async () => {
        const result = await validateClient(
            mockClient,
            {
                ...mockSettings,
                earlyOverride: true,
            },
            []
        );
        expect(result.validated).toBe(true);
    });
});
