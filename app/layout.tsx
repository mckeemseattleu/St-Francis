'use client';

import Head from 'next/head';
import NavBar from '../components/NavBar/NavBar';
import '../styles/globals.css';
import styles from '../styles/Home.module.css';

export default function RootLayout({ children }: any) {
    return (
        <html lang="en">
            <Head>
                <title>St. Francis House</title>
                <meta name="description" content="St. Francis House" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <body>
                <div className={styles.container}>
                    <NavBar />
                    <main className={styles.main}>{children}</main>
                </div>
            </body>

            <footer className={styles.footer}>
                <p>Footer content</p>
            </footer>
        </html>
    );
}
