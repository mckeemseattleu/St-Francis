import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../../../components/NavBar/NavBar';
// Fake Login component
jest.mock('../../../components/Login/Login');

describe('NavBar', () => {
    it('renders a link to homepage', () => {
        // global.window = { location: { pathname: 'http://localhost/test' } };

        render(<NavBar />);

        const homeLink = screen.getByRole('button', { name: 'Home' });

        fireEvent.click(homeLink);
        // expect(global.window.location.pathname).not.toContain('/test');
    });

    it('renders a button to checked in page', () => {
        render(<NavBar />);

        const homeLink = screen.getByRole('button', {
            name: 'Checked in Clients',
        });

        fireEvent.click(homeLink);

        // expect(global.window.location.href).toContain('/checkedin');
    });

    it('renders a button to settings page', () => {
        render(<NavBar />);

        const homeLink = screen.getByRole('button', { name: 'Settings' });

        fireEvent.click(homeLink);

        // expect(global.window.location.href).toContain('/settings');
    });
});
