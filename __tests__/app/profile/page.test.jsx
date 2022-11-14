import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../../../app/profile/[userId]/page';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(),
}));

describe('Profile page', () => {
    it('renders a title', () => {
        render(<Profile params={{ userId: '1234' }} />);

        const title = screen.getByRole('heading', {
            name: 'Profile',
        });

        expect(title).toBeInTheDocument();
    });
});
