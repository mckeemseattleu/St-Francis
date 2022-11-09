'use client';

import Head from 'next/head';
import { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import { Settings, SettingsContext } from '../contexts/SettingsContext';
import { SignInContext } from '../contexts/SignInContext';
import '../styles/globals.css';
import styles from '../styles/Home.module.css';

export default function RootLayout({ children }: any) {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>({
        daysEarlyThreshold: 25,
        backpackThreshold: 91,
        sleepingBagThreshold: 182,
        earlyOverride: false,
    });

    return (
        <html lang="en">
            <Head>
                <title>St. Francis House</title>
                <meta name="description" content="St. Francis House" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <body>
                <div className={styles.container}>
                    <SignInContext.Provider
                        value={{ isSignedIn, setIsSignedIn }}
                    >
                        <SettingsContext.Provider
                            value={{ settings, setSettings }}
                        >
                            <NavBar />
                            <main className={styles.main}>
                                {isSignedIn ? (
                                    children
                                ) : (
                                    <h1>Please sign in</h1>
                                )}
                            </main>
                        </SettingsContext.Provider>
                    </SignInContext.Provider>
                </div>

                <footer className={styles.footer}>
                    <p>Footer content</p>
                </footer>
            </body>
        </html>
    );
}
