'use client';

import Spinner from '@/components/Spinner/Spinner';
import { formatDate } from '@/utils/formatDate';
import {
    CLIENTS_PATH,
    VISITS_LIMIT,
    VISITS_PATH,
    getClient,
    listVisits,
} from '@/utils/queries';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styles from './profile.module.css';
import ErrorPage from 'next/error';
import { useEffect } from 'react';
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
                        <h2 className={styles.rowContainer} style={{ flex: 1 }}>
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
                                <button className={styles.visitBtn}>
                                    Printout
                                </button>
                            </Link>

                            <Link
                                href={`/profile/${params.userId}/visit/${visit.id}`}
                            >
                                <button className={styles.visitBtn}>
                                    Details
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            })
        );

    if (isClientloading) return <Spinner />;
    if (!clientData)
        return (
            <ErrorPage
                statusCode={404}
                withDarkMode={false}
                title="Client Data Not Found."
            />
        );

    return (
        <>
            <div>
                <div className={styles.rowContainer}>
                    <h1>
                        {`${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`}
                    </h1>
                    <span
                        className={
                            clientData?.isCheckedIn
                                ? styles.success
                                : styles.error
                        }
                    >
                        {clientData?.isCheckedIn
                            ? 'Checked in'
                            : 'Not Checked In'}
                    </span>
                    <span className={clientData?.isBanned ? styles.error : ''}>
                        {clientData?.isBanned ? 'Banned' : 'Not Banned'}
                    </span>
                </div>
                <hr />
                <div className={styles.rowContainer}>
                    <Link href={`/update/${params.userId}`}>
                        <button className={styles.visitBtn}>Edit</button>
                    </Link>
                    {clientData.isCheckedIn ? (
                        <Link href={`/checkout/${params.userId}`}>
                            <button className={styles.visitBtn}>
                                Check out
                            </button>
                        </Link>
                    ) : (
                        <Link href={`/checkin/${params.userId}`}>
                            <button className={styles.visitBtn}>
                                Check in
                            </button>
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
                </div>
            </div>

            <div>
                <h1>{VISITS_LIMIT} Most recent visits</h1>
                <hr />
                {isVisitsloading ? <Spinner /> : visits}
            </div>
        </>
    );
}
