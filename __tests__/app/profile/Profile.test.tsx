import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import Profile from '../../../app/profile/[userId]/page';
import { useQuery } from 'react-query';

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

global.scrollTo = jest.fn();

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
    getDocs: jest.fn(() => []),
    collection: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    query: jest.fn(),
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
    const mockClient = {
        id: 'abcd',
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
    };
    const mockUseQueryData = (data: any) => {
        (useQuery as jest.Mock).mockImplementation((params) => ({
            isLoading: false,
            data: params.length === 2 ? data : [],
        }));
    };

    it('renders name correctly with valid id', async () => {
        mockUseQueryData(mockClient);
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
        mockUseQueryData(undefined);

        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });
        const firstName = screen.queryByRole('heading', {
            name: 'testFirst t testLast',
        });
        expect(firstName).not.toBeInTheDocument();
    });
    it('displays checked in status correctly with valid, checked in client', async () => {
        // Mock returning some sample data
        mockUseQueryData({
            ...mockClient,
            isCheckedIn: true,
        });
        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });
        const checkedInStatus = screen.getByText('Checked In');
        expect(checkedInStatus).toBeInTheDocument();
    });

    it('displays checked in status correctly with valid, checked out client', async () => {
        // Mock returning some sample data
        mockUseQueryData({
            ...mockClient,
            isCheckedIn: false,
        });
        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });
        const checkedInStatus = screen.getByText('Not Checked In');
        expect(checkedInStatus).toBeInTheDocument();
    });

    it('displays banned status correctly with valid, banned client', async () => {
        // Mock returning some sample data
        mockUseQueryData({
            ...mockClient,
            isBanned: true,
        });
        // TODO: Gives warning because of async useEffect()
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });
        const checkedInStatus = screen.getByText('Banned');
        expect(checkedInStatus).toBeInTheDocument();
    });

    it('displays not checked in status correctly', async () => {
        mockUseQueryData({
            ...mockClient,
            isCheckedIn: false,
        });
        render(<Profile params={{ userId: '1234' }} />);
        expect(screen.getByText('Not Checked In')).toBeInTheDocument();
    });

    it('displays clients statuses correctly', async () => {
        mockUseQueryData({
            ...mockClient,
            isCheckedIn: true,
            isBanned: true,
            unhoused: true,
        });
        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });
        expect(screen.getByText('Banned')).toBeInTheDocument();
        expect(screen.getByText('Checked In')).toBeInTheDocument();
        expect(screen.getByText('Unhoused')).toBeInTheDocument();
    });

    it('displays birthday as UTC date', async () => {
        const { Timestamp } = jest.requireActual('firebase/firestore');

        const testBirthday = '01/15/1990';
        const [month, day, year] = testBirthday.split('/');
        const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        const birthdayTimestamp = Timestamp.fromDate(date);

        mockUseQueryData({
            ...mockClient,
            birthday: birthdayTimestamp,
        });

        await act(async () => {
            render(<Profile params={{ userId: '1234' }} />);
        });

        const birthdayElement = screen.getByText(testBirthday);
        expect(birthdayElement).toBeInTheDocument();
    });
});
