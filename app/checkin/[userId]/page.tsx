'use client';

import { ClientProfileInfo, ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button, Modal } from '@/components/UI';
import VisitInfoForm from '@/components/Visit/VisitInfoForm';
import { useAlert, useQueryCache, useSettings } from '@/hooks/index';
import { Client, Visit } from '@/models/index';
import {
    CLIENTS_PATH,
    createVisit,
    getClient,
    listVisits,
    updateClient,
    validateClient,
    VISITS_PATH,
} from '@/utils/index';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styles from './checkin.module.css';

interface CheckinProps {
    params: { userId: string };
}

export default function Checkin({ params }: CheckinProps) {
    const router = useRouter();
    const [, setAlert] = useAlert();
    const [show, setShow] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [visitData, setVisitData] = useState<Visit>();
    const [visitFormData, setVisitFormData] = useState<Visit>();
    const [validatedData, setValidatedData] = useState<
        | {
              daysBackpackLeft: number;
              daysSleepingBagLeft: number;
              daysVisitLeft: number;
              daysOrcaCardLeft: number;
          }
        | undefined
    >();
    const { settings } = useSettings();
    const { updateClientCache, updateVisitCache } = useQueryCache();
    const { isLoading, data: clientData } = useQuery(
        [CLIENTS_PATH, params.userId],
        () => getClient(params.userId)
    );

    const { isLoading: isVisitsloading, data: visitsData } = useQuery(
        [CLIENTS_PATH, params.userId, VISITS_PATH],
        () => listVisits(params.userId, undefined, 10)
    );

    // Checkin process, handles validate eligibility
    const handleSubmit = async (visitData: Visit) => {
        if (!clientData || !visitData || !settings) return;
        const { validated, data } = await validateClient(
            clientData,
            settings,
            visitsData
        );
        if (!show && !validated) {
            setShow(true);
            setVisitData(visitData);
            setValidatedData(data);
            return;
        }

        try {
            const visit = await createVisit(visitData, params.userId);
            updateVisitCache(clientData.id, visit);
            // Updates client checkin status
            const client = await updateClient({
                id: clientData.id,
                isCheckedIn: true,
            } as Client);
            updateClientCache(client);
            setAlert({
                message: `Successfully Checked In ${clientData?.firstName}`,
                type: 'success',
            });
            // Redirect to user profile page after checking user in
            router.push(`/profile/${params.userId}/visit/${visit.id}/printout`);
        } catch (error: any) {
            setAlert({
                message: error.message,
                type: 'error',
            });
        }
    };

    const onChange = (visitData: Visit) => {
        setVisitFormData(visitData);
    };

    const checkIn = () => {
        visitFormData && handleSubmit(visitFormData);
    };

    if (isLoading || isVisitsloading) return <Spinner />;
    if (!clientData) return <h1>Client not found</h1>;
    return (
        <div className={styles.container}>
            <h1>Check-in Page</h1>
            <div className={styles.rowContainer}>
                <h1>
                    {`${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`}
                </h1>
                <ClientStatus client={clientData} />
            </div>
            <hr />

            <div className={styles.rowContainer}>
                <Link href={`/update/${params.userId}`}>
                    <Button>Edit</Button>
                </Link>
                <Link href={`/profile/${params.userId}`}>
                    <Button>Profile</Button>
                </Link>
                <Button onClick={checkIn}>New Visit / Check-in</Button>
            </div>
            <div className={styles.rowContainer}>
                <details>
                    <summary>
                        <h2 onClick={() => setShowInfo(!showInfo)}>
                            Show Client Info {showInfo ? '⬆' : '⬇'}
                        </h2>
                    </summary>
                    <ClientProfileInfo client={clientData} />
                </details>
            </div>

            <VisitInfoForm
                onSubmit={handleSubmit}
                onChange={onChange}
                submitLabel={'New Visit / Check-in'}
                isCheckIn={true}
            />
            <Modal show={show} setShow={setShow}>
                <h3>Early Visit For {clientData?.firstName}</h3>
                <hr />
                <h4>
                    Last Visit:{' '}
                    {clientData?.lastVisit?.toDate()?.toLocaleString()}
                    <span> | {validatedData?.daysVisitLeft} day(s) left</span>
                </h4>
                <h4>
                    Last Backpack:{' '}
                    {clientData?.lastBackpack?.toDate()?.toLocaleString()}
                    <span>
                        {' '}
                        | {validatedData?.daysBackpackLeft} day(s) left
                    </span>
                </h4>
                <h4>
                    Last Sleeping Bag:{' '}
                    {clientData?.lastSleepingBag?.toDate()?.toLocaleString()}
                    <span>
                        {' '}
                        | {validatedData?.daysSleepingBagLeft} day(s) left
                    </span>
                </h4>
                <h4>
                    Last Orca Card:{' '}
                    {clientData?.lastOrcaCard?.toDate()?.toLocaleString()}
                    <span>
                        {' '}
                        | {validatedData?.daysOrcaCardLeft} day(s) left
                    </span>
                </h4>

                <div className={styles.rowContainer}>
                    <Button onClick={() => setShow(false)}>Cancel</Button>
                    <Button
                        onClick={() => visitData && handleSubmit(visitData)}
                    >
                        Force Check-in
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
