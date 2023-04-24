'use client';

import Spinner from '@/components/Spinner/Spinner';
import VisitInfoForm from '@/components/Visit/VisitInfoForm';
import { useAlert, useQueryCache } from '@/hooks/index';
import { Client, Visit } from '@/models/index';
import { createVisit, updateClient } from '@/utils/mutations';
import { CLIENTS_PATH, getClient } from '@/utils/queries';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import styles from './checkin.module.css';

interface CheckinProps {
    params: { userId: string };
}

export default function Checkin({ params }: CheckinProps) {
    const router = useRouter();
    const [, setAlert] = useAlert();
    const { updateClientCache, updateVisitCache } = useQueryCache();
    const { isLoading, data: clientData } = useQuery(
        [CLIENTS_PATH, params.userId],
        () => getClient(params.userId)
    );

    // Checkin process
    const checkIn = async (visitData: Visit) => {
        if (!clientData) return;
        try {
            const visit = await createVisit(visitData, params.userId);
            updateVisitCache(clientData.id, visit);
            // Updates validation data in client doc based on new check in
            const client = await updateClient({
                ...clientData,
                lastVisit: visit.createdAt,
                lastBackpack: visit.backpack
                    ? visit.createdAt
                    : clientData?.lastBackpack || null,
                lastSleepingbag: visit.sleepingBag
                    ? visit.createdAt
                    : clientData?.lastSleepingbag || null,
                isCheckedIn: true,
            } as Client);
            updateClientCache(client);
            setAlert({
                message: `Successfully Checked In ${client?.firstName}`,
                type: 'success',
            });
            // Redirect to user profile page after checking user in
            router.push(`/profile/${params.userId}`);
        } catch (error: any) {
            setAlert({
                message: error.message,
                type: 'error',
            });
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Check-in Page</h1>

                <div className={styles.headerRow}>
                    <Link href={`/profile/${params.userId}`}>
                        <h2>{`${clientData?.firstName} ${clientData?.lastName}`}</h2>
                    </Link>

                    <span />

                    <p>
                        {clientData?.isCheckedIn
                            ? 'Checked in'
                            : 'Not checked in'}
                    </p>

                    <Link href={`/update/${params.userId}`}>
                        <button>Edit profile</button>
                    </Link>
                </div>

                <p>Notes:</p>
                <p>{clientData ? clientData.notes : null}</p>
            </div>

            <VisitInfoForm clientData={clientData} onSubmit={checkIn} />
        </div>
    );
}
