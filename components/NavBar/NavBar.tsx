'use client';

import Link from 'next/link';
import Login from '../Login/Login';
import styles from './NavBar.module.css';

export default function NavBar() {
    return (
        <div className={styles.container}>
            <Link className={styles.navbarLink} href="/">
                Home
            </Link>

            <span className={styles.spacer} />

            <Link className={styles.navbarLink} href="/checkedin">
                <button>Checked in Clients</button>
            </Link>

            <Link className={styles.navbarLink} href="/settings">
                <button>Settings</button>
            </Link>

            <Login />
        </div>
    );
}
