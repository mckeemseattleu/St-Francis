'use client';

import { ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button, Modal } from '@/components/UI';
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
import { useState } from 'react';
import { useQuery } from 'react-query';
import styles from './checkout.module.css';

interface CheckOutProps {
    params: { userId: string };
}

export default function CheckOut({ params }: CheckOutProps) {
    const { updateClientCache, updateVisitCache } = useQueryCache();
    const [, setAlert] = useAlert();
    const router = useRouter();
    const [show, setShow] = useState(false);

    const { isLoading, data: clientData } = useQuery(
        [CLIENTS_PATH, params.userId],
        () => getClient(params.userId)
    );

    const { isLoading: isVisitsloading, data: visitsData } = useQuery(
        [CLIENTS_PATH, params.userId, VISITS_PATH],
        () => listVisits(params.userId, undefined, 1)
    );
    const [visitFormData, setVisitFormData] = useState<Visit>(
        visitsData ? visitsData[0] : ({} as Visit)
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
            message: `Successfully updated visit and checked ${clientData?.firstName} out`,
            type: 'success',
        });
        router.push(`/`);
    };

    const saveVisit = async (visitData: Visit) => {
        await updateVisit(visitData, params.userId);
        updateVisitCache(params.userId, visitData);
        setAlert({
            message: `Successfully updated visit for ${clientData?.firstName}`,
            type: 'success',
        });
        setShow(false);
    };

    const fullName = `${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`;

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
                onSubmit={() => setShow(true)}
                onChange={setVisitFormData}
                submitLabel="Save and Check Out"
            />
            <Modal show={show} setShow={setShow}>
                <h3>Are you sure you want to checkout this client?</h3>
                <h4>{`${fullName}`}</h4>
                <hr />
                <div className={styles.rowContainer}>
                    <Button
                        onClick={() =>
                            visitFormData && checkOut(visitFormData!)
                        }
                    >
                        Confirm Checkout
                    </Button>
                    <Button
                        onClick={() =>
                            visitFormData && saveVisit(visitFormData!)
                        }
                    >
                        Save Only
                    </Button>
                    <Button onClick={() => setShow(false)}>Cancel</Button>
                </div>
            </Modal>
        </div>
    );
}
