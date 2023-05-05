import { useAuth } from '@/hooks/index';
import Image from 'next/image';
import { Button } from '@/components/UI';
import styles from './Login.module.css';
export default function Login() {
    const { isSignedIn, signIn, signOut } = useAuth();
    if (!isSignedIn)
        return (
            <Button onClick={() => signIn()} className={styles.signInButton}>
                Sign In With
                <Image
                    src="/google.svg"
                    alt="google-auth"
                    width="20"
                    height="20"
                />
            </Button>
        );
    return <Button onClick={() => signOut()}>Sign Out</Button>;
}
