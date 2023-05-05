import '@testing-library/jest-dom';
import { formatDate, toUTCDateString } from '@/utils/formatDate';
import { Timestamp } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    __esModule: true,
    Timestamp: jest.fn(() => ({
        toDate: () => new Date(0),
    })),
}));

describe('formatDate', () => {
    const timestamp = new Timestamp(0, 0);
    const epochDate = it('formatDate should return locale date string', () => {
        const dateString = formatDate(timestamp);
        expect(dateString).toEqual(new Date(0).toDateString().substring(4, 16));
    });
    it('formatDate should return utc date string', () => {
        const dateString = formatDate(timestamp, true);
        expect(dateString).toEqual(new Date(0).toUTCString().substring(5, 16));
    });
    it('formatDate should return empty date string on error', () => {
        (Timestamp as unknown as jest.Mock).mockReturnValue({
            toDate: undefined,
        });
        const dateString = formatDate(new Timestamp(0, 0));
        expect(dateString === '').toBeTruthy();
    });
    it('toUTCDateString should return ISO date', () => {
        const dateString = toUTCDateString(timestamp);
        expect(dateString).toEqual('1970-01-01')
    });
    it('toUTCDateString should return empty string without timestamp param', () => {
        const dateString = toUTCDateString(undefined);
        expect(dateString === '').toBeTruthy();
    });
});
