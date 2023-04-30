import ClientSearch from '@/components/Client/ClientSearch/ClientSearch';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useQuery } from 'react-query';

jest.mock('react-query', () => ({
    useQuery: jest.fn(() => ({
        data: {
            clients: [],
        },
        isLoading: false,
        refetch: jest.fn(),
    })),

    useQueryClient: jest.fn().mockReturnValue({
        resetQueries: jest.fn(),
    }),
}));

jest.mock('@/hooks/index', () => ({
    useAlert: jest.fn(() => [{}, jest.fn()]),
}));

describe('Client Info Form Component', () => {
    it('renders correctly without initial data', async () => {
        render(<ClientSearch />);
        const message = screen.getByText('No Matching Clients');
        expect(message).toBeInTheDocument();
    });

    it('renders correctly with initial data', async () => {
        (useQuery as jest.Mock).mockImplementation((args) => {
            const { queryFn } = args;
            const refetch = jest.fn(() => queryFn());
            return { data: queryFn(), isLoading: false, refetch };
        });
        render(<ClientSearch />);
        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);
    });

    // TODO: Write tests to handle queryFn coverage
});
