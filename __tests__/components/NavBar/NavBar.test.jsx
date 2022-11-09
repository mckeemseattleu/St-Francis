import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../../../components/NavBar/NavBar';

// Fake Login component
jest.mock('../../../components/Login/Login');

describe('NavBar', () => {
    it('renders a link to homepage', () => {
        render(<NavBar />);

        const homeLink = screen.getByText('Home').closest('a');

        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders a link to checked in page', () => {
        render(<NavBar />);

        const homeLink = screen.getByText('Checked in Clients').closest('a');

        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/checkedin');
    });
});
