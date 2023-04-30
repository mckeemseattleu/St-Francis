import useQueryCache from '@/hooks/useQueryCache';
import { queryClient } from '@/providers/index';
const { updateClientCache, updateVisitCache } = useQueryCache();

beforeEach(() => {
    jest.resetModules();
});

jest.mock('@/providers/index', () => ({
    queryClient: {
        removeQueries: jest.fn(),
        setQueriesData: jest.fn(),
    },
}));

describe('useQueryCache', () => {
    const mockClientID = 'mockClientID';
    const mockVisitID = 'mockVisitID';
    const mockSetQueries = (data: any) =>
        (queryClient.setQueriesData as jest.Mock).mockImplementation((_, cb) =>
            cb(data)
        );
    it('shoudl updates client query cache', () => {
        mockSetQueries({ clients: [{ id: mockClientID }] });
        updateClientCache({ id: mockClientID });
    });
    it('shoudl updates client query cache with no cached data found', () => {
        mockSetQueries(null);
        updateClientCache({ id: mockClientID });
    });
    it('shoudl updates visit query cache with provided vitsit data', () => {
        updateVisitCache(mockClientID, { id: mockVisitID });
    });

    it('shoudl updates visit query cache without visit data', () => {
        updateVisitCache(mockClientID, undefined);
    });
});
