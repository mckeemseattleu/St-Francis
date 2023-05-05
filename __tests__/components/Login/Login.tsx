import '@testing-library/jest-dom';
import Login from '@/components/Login/Login';
import { fireEvent, render, screen } from '@testing-library/react';
import { useAuth } from '@/hooks/index';

jest.mock('@/hooks/index', () => ({
    useAuth: jest.fn(),
}));

describe('Login', () => {
    it('should render signin button and execute login when click', () => {
        (useAuth as jest.Mock).mockReturnValue({
            signIn: jest.fn(),
        });
        render(<Login />);
        const signinButton = screen.getByRole('button', {
            name: /sign in with/i,
        });
        expect(signinButton).toBeInTheDocument();
        fireEvent.click(signinButton);
        expect(useAuth().signIn).toHaveBeenCalled();
    });

    it('should render signout button and execute logout when click', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isSignedIn: true,
            signOut: jest.fn(),
        });
        render(<Login />);
        const signoutButton = screen.getByRole('button', {
            name: /sign out/i,
        });
        expect(signoutButton).toBeInTheDocument();
        fireEvent.click(signoutButton);
        expect(useAuth().signOut).toHaveBeenCalled();
    });
});
