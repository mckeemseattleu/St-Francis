'use client';

import styles from '../styles/Home.module.css';
import ClientList from '../components/ClientList/ClientList';
import { useContext } from 'react';
import { SignInContext } from '../contexts/SignInContext';

export default function Home() {
    const { isSignedIn } = useContext(SignInContext);

    return (
        <>
            <h1 className={styles.title}>St. Francis House</h1>

            {isSignedIn ? <ClientList /> : null}
        </>
    );
}
