'use client';

import { Client, Visit } from '@/models/index';
import { toLicenseDateString, formatDate } from '@/utils/index';
import { Timestamp } from 'firebase/firestore';
import { format } from 'path';
import styles from './ClientProfileInfo.module.css';

type ClientProfileInfoProps = {
    client?: Client;
    visitsData?: Visit[];
};

const ClientProfileInfo = (props: ClientProfileInfoProps) => {
    const { client, visitsData } = props;
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
        lastOrcaCard,
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

    const getLastOrcaCardVisit = () => {
        if (lastOrcaCard) return lastOrcaCard;
        if (visitsData) {
            const orcaCardVisits = visitsData.filter(
                (visit) => visit.orcaCard && visit.orcaCard > 0
            );

            return orcaCardVisits.length > 0
                ? orcaCardVisits[0].createdAt
                : null;
        }
    };

    return (
        <>
            <div className={styles.rowContainer}>
                {createField(
                    'Birthday',
                    birthday && toLicenseDateString(birthday)
                )}
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
                {createField(
                    'Last Orca Card',
                    getLastOrcaCardVisit() &&
                        formatDate(getLastOrcaCardVisit() as Timestamp)
                )}
            </div>
            {createField('Notes', notes)}
        </>
    );
};

export default ClientProfileInfo;
