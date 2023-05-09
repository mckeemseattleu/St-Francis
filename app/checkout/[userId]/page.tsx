'use client';

import { ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button } from '@/components/UI';
import VisitInfoForm from '@/components/Visit/VisitInfoForm';
import { useAlert, useQueryCache } from '@/hooks/index';
import { Visit } from '@/models/index';
import {
    CLIENTS_PATH,
    getClient,
    listVisits,
    updateClient,
    updateVisit,
    VISITS_PATH,
} from '@/utils/index';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import styles from './checkout.module.css';

interface CheckOutProps {
    params: { userId: string };
}

export default function CheckOut({ params }: CheckOutProps) {
    const { updateClientCache, updateVisitCache } = useQueryCache();
    const [, setAlert] = useAlert();
    const router = useRouter();

    const { isLoading, data: clientData } = useQuery(
        [CLIENTS_PATH, params.userId],
        () => getClient(params.userId)
    );

    const { isLoading: isVisitsloading, data: visitsData } = useQuery(
        [CLIENTS_PATH, params.userId, VISITS_PATH],
        () => listVisits(params.userId, undefined, 1)
    );
    // Sets isCheckedIn status to false then gets updated client data
    const checkOut = async (visitData: Visit) => {
        await updateVisit(visitData, params.userId);
        const client = await updateClient({
            ...clientData,
            isCheckedIn: false,
        });
        updateVisitCache(params.userId, visitData);
        updateClientCache(client);
        setAlert({
            message: `Successfully update visit and check out ${clientData?.firstName}`,
            type: 'success',
        });
        router.push(`/`);
    };

    if (isLoading || isVisitsloading) return <Spinner />;
    if (!clientData) return <ErrorPage statusCode={404} withDarkMode={false} />;
    if (!visitsData?.[0]) {
        router.push(`/profile/${params.userId}`);
        return null;
    }

    return (
        <div className={styles.container}>
            <h1>Checkout Page</h1>
            <div className={styles.rowContainer}>
                <h1>{`${clientData?.firstName} ${clientData?.lastName}`}</h1>
                <ClientStatus client={clientData} />
            </div>
            <hr />
            <div className={styles.rowContainer}>
                <Button>
                    <Link href={`/profile/${params.userId}`}>Profile</Link>
                </Button>
                <Button>
                    <Link href={`/update/${params.userId}`}>Edit</Link>
                </Button>
            </div>
            <VisitInfoForm
                initialVisitData={visitsData[0]}
                onSubmit={checkOut}
                submitLabel="Save and Check Out"
            />
        </div>
    );
}
