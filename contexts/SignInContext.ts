import { createContext } from 'react';

interface SignInContext {
    isSignedIn: boolean;
    setIsSignedIn: Function | null;
}

export const SignInContext = createContext<SignInContext>({
    isSignedIn: false,
    setIsSignedIn: null,
});
