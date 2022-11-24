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
            <h2>Notes:</h2>
            <p>{notes}</p>
            <br />

            <Link href={`/profile/${id}`}>
                <button>Profile</button>
            </Link>
            <br />

            <Link href={`/update/${id}`}>
                <button>Edit</button>
            </Link>
            <br />

            <Link href={`/checkin/${id}`}>
                <button>Check in</button>
            </Link>
            <br />

            <Link href={`/checkout/${id}`}>
                <button>Check out</button>
            </Link>
        </div>
    );
}
