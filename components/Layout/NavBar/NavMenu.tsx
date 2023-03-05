'use client';

import { useAuth } from '@/hooks/index';
import Link from 'next/link';
import Login from '../../Login/Login';
import styles from './NavBar.module.css';

export type MenuItems = Array<{ title: string; href: string }>;

export type NavMenuProps = {
    items?: MenuItems;
} & React.HTMLAttributes<HTMLDivElement>;

export default function NavMenu(props: NavMenuProps) {
    const { items = [], ...rest } = props;
    const { isSignedIn } = useAuth();
    return (
        <div className={styles.navItems} {...rest}>
            {isSignedIn &&
                items.map(({ title, href }, i) => (
                    <Link href={href} key={i}>
                        <button>{title}</button>
                    </Link>
                ))}
            <Login />
        </div>
    );
}
