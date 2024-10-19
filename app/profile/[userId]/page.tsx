'use client';

import { ClientProfileInfo, ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button, Modal } from '@/components/UI';
import { useAlert, useQueryCache } from '@/hooks/index';
import {
    CLIENTS_PATH,
    deleteClient,
    getClient,
    listVisits,
    updateClient,
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
                    <ClientStatus client={clientData} />
                </div>
                <hr />
                <div className={styles.rowContainer}>
                    <Link href={`/update/${params.userId}`}>
                        <Button>Edit</Button>
                    </Link>
                    <Button onClick={() => setShow(true)}>Delete</Button>
                    {clientData.isCheckedIn ? (
                        <Link href={`/checkout/${params.userId}`}>
                            <Button>Check out</Button>
                        </Link>
                    ) : (
                        <Link href={`/checkin/${params.userId}`}>
                            <Button>Check in</Button>
                        </Link>
                    )}
                </div>
                <ClientProfileInfo
                    client={clientData}
                    visitsData={visitsData}
                />
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
