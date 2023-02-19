import { useAuth } from '@/hooks/index';
import 'firebase/compat/auth';
import styles from './Login.module.css';

function Login() {
    const { isSignedIn, FireBaseAuth, signOut } = useAuth();
    // Configure FirebaseUI.

    if (!isSignedIn)
        return (
            <div className={styles.wrapper}>
                <FireBaseAuth />
            </div>
        );
    return (
        <div className={styles.wrapper}>
            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    );
}

export default Login;
