'use client';

import styles from './ClientCard.module.css';
interface ClientCardProps {
    firstName: string;
    lastName: string;
    notes: string;
}

export default function ClientCard({
    firstName,
    lastName,
    notes,
}: ClientCardProps) {
    return (
        <div className={styles.card}>
            <h1>{`${firstName} ${lastName}`}</h1>
            <h2>Notes:</h2>
            <p>{notes}</p>
        </div>
    );
}
