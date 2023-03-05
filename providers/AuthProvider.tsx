import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import 'firebase/compat/auth';
import { createContext, useEffect, useState } from 'react';
import { firebase } from '../firebase/firebase';

const provider = new GoogleAuthProvider();

interface AuthContext {
    isSignedIn: boolean;
    signIn: Function;
    signOut: Function;
    isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider(props: AuthProviderProps) {
    const { children } = props;
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    /**
     * Sign in/Sign up with Google provider.
     * User credential can be retrived from the promise
     * https://firebase.google.com/docs/auth/web/google-signin
     *
     * Todo: Set up a global alert system to handle authentification errors
     */
    const signIn = async () => {
        try {
            await signInWithPopup(firebase.auth(), provider);
        } catch (e) {}
    };

    // Sign out.
    const signOut = () => firebase.auth().signOut();

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user);
                setLoading(false);
            });
        // Make sure we un-register Firebase observers when the component unmounts.
        return () => unregisterAuthObserver();
    }, []);

    const values = {
        isLoading: loading,
        isSignedIn: isSignedIn,
        signIn: signIn,
        signOut: signOut,
    };
    
    return (
        <AuthContext.Provider value={values}>
            { children }
        </AuthContext.Provider>
    );
}
