import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrintoutForm from '@/components/PrintoutForm/PrintoutForm';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

const mockClientData = {
    firstName: 'First',
    lastName: 'Last',
    firstNameLower: 'first',
    lastNameLower: 'last',
    middleInitial: 'A',
    birthday: 'Birthday',
    gender: 'Gender',
    race: 'Race',
    postalCode: '123456',
    numKids: 0,
    notes: 'Notes',
    isCheckedIn: true,
    isBanned: false,
    dateLastVisit: { seconds: 0 },
    dateLastBackpack: { seconds: 0 },
    dateLastSleepingBag: { seconds: 0 },
};

const mockVisitDoc = {
    clothingMen: true,
    clothingWomen: true,
    clothingBoy: true,
    clothingGirl: true,
    household: 'household item text',
    notes: 'notes text',
    createdAt: {
        seconds: 0,
        toDate: jest.fn(() => new Date('2024-01-31')),
    },
    backpack: true,
    sleepingBag: true,
    busTicket: 1,
    giftCard: 2,
    diaper: 3,
    financialAssistance: 4,
};

const mockFormData = [
    {
        title: 'Clothing',
        type: 'checkbox',
        items: ['Mens', 'Womens'],
    },
    {
        title: 'Household',
        type: 'text',
        items: ['Pots'],
    },
];

describe('Printout Form page', () => {
    it('renders header content correctly', async () => {
        await act(async () => {
            render(
                <PrintoutForm
                    clientData={mockClientData}
                    visitData={mockVisitDoc}
                    data={mockFormData}
                />
            );
        });

        // Check client name
        expect(screen.getByText(`${mockClientData.firstName} ${mockClientData.lastName}`)).toBeInTheDocument();
        
        // Check Shopping List title
        expect(screen.getByText('Shopping List')).toBeInTheDocument();
    });

    it('renders sections correctly', async () => {
        await act(async () => {
            render(
                <PrintoutForm
                    clientData={mockClientData}
                    visitData={mockVisitDoc}
                    data={mockFormData}
                />
            );
        });

        // Check section titles
        expect(screen.getByText('CLOTHING')).toBeInTheDocument();
        expect(screen.getByText('SPECIAL REQUESTS')).toBeInTheDocument();
        expect(screen.getByText('HOUSEHOLD ITEMS')).toBeInTheDocument();
        expect(screen.getByText('NOTES')).toBeInTheDocument();

        // Check section content
        expect(screen.getByText('Men:')).toBeInTheDocument();
        expect(screen.getByText('Women:')).toBeInTheDocument();
        expect(screen.getByText('Backpack ✓')).toBeInTheDocument();
        expect(screen.getByText('household item text')).toBeInTheDocument();
        expect(screen.getByText('notes text')).toBeInTheDocument();
    });

    it('handles missing date', async () => {
        const mockVisitDocNoDate = {
            ...mockVisitDoc,
            createdAt: null
        };

        await act(async () => {
            render(
                <PrintoutForm
                    clientData={mockClientData}
                    visitData={mockVisitDocNoDate}
                    data={mockFormData}
                />
            );
        });

        // Verify component still renders without date
        expect(screen.getByText(`${mockClientData.firstName} ${mockClientData.lastName}`)).toBeInTheDocument();
        expect(screen.getByText('Shopping List')).toBeInTheDocument();
    });
});
