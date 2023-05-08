import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Visit from '@/app/profile/[userId]/visit/[visitId]/page';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { deleteVisit, getVisit, updateVisit } from '@/utils/index';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(),
}));

jest.mock('@/hooks/index', () => ({
    __esModule: true,
    useQueryCache: jest.fn(() => ({
        updateClientCache: jest.fn(),
        updateVisitCache: jest.fn(),
    })),
    useAlert: jest.fn(() => [{}, jest.fn()]),
    useSettings: jest.fn(() => ({ settings: {} })),
}));

jest.mock('react-query', () => ({
    __esModule: true,
    useQuery: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/utils/index', () => ({
    __esModule: true,
    deleteVisit: jest.fn(),
    getVisit: jest.fn(),
    updateVisit: jest.fn(),
}));

beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn(function mock(
        this: HTMLDialogElement
    ) {
        this.open = true;
    });

    HTMLDialogElement.prototype.showModal = jest.fn(function mock(
        this: HTMLDialogElement
    ) {
        this.open = true;
    });

    HTMLDialogElement.prototype.close = jest.fn(function mock(
        this: HTMLDialogElement
    ) {
        this.open = false;
    });
});

const mockVisitDoc = {
    clothingMen: true,
    clothingWomen: true,
    clothingBoy: true,
    clothingGirl: true,
    household: 'household item text',
    notes: 'notes text',
    createdAt: { seconds: 0, toDate: jest.fn(() => 'Date') },
    backpack: true,
    sleepingBag: true,
    busTicket: 1,
    giftCard: 2,
    diaper: 3,
    mensQ: 4,
    womensQ: 5,
    kidsQ: 6,
    financialAssistance: 4,
};

describe('Visit details page', () => {
    // Mock router for router.push()
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useQuery as jest.Mock).mockReturnValue({
        isLoading: false,
        data: mockVisitDoc,
    });

    it('deletes only visit correctly', async () => {
        // Used for initial load of "this" visit
        render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);

        // Click delete button to open confirmation dialog
        const deleteButton = screen.getByRole('button', {
            name: /delete visit/i,
        });
        fireEvent.click(deleteButton);

        // Click confirm delete button
        const confirmDeleteButton = screen.getByRole('button', {
            name: /confirm delete/i,
        });
        fireEvent.click(confirmDeleteButton);

        // Assert we've called deleteVisit()
        expect(deleteVisit).toHaveBeenCalled();

        // TODO: Assert correct updating of fields
    });

    it('deletes one visit with other visits existing correctly', async () => {
        // Used for initial load of "this" visit

        render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        const deleteButton = screen.getByRole('button', {
            name: /delete visit/i,
        });

        fireEvent.click(deleteButton);
        const confirmDeleteButton = screen.getByRole('button', {
            name: /confirm delete/i,
        });
        fireEvent.click(confirmDeleteButton);

        // Assert we've called deleteDoc()
        expect(deleteVisit).toHaveBeenCalled();

        // TODO: Assert correct updating of fields
    });

    it('renders heading correctly', async () => {
        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        const title = screen.queryByRole('heading', { name: 'Visit Details' });

        expect(title).toBeInTheDocument();
    });

    it('displays all requests correctly when requests are true', async () => {
        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

        screen.getByText('Men: 4');
        screen.getByText('Women: 5');
        screen.getByText('Kids: 6');
        screen.getByText('Backpack ✔️');
        screen.getByText('Sleeping Bag ✔️');
        screen.getByText('Bus Tickets: 1');
        screen.getByText('Gift Card: 2');
        screen.getByText('Diapers: 3');
        screen.getByText('Financial Assistance: 4');
        screen.getByText('notes text');
        screen.getByText('household item text');
    });

    it('displays no requests when all requests are false', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            data: {
                ...mockVisitDoc,
                clothingMen: false,
                clothingWomen: false,
                clothingBoy: false,
                clothingGirl: false,
                household: '',
                notes: '',
                backpack: false,
                sleepingBag: false,
                busTicket: 0,
                giftCard: 0,
                diaper: 0,
                financialAssistance: 0,
            },
        });

        await act(async () => {
            render(<Visit params={{ userId: '1234', visitId: 'abcd' }} />);
        });

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
