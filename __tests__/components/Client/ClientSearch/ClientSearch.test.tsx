import ClientSearch from '@/components/Client/ClientSearch/ClientSearch';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useGetClientsSearch } from '@/components/Client/ClientSearch/hooks';
import React from 'react';

jest.mock('@/components/Client/ClientSearch/hooks', () => ({
    useGetClientsSearch: jest.fn(() => ({
        mutateAsync: jest.fn(),
        isLoading: false,
        clients: [],
        visits: [],
        setClients: jest.fn(),
    })),
}));

jest.mock('@/hooks/index', () => ({
    useAlert: jest.fn(() => [{}, jest.fn()]),
}));

describe('Client Info Form Component', () => {
    it('calls handleSubmit with correct arguments', async () => {
        const { mutateAsync } = useGetClientsSearch();
        render(<ClientSearch />);
        const formFields = { name: 'John' };
        const submitButton = screen.getByText('Search');
        fireEvent.click(submitButton);
        waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledWith(formFields);
        });
    });

    it('calls handleClear and sets clients to an empty array', async () => {
        const { setClients } = useGetClientsSearch();
        render(<ClientSearch />);
        const clearButton = screen.getByText('Clear');
        fireEvent.click(clearButton);
        waitFor(() => {
            expect(setClients).toHaveBeenCalledWith([]);
        });
    });
});
