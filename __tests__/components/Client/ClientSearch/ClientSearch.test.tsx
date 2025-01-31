import ClientSearch from '@/components/Client/ClientSearch/ClientSearch';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useGetClientsSearch } from '@/components/Client/ClientSearch/hooks';
import React from 'react';

// Mock hooks
const mockMutateAsync = jest.fn();
const mockSetClients = jest.fn();
const mockSetVisitsWithClientId = jest.fn();

jest.mock('@/components/Client/ClientSearch/hooks', () => ({
    useGetClientsSearch: jest.fn(() => ({
        mutateAsync: mockMutateAsync,
        isLoading: false,
        clients: [],
        visits: [],
        setClients: mockSetClients,
        setVisitsWithClientId: mockSetVisitsWithClientId,
    })),
}));

jest.mock('@/hooks/index', () => ({
    useAlert: jest.fn(() => [{}, jest.fn()]),
}));

describe('Client Search Component', () => {
    beforeEach(() => {
        // Clear mock function calls before each test
        jest.clearAllMocks();
    });

    it('renders search form with all fields', () => {
        render(<ClientSearch />);
        
        // Check for essential form elements
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    });

    it('calls handleSubmit with search parameters', async () => {
        render(<ClientSearch />);

        // Fill in search field
        const searchInput = screen.getByPlaceholderText('Search by name');
        fireEvent.change(searchInput, { target: { value: 'John' } });

        // Click search button
        const submitButton = screen.getByText('Search');
        fireEvent.click(submitButton);

        // Verify search was triggered with correct parameters
        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'John' })
            );
        });
    });

    it('clears search results when clear button is clicked', async () => {
        render(<ClientSearch />);

        // Click clear button
        const clearButton = screen.getByText('Clear');
        fireEvent.click(clearButton);

        // Verify clearing actions
        await waitFor(() => {
            expect(mockSetClients).toHaveBeenCalledWith([]);
            expect(mockSetVisitsWithClientId).toHaveBeenCalledWith([]);
        });
    });

    it('handles empty search results', async () => {
        // Mock empty search results
        (useGetClientsSearch as jest.Mock).mockImplementation(() => ({
            mutateAsync: mockMutateAsync,
            isLoading: false,
            clients: [],
            visits: [],
            setClients: mockSetClients,
            setVisitsWithClientId: mockSetVisitsWithClientId,
        }));

        render(<ClientSearch />);
        
        // Verify empty state message
        expect(screen.getByText('No Matching Clients')).toBeInTheDocument();
    });

    it('displays loading state during search', async () => {
        // Mock loading state
        (useGetClientsSearch as jest.Mock).mockImplementation(() => ({
            mutateAsync: mockMutateAsync,
            isLoading: true,
            clients: [],
            visits: [],
            setClients: mockSetClients,
            setVisitsWithClientId: mockSetVisitsWithClientId,
        }));

        render(<ClientSearch />);
        
        // Verify loading indicator
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
});
