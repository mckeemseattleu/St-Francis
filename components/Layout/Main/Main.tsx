'use client';

import Spinner from '@/components/Spinner/Spinner';
import { Button } from '@/components/UI';
import { useAuth } from '@/hooks/index';
import Image from 'next/image';
import styles from './Main.module.css';

export type MainProps = React.HTMLAttributes<HTMLDivElement>;
export default function Main(props: MainProps) {
    const { children, className, ...rest } = props;
    const { isSignedIn, signIn, isLoading } = useAuth();
    const display = (
        <div className={styles.signInMain}>
            <h1>Please sign in</h1>
            <Button onClick={() => signIn()} className={styles.googleButton}>
                <h2>Sign In With</h2>
                <Image
                    src="/google.svg"
                    alt="google-auth"
                    width="50"
                    height="50"
                />
            </Button>
        </div>
    );
    return (
        <main {...rest} className={`${className} ${styles.main}`}>
            {isLoading ? <Spinner /> : isSignedIn ? children : display}
        </main>
    );
}
