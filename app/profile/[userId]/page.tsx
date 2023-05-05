'use client';

import { ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button, Modal } from '@/components/UI';
import { useAlert, useQueryCache } from '@/hooks/index';
import { formatDate, updateClient } from '@/utils/index';
import {
    CLIENTS_PATH,
    deleteClient,
    getClient,
    listVisits,
    VISITS_LIMIT,
    VISITS_PATH,
} from '@/utils/index';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styles from './profile.module.css';

interface ProfileProps {
    params: { userId: string };
}

export default function Profile({ params }: ProfileProps) {
    const { isLoading: isClientloading, data: clientData } = useQuery(
        [CLIENTS_PATH, params.userId],
        () => getClient(params.userId)
    );

    const { isLoading: isVisitsloading, data: visitsData } = useQuery(
        [CLIENTS_PATH, params.userId, VISITS_PATH],
        () => listVisits(params.userId)
    );

    const { updateClientCache, updateVisitCache } = useQueryCache();

    const [show, setShow] = useState(false);
    const [, setAlert] = useAlert();
    const router = useRouter();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    // Format each visit
    const visits =
        !visitsData || visitsData.length === 0 ? (
            <p>No visits in history</p>
        ) : (
            visitsData.map((visit, i) => {
                return (
                    <div className={styles.rowContainer} key={i}>
                        <h2 className={styles.rowContainer}>
                            <Link
                                href={`/profile/${params.userId}/visit/${visit.id}`}
                            >
                                {visit?.createdAt?.toDate().toDateString()}
                            </Link>
                            <span>
                                {visit?.createdAt
                                    ?.toDate()
                                    .toLocaleTimeString()}
                            </span>
                        </h2>
                        <div className={styles.rowContainer}>
                            <Link
                                href={`/profile/${params.userId}/visit/${visit.id}/printout`}
                            >
                                <Button className={styles.visitBtn}>
                                    Printout
                                </Button>
                            </Link>

                            <Link
                                href={`/profile/${params.userId}/visit/${visit.id}`}
                            >
                                <Button className={styles.visitBtn}>
                                    Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                );
            })
        );

    const handleDelete = async () => {
        await deleteClient(params.userId);
        updateClientCache({ id: params.userId }, true);
        updateVisitCache(params.userId);
        setShow(false);
        setAlert({ message: 'Successfully deleted client', type: 'success' });
        router.push(`/`);
    };

    const checkOut = async () => {
        if (!clientData) return;
        const data = await updateClient({
            ...clientData,
            isCheckedIn: false,
        });
        updateClientCache(data);
        setAlert({
            message: `Successfully Checked Out ${clientData?.firstName}`,
            type: 'success',
        });
    };

    if (isClientloading) return <Spinner />;
    if (!clientData)
        return (
            <ErrorPage
                statusCode={404}
                withDarkMode={false}
                title="Client Data Not Found."
            />
        );

    const fullName = `${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`;

    return (
        <>
            <div>
                <h1>Profile Page</h1>
                <div className={styles.rowContainer}>
                    <h1>{fullName}</h1>
                    <ClientStatus
                        isBanned={!!clientData.isBanned}
                        isCheckedIn={!!clientData.isCheckedIn}
                        unhoused={!!clientData.unhoused}
                    />
                </div>
                <hr />
                <div className={styles.rowContainer}>
                    <Link href={`/update/${params.userId}`}>
                        <Button>Edit</Button>
                    </Link>
                    <Button onClick={() => setShow(true)}>Delete</Button>
                    {clientData.isCheckedIn ? (
                        <Button onClick={checkOut}>Check out</Button>
                    ) : (
                        <Link href={`/checkin/${params.userId}`}>
                            <Button>Check in</Button>
                        </Link>
                    )}
                </div>

                <div className={styles.rowContainer}>
                    <div className={styles.rowContainer}>
                        {clientData?.birthday ? <h3>Birthday</h3> : null}
                        {clientData?.birthday ? (
                            <p>
                                {clientData?.birthday &&
                                    formatDate(clientData.birthday, true)}
                            </p>
                        ) : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.gender ? <h3>Gender</h3> : null}
                        {clientData?.gender ? (
                            <p>{clientData?.gender}</p>
                        ) : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.race ? <h3>Race</h3> : null}
                        {clientData?.race ? <p>{clientData?.race}</p> : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.postalCode ? <h3>Postal code</h3> : null}
                        {clientData?.postalCode ? (
                            <p>{clientData?.postalCode}</p>
                        ) : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.numKids || clientData?.numKids === 0 ? (
                            <h3>Number of kids</h3>
                        ) : null}
                        {clientData?.numKids || clientData?.numKids === 0 ? (
                            <p>{clientData?.numKids}</p>
                        ) : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.lastVisit ? <h3>Last Visit</h3> : null}
                        {clientData?.lastVisit ? (
                            <p>
                                {clientData?.lastVisit &&
                                    formatDate(clientData.lastVisit, true)}
                            </p>
                        ) : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.lastBackpack ? (
                            <h3>Last backpack</h3>
                        ) : null}
                        {clientData?.lastBackpack ? (
                            <p>
                                {clientData?.lastBackpack &&
                                    formatDate(clientData.lastBackpack, true)}
                            </p>
                        ) : null}
                    </div>

                    <div className={styles.rowContainer}>
                        {clientData?.lastSleepingBag ? (
                            <h3>Last sleeping bag</h3>
                        ) : null}
                        {clientData?.lastSleepingBag ? (
                            <p>
                                {clientData?.lastSleepingBag &&
                                    formatDate(
                                        clientData.lastSleepingBag,
                                        true
                                    )}
                            </p>
                        ) : null}
                    </div>
                </div>
                {clientData?.notes ? (
                    <div>
                        <h2>Notes</h2>
                        <p>{clientData.notes}</p>
                    </div>
                ) : null}
            </div>

            <div>
                <h1>{VISITS_LIMIT} Most recent visits</h1>
                <hr />
                {isVisitsloading ? <Spinner /> : visits}
            </div>
            <Modal show={show} setShow={setShow}>
                <h3>Are you sure you want to delete this client?</h3>
                <h4>{`${fullName}`}</h4>
                <hr />
                <div className={styles.rowContainer}>
                    <Button onClick={handleDelete}>Confirm Delete</Button>
                    <Button onClick={() => setShow(false)}>Cancel</Button>
                </div>
            </Modal>
        </>
    );
}
