'use client';

import Spinner from '@/components/Spinner/Spinner';
import { useAuth } from '@/hooks/index';
import { FirebaseAuth } from '@/providers/AuthProvider';
import styles from './Main.module.css';
import '@/styles/firebaseui.css';

export type MainProps = React.HTMLAttributes<HTMLDivElement>;
export default function Main(props: MainProps) {
    const { children, className, ...rest } = props;
    const { isSignedIn, isLoading } = useAuth();

    const display = (
        <div className={styles.signInMain}>
            <h1>Please sign in</h1>
            <FirebaseAuth />
        </div>
    );

    return (
        <main {...rest} className={`${className} ${styles.main}`}>
            {isLoading ? <Spinner /> : isSignedIn ? children : display}
        </main>
    );
}
