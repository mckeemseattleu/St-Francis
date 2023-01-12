import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Visit from '../../../../app/profile/[userId]/visit/[visitId]/page';

import { deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(),
}));

// Mock the required firestore functionality in the component
jest.mock('firebase/firestore', () => ({
    __esModule: true,
    // Needed because of firebase.ts import
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(() => ({
        exists: jest.fn(),
        data: {},
    })),
    getDocs: jest.fn(() => [
        {
            exists: jest.fn(),
            data: {},
        },
    ]),
    deleteDoc: jest.fn(),
    collection: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    updateDoc: jest.fn(),
    deleteField: jest.fn(),
}));

jest.mock('firebase/compat/app', () => ({
    __esModule: true,
    default: {
        apps: [],
        initializeApp: () => {},
        auth: () => {},
    },
}));

const mockVisitDoc = {
    clothingMen: true,
    clothingWomen: true,
    clothingBoy: true,
    clothingGirl: true,
    household: 'household item text',
    notes: 'notes text',
    timestamp: { seconds: 0, toDate: jest.fn(() => 'Date') },
    backpack: true,
    sleepingBag: true,
    busTicket: 1,
    giftCard: 2,
    diaper: 3,
    financialAssistance: 4,
};

describe('Visit details page', () => {
    // Mock returning some sample data
    getDoc.mockImplementation(() => ({
        // Needed for clientDoc.exists() check
        exists: () => {
            return true;
        },
        // Needed for .data() calls
        data: () => ({}),
    }));

    // Mock router for router.push()
    const mockRouter = { push: jest.fn() };

    useRouter.mockReturnValue(mockRouter);

    it('deletes only visit correctly', async () => {
        // Used for initial load of "this" visit
        getDoc.mockImplementation(() => ({
            exists: () => true,
            data: () => mockVisitDoc,
        }));

        // Used after deleteVisit() deletes "this" visit and is requesting most
        // recent visit other than "this"
        getDocs.mockImplementation(() => ({
            docs: [],
        }));

        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        await act(async () => {
            const deleteButton = screen.getByRole('button', {
                name: 'Delete visit',
            });

            fireEvent.click(deleteButton);
        });

        // Assert that we're back to the profile page
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/1234');

        // Assert we've called deleteDoc()
        expect(deleteDoc).toHaveBeenCalled();
    });

    it('deletes one visit with other visits existing correctly', async () => {
        // Used for initial load of "this" visit
        getDoc.mockImplementation(() => ({
            exists: () => true,
            data: () => mockVisitDoc,
        }));

        // Used after deleteVisit() deletes "this" visit and is requesting most
        // recent visit other than "this"
        getDocs.mockImplementation(() => ({
            docs: [
                {
                    exists: () => true,
                    data: () => mockVisitDoc,
                },
            ],
        }));

        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        await act(async () => {
            const deleteButton = screen.getByRole('button', {
                name: 'Delete visit',
            });

            fireEvent.click(deleteButton);
        });

        // Assert that we're back to the profile page
        expect(mockRouter.push).toHaveBeenCalledWith('/profile/1234');

        // Assert we've called deleteDoc()
        expect(deleteDoc).toHaveBeenCalled();
    });

    it('renders heading correctly', async () => {
        render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);

        const title = screen.queryByRole('heading', { name: 'Visit Details' });

        expect(title).toBeInTheDocument();
    });

    it('redirects to profile when visit doc not found', async () => {
        // Return that the visit doc doesn't exist
        getDoc.mockImplementation(() => ({
            exists: () => {
                return false;
            },
        }));

        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        expect(mockRouter.push).toHaveBeenCalledWith('/profile/1234');
    });

    it('displays all requests correctly when requests are true', async () => {
        getDoc.mockImplementation(() => ({
            exists: () => true,
            data: () => ({
                clothingMen: true,
                clothingWomen: true,
                clothingBoy: true,
                clothingGirl: true,
                household: 'household item text',
                notes: 'notes text',
                timestamp: { seconds: 0 },
                backpack: true,
                sleepingBag: true,
                busTicket: 1,
                giftCard: 2,
                diaper: 3,
                financialAssistance: 4,
            }),
        }));

        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        screen.getByText(
            `${new Date(0).toDateString()} - ${new Date(0).toTimeString()}`
        );
        screen.getByText('Men');
        screen.getByText('Women');
        screen.getByText('Kids (boy)');
        screen.getByText('Kids (girl)');
        screen.getByText('Backpack');
        screen.getByText('Sleeping Bag');
        screen.getByText('Bus Tickets: 1');
        screen.getByText('Gift Card: 2');
        screen.getByText('Diapers: 3');
        screen.getByText('Financial Assistance: 4');
        screen.getByText('notes text');
        screen.getByText('household item text');
    });

    it('displays no requests when all requests are false', async () => {
        getDoc.mockImplementation(() => ({
            exists: () => true,
            data: () => ({
                clothingMen: false,
                clothingWomen: false,
                clothingBoy: false,
                clothingGirl: false,
                household: '',
                notes: '',
                timestamp: { seconds: 0 },
                backpack: false,
                sleepingBag: false,
                busTicket: 0,
                giftCard: 0,
                diaper: 0,
                financialAssistance: 0,
            }),
        }));

        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        screen.getByText(
            `${new Date(0).toDateString()} - ${new Date(0).toTimeString()}`
        );
        expect(screen.queryByText('Men')).not.toBeInTheDocument();
        expect(screen.queryByText('Women')).not.toBeInTheDocument();
        expect(screen.queryByText('Kids (boy)')).not.toBeInTheDocument();
        expect(screen.queryByText('Kids (girl)')).not.toBeInTheDocument();
        expect(screen.queryByText('Backpack')).not.toBeInTheDocument();
        expect(screen.queryByText('Sleeping Bag')).not.toBeInTheDocument();
        expect(screen.queryByText('Bus Tickets')).not.toBeInTheDocument();
        expect(screen.queryByText('Gift Card')).not.toBeInTheDocument();
        expect(screen.queryByText('Diapers')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Financial Assistance: 4')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('notes text')).not.toBeInTheDocument();
        expect(
            screen.queryByText('household item text')
        ).not.toBeInTheDocument();
    });
});
