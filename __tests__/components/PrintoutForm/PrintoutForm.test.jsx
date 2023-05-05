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

describe('Printout Form page', () => {
    it('renders content correctly', async () => {
        const mockVisitDoc = {
            clothingMen: true,
            clothingWomen: true,
            clothingBoy: true,
            clothingGirl: true,
            household: 'household item text',
            notes: 'notes text',
            createdAt: {
                seconds: 0,
                toDate: jest.fn(() => ({ toDateString: () => 'Date' })),
            },
            backpack: true,
            sleepingBag: true,
            busTicket: 1,
            giftCard: 2,
            diaper: 3,
            financialAssistance: 4,
        };

        await act(async () => {
            render(
                <PrintoutForm
                    clientData={mockClientData}
                    visitData={mockVisitDoc}
                    data={[
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
                    ]}
                />
            );
        });

        const title = screen.queryByRole('heading', {
            name: `${mockClientData.firstName} ${mockClientData.lastName}'s Shopping List`,
        });

        const checkboxSectionTitle = screen.queryByRole('heading', {
            name: 'Clothing',
        });

        const textSectionTitle = screen.queryByRole('heading', {
            name: 'Household',
        });

        expect(title).toBeInTheDocument();
        expect(checkboxSectionTitle).toBeInTheDocument();
        expect(textSectionTitle).toBeInTheDocument();
    });

    it('handles missing date', async () => {
        const mockVisitDoc = {
            clothingMen: true,
            clothingWomen: true,
            clothingBoy: true,
            clothingGirl: true,
            household: 'household item text',
            notes: 'notes text',
            createdAt: null,
            backpack: true,
            sleepingBag: true,
            busTicket: 1,
            giftCard: 2,
            diaper: 3,
            financialAssistance: 4,
        };

        await act(async () => {
            render(
                <PrintoutForm
                    clientData={mockClientData}
                    visitData={mockVisitDoc}
                    data={[
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
                    ]}
                />
            );
        });

        const expectedDate = new Date(new Date()).toDateString();

        const date = screen.getByRole('heading', {
            name: expectedDate,
        });

        expect(date).toBeInTheDocument();
    });
});
