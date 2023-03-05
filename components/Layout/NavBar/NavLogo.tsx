'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NavBar.module.css';

export type NavLogoProps = {
    src?: string;
    href?: string;
    width?: number;
    height?: number;
};

export default function NavLogo(props: NavLogoProps) {
    const { src = '/logo.webp', href = '/', width = 200, height = 84 } = props;
    return (
        <div className={styles.navLogo}>
            <Link href={href}>
                <Image
                    src={src}
                    alt="logo"
                    width={width}
                    height={height}
                    priority
                />
            </Link>
        </div>
    );
}
