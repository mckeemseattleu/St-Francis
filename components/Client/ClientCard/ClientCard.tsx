'use client';
import Spinner from '@/components/Spinner/Spinner';
import { Button } from '@/components/UI';
import { useSettings } from '@/hooks/index';
import type { VisitWithClientId } from '@/types/index';
import { toLicenseDateString, validateClient } from '@/utils/index';
import type { Client, Settings } from 'models';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './ClientCard.module.css';

type PropsType = {
    client: Client;
    clientVisits: VisitWithClientId[] | undefined;
};

export default function ClientCard({ client, clientVisits }: PropsType) {
    const { id, firstName, lastName, birthday, notes, isBanned } = client;
    const { settings } = useSettings();

    const createField = (label: string, value?: string | number | null) => {
        return (
            (value && (
                <div className={styles.rowContainer}>
                    <h3>{label}</h3>
                    <p className={(label !== 'Birthday' && styles.days) || ''}>
                        {value}
                    </p>
                </div>
            )) ||
            null
        );
    };

    if (!settings) return <Spinner />;

    const { validated, data } = validateClient(client, settings, clientVisits);

    const {
        daysVisitLeft,
        daysBackpackLeft,
        daysSleepingBagLeft,
        daysOrcaCardLeft,
    } = data || {};

    return (
        <div className={styles.card}>
            <Link href={`/profile/${id}`}>
                <h1>{`${firstName} ${lastName}`}</h1>
            </Link>

            <div className={styles.detailsContainer}>
                <div className={styles.status}>
                    {!!settings && !validated && !client.isCheckedIn && (
                        <h3 className={styles.early}>Early</h3>
                    )}
                    {!!isBanned && <h3 className={styles.banned}>Banned</h3>}
                </div>
                {createField(
                    'Birthday',
                    birthday && toLicenseDateString(birthday)
                )}
                {!!daysVisitLeft &&
                    !client.isCheckedIn &&
                    createField('Early by ', daysVisitLeft + ' days')}
                {!!daysBackpackLeft &&
                    !client.isCheckedIn &&
                    createField(
                        'Backpack ',
                        daysBackpackLeft + ' days remaining'
                    )}
                {!!daysSleepingBagLeft &&
                    !client.isCheckedIn &&
                    createField(
                        'Sleeping Bag ',
                        daysSleepingBagLeft + ' days remaining'
                    )}
                {!!daysOrcaCardLeft &&
                    !client.isCheckedIn &&
                    createField(
                        'Orca Card ',
                        daysOrcaCardLeft + ' days remaining'
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
