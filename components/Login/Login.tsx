import { useAuth } from '@/hooks/index';
import Image from 'next/image';
import styles from './Login.module.css';
export default function Login() {
    const { isSignedIn, signIn, signOut } = useAuth();

    const handleAuth = () => (isSignedIn ? signOut() : signIn());
    const label = isSignedIn ? (
        'Sign Out'
    ) : (
        <>
            Sign In With
            <Image src="/google.svg" alt="google-auth" width="20" height="20" />
        </>
    );
    return (
        <button onClick={handleAuth} className={styles.signInButton}>
            {label}
        </button>
    );
}
