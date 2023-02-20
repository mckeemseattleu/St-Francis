import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '@/components/NavBar/NavBar';
import { AuthContext } from '@/providers/AuthProvider';

describe('NavBar', () => {
    // setup navbar with auth context for authenticated component
    const NavBarAuth = ({auth=false}) => (
        <AuthContext.Provider value={{
            isSignedIn: auth,   
        }}><NavBar /></AuthContext.Provider>)

    it('renders a link to homepage', () => {
        // global.window = { location: { pathname: 'http://localhost/test' } };
        render(<NavBarAuth />);

        const homeLink = screen.getByRole('img', { name: 'logo' });

        fireEvent.click(homeLink);
        // expect(global.window.location.pathname).not.toContain('/test');
    });

    it('renders a button to checked in page', () => {
        render(<NavBarAuth auth/>);

        const homeLink = screen.getByRole('button', {
            name: 'Checked in Clients',
        });
        fireEvent.click(homeLink);

        // expect(global.window.location.href).toContain('/checkedin');
    });

    it('renders a button to settings page', () => {

        render(<NavBarAuth auth/>);

        const homeLink = screen.getByRole('button', { name: 'Settings' });

        fireEvent.click(homeLink);

        // expect(global.window.location.href).toContain('/settings');
    });
});
