'use client';

import Link from 'next/link';
import styles from './ClientCard.module.css';
interface ClientCardProps {
    id: string;
    firstName: string;
    lastName: string;
    notes: string;
}

export default function ClientCard({
    id,
    firstName,
    lastName,
    notes,
}: ClientCardProps) {
    return (
        <div className={styles.card}>
            <Link href={`/profile/${id}`}>
                <h1>{`${firstName} ${lastName}`}</h1>
            </Link>

            <div className={styles.detailsContainer}>
                <h2>Notes:</h2>
                <p>{notes}</p>
            </div>

            <div className={styles.buttonContainer}>
                <Link href={`/profile/${id}`}>
                    <button className={styles.button}>Profile</button>
                </Link>

                <Link href={`/update/${id}`}>
                    <button className={styles.button}>Edit</button>
                </Link>

                <Link href={`/checkin/${id}`}>
                    <button className={styles.button}>Check in</button>
                </Link>

                <Link href={`/checkout/${id}`}>
                    <button className={styles.button}>Check out</button>
                </Link>
            </div>
        </div>
    );
}
