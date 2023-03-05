'use client';
import Image from 'next/image';
import { useState } from 'react';
import styles from './NavBar.module.css';
import type { MenuItems } from './NavMenu';
import NavMenu from './NavMenu';

export type NavMenuMobileProps = {
    items?: MenuItems;
    icon?: string;
};

export default function NavMenuMobile(props: NavMenuMobileProps) {
    const { items = [], icon = '/menu.svg' } = props;
    const [show, setShow] = useState(false);

    const handleShow = () => {
        window.scrollTo(0, 0);
        document.documentElement.style.overflow = show ? 'scroll' : 'hidden';
        setShow(!show);
    };

    return show ? (
        <div className={styles.navMobile} onClick={handleShow}>
            <NavMenu className={styles.navItemsMobile} items={items} />
        </div>
    ) : (
        <button className={styles.navMenuButton} onClick={handleShow}>
            <Image src={icon} alt="menu" width="20" height="20" />
        </button>
    );
}
