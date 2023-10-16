import { DocFilter, fetchData, mutateData } from '@/utils/index';
import { act } from '@testing-library/react';
import { doc, getDoc, getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    __esModule: true,
    // Needed because of firebase.ts import
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    limit: jest.fn(),
    query: jest.fn(),
    setDoc: jest.fn(),
    where: jest.fn(),
    Timestamp: jest.fn(),
    orderBy: jest.fn(),
    getFirestore: jest.fn(),
}));

jest.mock('@/firebase/firebase');

describe('fetchData', () => {
    const mockID = 'mockID';
    const mockPath = 'mockPath';
    it('should return empty array without path', async function () {
        const data = await act(() => fetchData({}, ''));
        expect(data).toBeInstanceOf(Array);
        expect((data as Array<any>).length).toEqual(0);
    });

    it('should return a list of documents when fields not contain id', async function () {
        (getDocs as jest.Mock).mockReturnValue({
            docs: [
                {
                    data: () => ({}),
                },
            ],
        });
        const docs = await act(() =>
            fetchData({ anyButID: 'value' }, mockPath)
        );
        expect(docs).toBeInstanceOf(Array);
        expect((docs as Array<any>).length).toEqual(1);
    });

    it('should return a single document when fields contain id', async function () {
        (getDoc as jest.Mock).mockReturnValue({
            id: mockID,
            data: () => ({}),
            exists: () => true,
        });
        const doc = await act(() => fetchData({ id: mockID }, mockPath));
        expect(doc).not.toBeInstanceOf(Array);
        expect((doc as { id: string }).id).toEqual(mockID);
    });

    it('should return null when document not exist', async function () {
        (getDoc as jest.Mock).mockReturnValue({
            exists: () => false,
        });
        const doc = await act(() => fetchData({ id: mockID }, mockPath));
        expect(doc).toBeNull();
    });

    it('should accept fields contains array of FilterObject', async function () {
        (getDocs as jest.Mock).mockReturnValue({
            docs: [{ data: () => ({}) }],
        });
        const fields = {
            lastVisit: [
                { opStr: '<=', value: new Date() },
                { opStr: '>=', value: new Date() },
            ],
        } as DocFilter;
        const docs = await act(() =>
            fetchData(fields, mockPath, 10, { by: 'lastVisit', desc: true })
        );
        expect(docs).toBeInstanceOf(Array);
        expect((docs as Array<any>).length).toEqual(1);
    });
});

describe('mutateData', () => {
    const mockID = 'mockID';
    const mockPath = 'mockPath';
    (doc as jest.Mock).mockReturnValue({ id: mockID });
    it('should return null with empty string path', async function () {
        const docID = await act(() => mutateData({}, ''));
        expect(docID).toBeNull();
    });

    it('should update document and return document id', async function () {
        const docID = await act(() => mutateData({ id: mockID }, mockPath));
        expect(docID).toEqual(mockID);
    });

    it('should create document and return new document id', async function () {
        const docID = await act(() => mutateData({}, mockPath));
        expect(docID).toEqual(mockID);
    });
});
