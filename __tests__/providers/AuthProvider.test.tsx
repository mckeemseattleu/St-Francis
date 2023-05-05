import { useAuth } from '@/hooks/useAuth';
import AuthProvider from '@/providers/AuthProvider';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/firebase/firebase', () => ({
    signInWithPopup: jest.fn(),
    firebase: {
        auth: () => ({
            onAuthStateChanged: jest.fn((callback) => {
                callback();
                return jest.fn();
            }),
            signOut: jest.fn(),
        }),
    },
}));

const TestComponent = () => {
    const { signIn, signOut } = useAuth();
    return (
        <>
            <button onClick={() => signIn()}>Sign In</button>
            <button onClick={() => signOut()}>Sign Out</button>
        </>
    );
};

describe('AuthProvider', () => {
    it('provides proper signin signout functionalities', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        const signinBtn = screen.getByText('Sign In');
        const signoutBtn = screen.getByText('Sign Out');
        fireEvent.click(signinBtn);
        fireEvent.click(signoutBtn);
    });
});
