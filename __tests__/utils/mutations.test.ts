import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { mutateData } from '@/utils/fetchData';
import {
    createClient,
    updateClient,
    createVisit,
    updateVisit,
    updateSettings,
} from '@/utils/index';
import { Timestamp } from 'firebase/firestore';

jest.mock('@/utils/fetchData', () => ({
    __esModule: true,
    mutateData: jest.fn(),
}));

describe('queries utilities', () => {
    const mockClientID = 'clientID';
    const mockVisitID = 'visitID';
    const mockDocID = 'docID';
    (mutateData as jest.Mock).mockReturnValue(mockDocID);

    it('createClient should return new Client document with id and created timestamp', async () => {
        const client = await act(() => createClient({}));
        expect(client.id).toEqual(mockDocID);
        expect(client.createdAt).toBeInstanceOf(Timestamp);
    });

    it('updateClient should return updated Client document with id and updated timestamp', async () => {
        const clientID = mockClientID;
        const client = await act(() => updateClient({ id: clientID }));
        expect(client.id).toEqual(clientID);
        expect(client.updatedAt).toBeInstanceOf(Timestamp);
    });

    it('createVisit should return new Visit document with id and created timestamp', async () => {
        const visit = await act(() => createVisit({}, mockClientID));
        expect(visit.id).toEqual(mockDocID);
        expect(visit.createdAt).toBeInstanceOf(Timestamp);
    });

    it('updateVisit should return updated Visit document with id and updated timestamp', async () => {
        const visit = await act(() =>
            updateVisit({ id: mockVisitID }, mockClientID)
        );
        expect(visit.id).toEqual(mockVisitID);
        expect(visit.updatedAt).toBeInstanceOf(Timestamp);
    });

    it('updateSettings should return updated Settings document with id and updated timestamp', async () => {
        const settings = await act(() => updateSettings({ id: 'default' }));
        expect(settings.id).toEqual('default');
        expect(settings.updatedAt).toBeInstanceOf(Timestamp);
    });
});
