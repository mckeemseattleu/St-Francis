import 'firebase/compat/auth';
import { createContext, useEffect, useState } from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { firebase } from '../firebase/firebase';

interface IAuthContext {
    isSignedIn: boolean;
    FireBaseAuth: Function;
    signOut: Function;
}

export const AuthContext = createContext({ } as IAuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider(props: AuthProviderProps) {
    const { children } = props;
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    const signOut = () => firebase.auth().signOut();

    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false,
        },
    };

    const FireBaseAuth = () => (
        <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
        />
    );

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user);
            });
        // Make sure we un-register Firebase observers when the component unmounts.
        return () => unregisterAuthObserver(); 
    }, []);

    const values = {
        isSignedIn: isSignedIn,
        FireBaseAuth: FireBaseAuth,
        signOut: signOut,
    };

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
}
