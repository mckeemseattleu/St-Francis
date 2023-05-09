'use client';
import { useWindowSize } from '@/hooks/index';
import styles from './NavBar.module.css';
import NavLogo from './NavLogo';
import NavMenu from './NavMenu';
import NavMenuMobile from './NavMenuMobile';

export type MenuItems = Array<{ title: string; href: string }>;

const menuItems: MenuItems = [
    { title: 'New Client', href: '/add-client' },
    { title: 'Checked in Clients', href: '/checkedin' },
    { title: 'Settings', href: '/settings' },
];

export default function NavBar(props: React.HTMLAttributes<HTMLDivElement>) {
    const { isMobile } = useWindowSize();
    return (
        <nav {...props} className={`${props.className} ${styles.nav}`}>
            <NavLogo />
            <div className="noprint">
                {isMobile && <NavMenuMobile items={menuItems} />}
                {!isMobile && <NavMenu items={menuItems} />}
            </div>
        </nav>
    );
}
