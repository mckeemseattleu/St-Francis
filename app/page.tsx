'use client';

import styles from '../styles/Home.module.css';
import ClientList from '../components/ClientList/ClientList';
import Login from '../components/Login/Login';
import { useState } from 'react';

export default function Home() {
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    return (
        <>
            <h1 className={styles.title}>St. Francis House</h1>

            <Login isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />

            {isSignedIn ? <ClientList /> : null}
        </>
    );
}
