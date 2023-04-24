import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useQuery } from 'react-query';
import renderer from 'react-test-renderer';
import Checkin from '../../../app/checkin/[userId]/page';

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

describe('CheckedIn', () => {
    const mockClient = {
        id: 'abcd',
        firstName: 'First',
        lastName: 'Last',
        birthday: 'Birthday',
        notes: 'Notes',
        isCheckedIn: true,
        isBanned: false,
    };

    it('should render a spinner when client data is fetching', () => {
        const queryResult = {
            isLoading: true,
            data: undefined,
        };
        useQuery.mockReturnValue(queryResult);
        const { container } = render(<Checkin params={{ userId: 'abcd' }} />);
        expect(container.innerHTML).toContain('spinner');
    });

    it('should render title when clientData fetched', () => {
        const queryResult = {
            isLoading: false,
            data: mockClient,
        };
        useQuery.mockReturnValue(queryResult);
        render(<Checkin params={{ userId: mockClient.id }} />);
        const title = screen.getByRole('heading', {
            name: 'Check-in Page',
        });
        expect(title).toBeInTheDocument();
    });

    it('shoudld match snapshot when client data is fetching', () => {
        const queryResult = {
            isLoading: true,
            data: undefined,
        };
        useQuery.mockReturnValue(queryResult);
        const tree = renderer
            .create(<Checkin params={{ userId: 'abcd' }} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should match snapshot when clientData fetched', () => {
        const queryResult = {
            isLoading: false,
            data: mockClient,
        };

        useQuery.mockReturnValue(queryResult);
        const tree = renderer
            .create(<Checkin params={{ userId: mockClient.id }} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
