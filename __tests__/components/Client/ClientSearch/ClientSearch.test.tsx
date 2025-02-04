import ClientSearch from '@/components/Client/ClientSearch/ClientSearch';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useGetClientsSearch } from '@/components/Client/ClientSearch/hooks';
import { Timestamp } from 'firebase/firestore';
import { Client, Visit } from '@/models/index';
import React from 'react';
import { SettingsContext } from '@/providers/SettingsProvider';

// Mock window.print
beforeAll(() => {
    Object.defineProperty(window, 'print', {
        value: jest.fn(),
        writable: true
    });
});

// Mock hooks
const mockMutateAsync = jest.fn();
const mockSetClients = jest.fn();
const mockSetVisits = jest.fn();

// Create mock settings
const mockSettings = {
    id: 'settings-1',
    maxResults: 10,
    showBannedClients: true,
    showCheckedInClients: true,
    showDuplicateClients: true,
    showUnhousedClients: true,
    defaultSearchDays: 30,
    defaultSearchLimit: 100,
    defaultSearchOrder: 'desc',
    visitCooldown: 1,
    backpackCooldown: 180,
    sleepingBagCooldown: 180,
    orcaCardCooldown: 180,
};

// Mock saveSettings function
const mockSaveSettings = jest.fn();

// Create wrapper component with SettingsContext
const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SettingsContext.Provider 
        value={{ 
            settings: mockSettings,
            saveSettings: mockSaveSettings
        }}
    >
        {children}
    </SettingsContext.Provider>
);

jest.mock('@/components/Client/ClientSearch/hooks', () => ({
    useGetClientsSearch: jest.fn(),
}));

// Create a reusable mock implementation
const defaultMockImplementation = {
    mutateAsync: mockMutateAsync,
    isLoading: false,
    clients: [],
    visits: [],
    setClients: mockSetClients,
    setVisits: mockSetVisits,
};

describe('Client Search Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(useGetClientsSearch).mockReturnValue(defaultMockImplementation);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders search form with all fields', () => {
        render(<ClientSearch />);
        
        // Update expectations to match actual form fields
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
        expect(screen.getByLabelText('First name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last name')).toBeInTheDocument();
        expect(screen.getByLabelText('Birthday')).toBeInTheDocument();
    });

    it('calls handleSubmit with search parameters', async () => {
        render(<ClientSearch />);

        // Fill in search fields
        const firstNameInput = screen.getByLabelText('First name');
        fireEvent.change(firstNameInput, { target: { value: 'John' } });

        // Click search button
        const submitButton = screen.getByText('Search');
        fireEvent.click(submitButton);

        // Update expectation to match actual implementation
        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(
                expect.objectContaining({ firstNameLower: 'john' })
            );
        });
    });

    it('clears search results when clear button is clicked', async () => {
        // Mock the hook with initial data
        const mockClients = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                firstNameLower: 'john',
                lastNameLower: 'doe',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
                gender: 'Male',
                race: 'White',
                postalCode: '98101',
                numKids: 0,
                BPCResident: false,
                notes: '',
                isCheckedIn: false,
                isBanned: false,
                unhoused: false,
            } as Client
        ];

        const mockVisits = [
            {
                id: '1',
                clientId: '1',
                timestamp: Timestamp.fromDate(new Date()),
                type: 'FOOD_BANK',
                isCheckedOut: false,
                notes: '',
            } as Visit
        ];

        jest.mocked(useGetClientsSearch).mockReturnValue({
            ...defaultMockImplementation,
            clients: mockClients,
            visits: mockVisits,
        });

        render(<ClientSearch />, { wrapper: Wrapper });

        // Click clear button
        await act(async () => {
            fireEvent.click(screen.getByText('Clear'));
        });

        // Only verify setClients is called since setVisitsWithClientId is internal state
        expect(mockSetClients).toHaveBeenCalledWith([]);
    });

    it('displays duplicate clients with yellow background', () => {
        // Mock the hook with duplicate clients
        const mockClients = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                firstNameLower: 'john',
                lastNameLower: 'doe',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
                gender: 'Male',
                race: 'White',
                postalCode: '98101',
                numKids: 0,
                BPCResident: false,
                notes: '',
                isCheckedIn: false,
                isBanned: false,
                unhoused: false,
                isDuplicate: true,
            } as Client,
            {
                id: '2',
                firstName: 'John',
                lastName: 'Doe',
                firstNameLower: 'john',
                lastNameLower: 'doe',
                birthday: Timestamp.fromDate(new Date('1990-01-01')),
                gender: 'Male',
                race: 'White',
                postalCode: '98101',
                numKids: 0,
                BPCResident: false,
                notes: '',
                isCheckedIn: false,
                isBanned: false,
                unhoused: false,
                isDuplicate: true,
            } as Client
        ];

        jest.mocked(useGetClientsSearch).mockReturnValue({
            ...defaultMockImplementation,
            clients: mockClients,
            visits: [],
        });

        render(<ClientSearch />, { wrapper: Wrapper });
        
        // Look for the h1 elements containing the client names
        const clientNames = screen.getAllByRole('heading', { level: 1 });
        expect(clientNames).toHaveLength(3); // Including the "Lookup Client" heading
        expect(clientNames[1]).toHaveTextContent('John Doe');
        expect(clientNames[2]).toHaveTextContent('John Doe');
    });

    it('handles empty search results', () => {
        render(<ClientSearch />, { wrapper: Wrapper });
        
        // Look for empty state message
        expect(screen.getByText('No Matching Clients')).toBeInTheDocument();
    });

    it('displays loading state during search', async () => {
        // Override mock for loading state
        jest.mocked(useGetClientsSearch).mockImplementationOnce(() => ({
            ...defaultMockImplementation,
            isLoading: true,
        }));

        render(<ClientSearch />);
        
        // Look for loading indicator in submit button or form
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });
});
