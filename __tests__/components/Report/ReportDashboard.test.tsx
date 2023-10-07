import ReportDashboard from '@/components/Report/ReportDashboard';
import { Client } from '@/models/index';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

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

describe('Report Dashboard Component', () => {
    const mockClient = {
        id: '1',
        firstName: 'First',
        lastName: 'Last',
        firstNameLower: 'first',
        lastNameLower: 'last',
        middleInitial: 'M',
        birthday: Timestamp.fromDate(new Date('2003-12-13')),
        gender: 'Male',
        race: 'American Indian or Alaska Native',
        postalCode: '123456',
        numKids: 2,
        BPCResident: true,
        notes: 'Notes',
        isCheckedIn: false,
        isBanned: false,
        unhoused: false,
    } as Client;

    it('should renders Report Dashboard correctly', async () => {
        render(<ReportDashboard clients={[mockClient]}/>);
        const kidCount = screen.getByTestId('kid-count')
        const clientCount = screen.getByTestId('client-count')
        const bpcResidentCount = screen.getByTestId('bpc-resident-count')
        expect(kidCount.innerHTML).toBe('2');
        expect(clientCount.innerHTML).toBe('1');
        expect(bpcResidentCount.innerHTML).toBe('1');
    });
});
