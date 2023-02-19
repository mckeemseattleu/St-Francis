'use client';

import { useAuth } from '@/hooks/index';
import Providers from '@/providers/index';
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
                    <Providers>
                        <NavBar />
                        <Main>{children}</Main>
                    </Providers>
                </div>

                {/* <footer className={styles.footer}>
                    <p>Footer content</p>
                </footer> */}
            </body>
        </html>
    );
}

function Main({ children }: { children: React.ReactNode }) {
    const { isSignedIn } = useAuth();
    return (
        <main className={styles.main}>
            {isSignedIn ? children : <h1>Please sign in</h1>}
        </main>
    );
}
