'use client';

import { useAuth } from '@/hooks/index';
import Link from 'next/link';
import Login from '../Login/Login';
import styles from './NavBar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const { isSignedIn } = useAuth();
    const path = usePathname();
    return (
        <div className={styles.container}>
            <Link href="/">
                <Image
                    src="/logo.webp"
                    alt="logo"
                    width="200"
                    height="84"
                    priority
                />
            </Link>
            {isSignedIn && (
                <div className={styles.spacer}>
                    <Link
                        href="/checkedin"
                        className={`${styles.navbarLink} ${
                            path == '/checkedin' ? styles.active : ''
                        }`}
                    >
                        Checked in Clients
                    </Link>

                    <Link
                        href="/settings"
                        className={`${styles.navbarLink} ${
                            path == '/settings' ? styles.active : ''
                        }`}
                    >
                        Settings
                    </Link>
                </div>
            )}
            <Login />
        </div>
    );
}
