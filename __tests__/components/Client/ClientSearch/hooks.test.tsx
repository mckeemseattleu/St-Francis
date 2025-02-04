import { renderHook, act } from '@testing-library/react';
import { useGetClientsSearch } from '@/components/Client/ClientSearch/hooks';
import { Timestamp } from 'firebase/firestore';
import { Client } from '@/models/index';
import type { DocFilter } from '@/utils/index';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock only listClients function
jest.mock('@/utils/index', () => ({
    listClients: jest.fn(),
}));

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('useGetClientsSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should handle empty search results', async () => {
        const { listClients } = require('@/utils/index');
        (listClients as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useGetClientsSearch(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.mutateAsync({} as DocFilter);
        });

        expect(result.current.clients).toEqual([]);
        expect(result.current.visits).toEqual([]);
    });

    it('should identify duplicate clients correctly', async () => {
        const mockClients = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
            } as Client,
            {
                id: '2',
                firstName: 'John',
                lastName: 'Doe',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
            } as Client,
        ];

        const { listClients } = require('@/utils/index');
        (listClients as jest.Mock).mockResolvedValue(mockClients);

        const { result } = renderHook(() => useGetClientsSearch(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.mutateAsync({} as DocFilter);
        });

        expect(result.current.clients).toHaveLength(2);
        expect(result.current.clients[0].isDuplicate).toBe(true);
        expect(result.current.clients[1].isDuplicate).toBe(true);
    });

    it('should handle clients with missing data', async () => {
        const mockClients = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                birthday: null,
            } as Client,
            {
                id: '2',
                firstName: null,
                lastName: 'Smith',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
            } as Client,
        ];

        const { listClients } = require('@/utils/index');
        (listClients as jest.Mock).mockResolvedValue(mockClients);

        const { result } = renderHook(() => useGetClientsSearch(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.mutateAsync({} as DocFilter);
        });

        expect(result.current.clients).toHaveLength(2);
        expect(result.current.clients[0].isDuplicate).toBe(false);
        expect(result.current.clients[1].isDuplicate).toBe(false);
    });

    it('should handle case-insensitive duplicate detection', async () => {
        const mockClients = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
            } as Client,
            {
                id: '2',
                firstName: 'JOHN',
                lastName: 'DOE',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
            } as Client,
        ];

        const { listClients } = require('@/utils/index');
        (listClients as jest.Mock).mockResolvedValue(mockClients);

        const { result } = renderHook(() => useGetClientsSearch(), {
            wrapper: createWrapper(),
        });

        await act(async () => {
            await result.current.mutateAsync({} as DocFilter);
        });

        expect(result.current.clients).toHaveLength(2);
        expect(result.current.clients[0].isDuplicate).toBe(true);
        expect(result.current.clients[1].isDuplicate).toBe(true);
    });
}); 