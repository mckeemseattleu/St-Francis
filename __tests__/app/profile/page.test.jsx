import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../../../app/profile/[userId]/page';

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

    it('renders name correctly', async () => {
        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });

        const firstName = screen.getByRole('heading', {
            name: 'testFirst t testLast',
        });

        expect(firstName).toBeInTheDocument();
    });
});
