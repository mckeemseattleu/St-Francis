'use client';

import { useAuth } from '@/hooks/index';
import Link from 'next/link';
import Login from '../Login/Login';
import styles from './NavBar.module.css';

export default function NavBar() {
    const { isSignedIn } = useAuth();
    return (
        <div className={styles.container}>
            <Link className={styles.navbarLink} href="/">
                <img
                    src="https://static.wixstatic.com/media/e1bdbc_75d6fc19b2df4d349609ceff95d44255~mv2.png/v1/fill/w_311,h_130,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Logo_SFHS_WarmGray%402x_cropped.png"
                    alt="logo"
                    width="200"
                    height="80"
                />
            </Link>
            <span className={styles.spacer} />
            {isSignedIn && (
                <>
                    <Link className={styles.navbarLink} href="/checkedin">
                        <button>Checked in Clients</button>
                    </Link>

                    <Link className={styles.navbarLink} href="/settings">
                        <button>Settings</button>
                    </Link>
                </>
            )}
            <Login />
        </div>
    );
}
