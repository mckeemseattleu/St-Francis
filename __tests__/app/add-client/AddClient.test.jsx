import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddClient from '../../../app/add-client/page';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('Add Client page', () => {
    it('renders child component correctly', () => {
        render(<AddClient />);

        const title = screen.getByRole('heading', { name: 'New Client' });

        expect(title).toBeInTheDocument();
    });
});
