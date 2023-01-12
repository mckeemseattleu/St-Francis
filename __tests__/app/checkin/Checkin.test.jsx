import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkin from '../../../app/checkin/[userId]/page';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('CheckedIn', () => {
    it('renders a title', () => {
        render(<Checkin params={{ userId: 'abcd' }} />);

        const title = screen.getByRole('heading', {
            name: 'Check-in Page',
        });

        expect(title).toBeInTheDocument();
    });
});
