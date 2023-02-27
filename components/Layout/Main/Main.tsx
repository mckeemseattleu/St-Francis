'use client';

import Spinner from '@/components/Spinner/Spinner';
import { useAuth } from '@/hooks/index';
import Image from 'next/image';
import styles from './Main.module.css';

export default function Main({ children }: { children: React.ReactNode }) {
    const { isSignedIn, signIn, isLoading } = useAuth();
    const display = (
        <div className={styles.signInMain}>
            <h1>Please sign in</h1>
            <button onClick={() => signIn()} className={styles.googleButton}>
                <h2>Sign In With</h2>
                <Image
                    src="/google.svg"
                    alt="google-auth"
                    width="50"
                    height="50"
                />
            </button>
        </div>
    );
    return (
        <main className={styles.main}>
            {isLoading ? <Spinner /> : isSignedIn ? children : display}
        </main>
    );
}
