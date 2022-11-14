import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../../../app/profile/[userId]/page';

import { getDoc } from 'firebase/firestore';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
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
}));

jest.mock('firebase/compat/app', () => ({
    __esModule: true,
    default: {
        apps: [],
        initializeApp: () => {},
        auth: () => {},
    },
}));

describe('Profile page', () => {
    it('renders a title', () => {
        render(<Profile params={{ userId: '1234' }} />);

        const title = screen.getByRole('heading', {
            name: 'Profile',
        });

        expect(title).toBeInTheDocument();
    });

    it('renders name correctly with valid id', async () => {
        // Mock returning some sample data
        getDoc.mockImplementation(() => ({
            // Needed for clientDoc.exists() check
            exists: () => {
                return true;
            },
            // Needed for clientDoc.data().whatever calls
            data: () => ({
                firstName: 'testFirst',
                lastName: 'testLast',
                middleInitial: 't',
                birthday: '',
                gender: '',
                race: '',
                postalCode: '',
                numKids: 2,
                notes: '',
                isCheckedIn: false,
                isBanned: false,
            }),
        }));

        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });

        const firstName = screen.getByRole('heading', {
            name: 'testFirst t testLast',
        });

        expect(firstName).toBeInTheDocument();
    });

    it('redirects with invalid id', async () => {
        // Mock getDoc()'s exists() returns false
        getDoc.mockImplementation(() => ({
            exists: () => {
                return false;
            },
        }));

        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });

        const firstName = screen.queryByRole('heading', {
            name: 'testFirst t testLast',
        });

        expect(firstName).not.toBeInTheDocument();
    });
});
