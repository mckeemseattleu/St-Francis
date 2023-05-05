import Providers from '@/providers/index';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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

jest.mock('@/utils/index', () => ({
    getSettings: jest.fn(() => {}),
    updateSettings: jest.fn(() => {}),
}));

describe('Providers', () => {
    it('renders children properly with all providers', () => {
        render(<Providers>mock children</Providers>);
        expect(screen.getByText('mock children')).toBeInTheDocument();
    });
});
