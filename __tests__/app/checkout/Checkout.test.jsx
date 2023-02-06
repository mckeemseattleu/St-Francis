import CheckOut from '../../../app/checkout/[userId]/page';
import { act, render } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { getDoc } from 'firebase/firestore';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('firebase/firestore', () => ({
    __esModule: true,
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
}));

const mockClientDoc = {
    id: 'abcd',
    firstName: 'First',
    lastName: 'Last',
    birthday: 'Birthday',
    notes: 'Notes',
    isCheckedIn: true,
    isBanned: false,
};

describe('Checkout page', () => {
    // Mock router for router.push()
    const mockRouter = { push: jest.fn() };

    useRouter.mockReturnValue(mockRouter);

    it('renders correctly with valid client', async () => {
        getDoc.mockImplementation(() => ({
            exists: () => true,
            data: () => mockClientDoc,
        }));

        await act(async () => {
            render(<CheckOut params={{ userId: 'abcd' }} />);
        });

        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('redirects with invalid client', async () => {
        getDoc.mockImplementation(() => ({
            exists: () => false,
            data: () => {
                return null;
            },
        }));

        await act(async () => {
            render(<CheckOut params={{ userId: 'abcd' }} />);
        });

        expect(mockRouter.push).toHaveBeenCalled();
    });
});
