'use client';

import { doc, getDoc } from 'firebase/firestore';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import { Settings, SettingsContext } from '../contexts/SettingsContext';
import { SignInContext } from '../contexts/SignInContext';
import { firestore } from '../firebase/firebase';
import '../styles/globals.css';
import styles from '../styles/Home.module.css';

export default function RootLayout({ children }: any) {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>({
        daysEarlyThreshold: 0,
        backpackThreshold: 0,
        sleepingBagThreshold: 0,
        earlyOverride: false,
    });

    // Get initial settings on app load
    useEffect(() => {
        getSettingsDoc();
    }, []);

    const getSettingsDoc = async () => {
        const settingsDoc = await getDoc(doc(firestore, 'settings', 'default'));

        if (settingsDoc.exists()) {
            setSettings(settingsDoc.data() as Settings);
        }
    };

    return (
        <html lang="en">
            <Head>
                <title>St. Francis House</title>
                <meta name="description" content="St. Francis House" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <body>
                <div className={styles.container}>
                    {/* Context providers used for global state */}
                    <SignInContext.Provider
                        value={{ isSignedIn, setIsSignedIn }}
                    >
                        <SettingsContext.Provider
                            value={{ settings, setSettings }}
                        >
                            <NavBar />

                            <main className={styles.main}>
                                {/* Show a message if user's not signed in for all pages */}
                                {isSignedIn ? (
                                    children
                                ) : (
                                    <h1>Please sign in</h1>
                                )}
                            </main>
                        </SettingsContext.Provider>
                    </SignInContext.Provider>
                </div>

                {/* <footer className={styles.footer}>
                    <p>Footer content</p>
                </footer> */}
            </body>
        </html>
    );
}
