'use client';

import { Client } from '@/models/index';
import { formatDate } from '@/utils/index';
import styles from './ClientProfileInfo.module.css';

type ClientProfileInfoProps = {
    client?: Client;
};
const ClientProfileInfo = (props: ClientProfileInfoProps) => {
    const { client } = props;
    if (!client) return null;
    const {
        birthday,
        gender,
        race,
        postalCode,
        numKids,
        lastVisit,
        lastBackpack,
        lastSleepingBag,
        notes,
    } = client;

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

    return (
        <>
            <div className={styles.rowContainer}>
                {createField('Birthday', birthday && formatDate(birthday))}
                {createField('Gender', gender)}
                {createField('Race', race)}
                {createField('Postal code', postalCode)}
                {createField('Number of kids', numKids)}
                {createField('Last Visit', lastVisit && formatDate(lastVisit))}
                {createField(
                    'Last backpack',
                    lastBackpack && formatDate(lastBackpack)
                )}
                {createField(
                    'Last sleeping bag',
                    lastSleepingBag && formatDate(lastSleepingBag)
                )}
            </div>
            {createField('Notes', notes)}
        </>
    );
};

export default ClientProfileInfo;
