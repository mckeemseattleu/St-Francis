import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { fetchData } from '@/utils/fetchData';
import {
    getClient,
    getSettings,
    getVisit,
    listClients,
    listVisits,
} from '@/utils/index';

jest.mock('@/utils/fetchData', () => ({
    __esModule: true,
    fetchData: jest.fn(),
}));

describe('queries utilities', () => {
    const defaultISOTimestamp = '1970-01-01T00:00:00.000Z';
    const mockClientID = '123';
    const mockVisitID = '456';
    const mockTimestamp = { seconds: 0, nanoseconds: 0 };
    const mockFetchData = (value: object) =>
        (fetchData as jest.Mock).mockReturnValue(value);

    it('should listClients return a list of client documents with firebase timestamps', async () => {
        mockFetchData([
            {
                createdAt: mockTimestamp,
                updatedAt: mockTimestamp,
                birthday: mockTimestamp,
            },
        ]);
        const clients = await act(listClients);
        const expected = defaultISOTimestamp;
        expect(clients[0]?.createdAt?.toDate().toISOString()).toEqual(expected);
        expect(clients[0]?.updatedAt?.toDate().toISOString()).toEqual(expected);
        expect(clients[0]?.birthday?.toDate().toISOString()).toEqual(expected);
    });

    it('should getClient return a single client document with firebase timestamp', async () => {
        mockFetchData({ birthday: mockTimestamp });
        const client = await act(() => getClient(mockClientID));
        expect(client?.birthday?.toDate().toISOString()).toEqual(
            defaultISOTimestamp
        );
    });

    it('should getClient return a single client without birthday', async () => {
        mockFetchData({});
        const client = await act(() => getClient(mockClientID));
        expect(client?.birthday).toEqual(undefined);
    });

    it('should listVisits return a list of visits documents with firebase timestamps', async () => {
        mockFetchData([{ createdAt: mockTimestamp }]);
        const visits = await act(() => listVisits(mockClientID));
        expect(visits[0]?.createdAt?.toDate().toISOString()).toEqual(
            defaultISOTimestamp
        );
    });

    it('should getVisit return a single visit document with firebase timestamp', async () => {
        mockFetchData({
            createdAt: mockTimestamp,
        });
        const visit = await act(() => getVisit(mockClientID, mockVisitID));
        expect(visit?.createdAt?.toDate().toISOString()).toEqual(
            defaultISOTimestamp
        );
    });

    it('should getVisit return a single visit document without firebase timestamp', async () => {
        mockFetchData({});
        const visit = await act(() => getVisit(mockClientID, mockVisitID));
        expect(visit?.createdAt).toEqual(undefined);
    });

    it('should getSettings return a single settings document with firebase timestamp', async () => {
        mockFetchData({
            id: 'default',
            daysEarlyThreshold: 0,
            backpackThreshold: 0,
            sleepingBagThreshold: 0,
            earlyOverride: false,
            updatedAt: mockTimestamp,
        });
        const settings = await act(() => getSettings());
        const expected = defaultISOTimestamp;
        expect(settings?.id).toEqual('default');
        expect(settings?.daysEarlyThreshold).toEqual(0);
        expect(settings?.backpackThreshold).toEqual(0);
        expect(settings?.sleepingBagThreshold).toEqual(0);
        expect(settings?.earlyOverride).toEqual(false);
        expect(settings?.updatedAt?.toDate().toISOString()).toEqual(expected);
    });

    it('should getSettings return a single settings document without firebase timestamp', async () => {
        mockFetchData({});
        const settings = await act(() => getSettings());
        expect(settings?.updatedAt).toEqual(undefined);
    });
});
