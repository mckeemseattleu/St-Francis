import { render } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import CheckOut from '../../../app/checkout/[userId]/page';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
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

describe('Checkout page', () => {
    // Mock router for router.push()
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    const mockClient = {
        id: 'abcd',
        firstName: 'First',
        lastName: 'Last',
        birthday: 'Birthday',
        notes: 'Notes',
        isCheckedIn: true,
        isBanned: false,
    };

    it('renders correctly with checked in client', async () => {
        const queryResult = {
            isLoading: false,
            data: { ...mockClient, isCheckedIn: true },
        };
        (useQuery as jest.Mock).mockReturnValue(queryResult);
        const { container } = render(
            <CheckOut params={{ userId: mockClient.id }} />
        );
        expect(container.innerHTML).toContain('Checked In');
    });

    it('renders correctly with not checked in client', async () => {
        const queryResult = {
            isLoading: false,
            data: { ...mockClient, isCheckedIn: false },
        };
        (useQuery as jest.Mock).mockReturnValue(queryResult);

        const { container } = render(
            <CheckOut params={{ userId: mockClient.id }} />
        );
        expect(container.innerHTML).toContain('Not Checked In');
    });
});
