'use client';
import { Button } from '@/components/UI';
import { useSettings } from '@/hooks/index';
import { formatDate, toLicenseDateString, validateClient } from '@/utils/index';
import type { Client } from 'models';
import Link from 'next/link';
import styles from './ClientCard.module.css';

export default function ClientCard({ client }: { client: Client }) {
    const {
        id,
        firstName,
        lastName,
        birthday,
        notes,
        isBanned,
        lastVisit,
        lastBackpack,
        lastSleepingBag,
    } = client;
    const { settings } = useSettings();

    const createField = (label: string, value?: string | number | null) => {
        return (
            (value && (
                <div className={styles.rowContainer}>
                    <h3>{label}</h3>
                    <p>{value}</p>
                </div>
            )) ||
            null
        );
    };
    const validated = settings && validateClient(client, settings).validated;
    return (
        <div className={styles.card}>
            <Link href={`/profile/${id}`}>
                <h1>{`${firstName} ${lastName}`}</h1>
            </Link>

            <div className={styles.detailsContainer}>
                <div className={styles.status}>
                    {settings && !validated ? (
                        <h3 className={styles.early}>Early</h3>
                    ) : null}
                    {isBanned ? (
                        <h3 className={styles.banned}>Banned</h3>
                    ) : null}
                </div>
                {createField(
                    'Birthday',
                    birthday && toLicenseDateString(birthday)
                )}
                {createField('Last Visit', lastVisit && formatDate(lastVisit))}
                {createField(
                    'Last backpack',
                    lastBackpack && formatDate(lastBackpack)
                )}
                {createField(
                    'Last sleeping bag',
                    lastSleepingBag && formatDate(lastSleepingBag)
                )}
                {notes && (
                    <>
                        <hr />
                        <h3>Notes</h3>
                        <p>
                            {notes && notes.length > 128
                                ? notes?.slice(0, 128) + '...'
                                : notes}
                        </p>
                    </>
                )}
            </div>

            <div className={styles.buttonContainer}>
                <Link href={`/profile/${id}`}>
                    <Button className={styles.button}>Profile</Button>
                </Link>

                <Link href={`/update/${id}`}>
                    <Button className={styles.button}>Edit</Button>
                </Link>

                {!client.isCheckedIn ? (
                    <Link href={`/checkin/${id}`}>
                        <Button className={styles.button}>Check in</Button>
                    </Link>
                ) : (
                    <Link href={`/checkout/${id}`}>
                        <Button className={styles.button}>Check out</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
