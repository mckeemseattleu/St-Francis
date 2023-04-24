import type { Client } from 'models';
import Link from 'next/link';
import styles from './ClientCard.module.css';
import { formatDate } from '@/utils/formatDate';

export default function ClientCard({ client }: { client: Client }) {
    const { id, firstName, lastName, birthday, notes, isBanned } = client;
    return (
        <div className={styles.card}>
            <Link href={`/profile/${id}`}>
                <h1>{`${firstName} ${lastName}`}</h1>
            </Link>

            <div className={styles.detailsContainer}>
                {isBanned ? <h2>Banned</h2> : null}

                <h2>Birthday:</h2>
                <p>{birthday && formatDate(birthday, true)}</p>

                <h2>Notes:</h2>
                <p>
                    {notes && notes.length > 128
                        ? notes?.slice(0, 128) + '...'
                        : notes}
                </p>
            </div>

            <div className={styles.buttonContainer}>
                <Link href={`/profile/${id}`}>
                    <button className={styles.button}>Profile</button>
                </Link>

                <Link href={`/update/${id}`}>
                    <button className={styles.button}>Edit</button>
                </Link>

                {!client.isCheckedIn ? (
                    <Link href={`/checkin/${id}`}>
                        <button className={styles.button}>Check in</button>
                    </Link>
                ) : (
                    <Link href={`/checkout/${id}`}>
                        <button className={styles.button}>Check out</button>
                    </Link>
                )}
            </div>
        </div>
    );
}
