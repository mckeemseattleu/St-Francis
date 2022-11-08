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
            <Link className={styles.navbarLink} href="/checkedin">
                Checked in Clients
            </Link>
        </div>
    );
}
