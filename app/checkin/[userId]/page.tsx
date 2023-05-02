'use client';

import { ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button } from '@/components/UI';
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
    const handleSubmit = async (visitData: Visit) => {
        if (!clientData) return;
        try {
            const visit = await createVisit(visitData, params.userId);
            updateVisitCache(clientData.id, visit);
            // Updates client checkin status
            const client = await updateClient({
                ...clientData,
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
            <h1>Check-in Page</h1>
            <div className={styles.rowContainer}>
                <h1>
                    {`${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`}
                </h1>
                <ClientStatus
                    isBanned={!!clientData?.isBanned}
                    isCheckedIn={!!clientData?.isCheckedIn}
                    unhoused={!!clientData?.unhoused}
                />
            </div>
            <hr />
            <div className={styles.rowContainer}>
                <Link href={`/update/${params.userId}`}>
                    <Button>Edit</Button>
                </Link>
                <Link href={`/profile/${params.userId}`}>
                    <Button>Profile</Button>
                </Link>
            </div>
            {clientData?.notes ? (
                <div>
                    <h2>Notes</h2>
                    <p>{clientData.notes}</p>
                </div>
            ) : null}

            <VisitInfoForm clientData={clientData} onSubmit={handleSubmit} />
        </div>
    );
}
