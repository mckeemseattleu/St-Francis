'use client';

import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { VisitDoc } from '../../checkin/[userId]/page';
import styles from './profile.module.css';

export interface ClientDoc {
    firstName: string;
    lastName: string;
    middleInitial: string;
    birthday: string; // TODO: Consider saving as timestamp
    gender: string;
    race: string;
    postalCode: string;
    numKids: number;
    notes: string;
    isCheckedIn: boolean;
    isBanned: boolean;
}

interface ProfileProps {
    params: { userId: string };
}

export default function Profile({ params }: ProfileProps) {
    const router = useRouter();
    const [clientData, setClientData] = useState<ClientDoc>();
    const [visitsData, setVisitsData] =
        useState<Array<VisitDoc & { id: string }>>();

    // Get client data on component load
    useEffect(() => {
        getClientData();
    }, []);

    // Gets the client's document from firestore based on route's userId
    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        // Set local state if their doc exists, otherwise go back to homepage
        if (clientDoc.exists()) {
            setClientData({
                firstName: clientDoc.data().firstName,
                lastName: clientDoc.data().lastName,
                middleInitial: clientDoc.data().middleInitial,
                birthday: clientDoc.data().birthday,
                gender: clientDoc.data().gender,
                race: clientDoc.data().race,
                postalCode: clientDoc.data().postalCode,
                numKids: clientDoc.data().numKids,
                notes: clientDoc.data().notes,
                isCheckedIn: clientDoc.data().isCheckedIn,
                isBanned: clientDoc.data().isBanned,
            });
        } else {
            router.push('/');
        }

        // Gets the client's 5 most recent visits
        if (clientDoc.exists()) {
            // Get visits subcollection
            const visitsRef = await collection(
                firestore,
                'clients',
                params.userId,
                'visits'
            );

            // Build query to get 5 most recent
            const q = query(visitsRef, orderBy('timestamp', 'desc'), limit(5));

            // Get array of documents
            const visits = await getDocs(q);
            let visitsArr: any = [];

            // Take the data for each visit and append to visitsArr
            visits.forEach((visit) => {
                let visitData = visit.data();
                visitData.id = visit.id;
                visitsArr.push(visitData);
            });

            // Set local state to be visitsArr
            setVisitsData(visitsArr);
        }
    };

    // Format each visit
    const visits =
        !visitsData || visitsData.length === 0 ? (
            <p>No visits in history</p>
        ) : (
            visitsData?.map((visit, i) => {
                return (
                    <div key={i}>
                        <Link
                            href={`/profile/${params.userId}/visit/${visit.id}`}
                        >
                            <h2>
                                {`${new Date(
                                    visit.timestamp.seconds * 1000
                                ).toDateString()}
                            -
                            ${new Date(
                                visit.timestamp.seconds * 1000
                            ).toTimeString()}`}
                            </h2>
                        </Link>

                        <h3>Clothing</h3>
                        {visit.clothingBoy ||
                        visit.clothingWomen ||
                        visit.clothingBoy ||
                        visit.clothingGirl ? (
                            <>
                                <p>{visit.clothingMen ? 'Men' : null}</p>
                                <p>{visit.clothingWomen ? 'Women' : null}</p>
                                <p>{visit.clothingBoy ? 'Kids (boy)' : null}</p>
                                <p>
                                    {visit.clothingGirl ? 'Kids (girl)' : null}
                                </p>
                            </>
                        ) : (
                            <p>None</p>
                        )}

                        <h3>Special Requests</h3>
                        {visit.backpack ||
                        visit.sleepingBag ||
                        visit.busTicket ||
                        visit.giftCard ||
                        visit.diaper ||
                        visit.financialAssistance ? (
                            <>
                                <p>{visit.backpack ? 'Backpack' : null}</p>
                                <p>
                                    {visit.sleepingBag ? 'Sleeping Bag' : null}
                                </p>
                                <p>
                                    {visit.busTicket
                                        ? `Bus Tickets: ${visit.busTicket}`
                                        : null}
                                </p>
                                <p>
                                    {visit.giftCard
                                        ? `Gift Card: ${visit.giftCard}`
                                        : null}
                                </p>
                                <p>
                                    {visit.diaper
                                        ? `Diapers: ${visit.diaper}`
                                        : null}
                                </p>
                                <p>
                                    {visit.financialAssistance
                                        ? `Financial Assistance: ${visit.financialAssistance}`
                                        : null}
                                </p>
                            </>
                        ) : (
                            <p>None</p>
                        )}

                        <h3>Notes</h3>
                        <p>{visit.notes.length === 0 ? 'None' : visit.notes}</p>
                    </div>
                );
            })
        );

    return (
        <div className="container">
            <h1>
                {`${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`}
            </h1>

            <div className={styles.rowContainer}>
                {clientData?.birthday ? <h3>Birthday</h3> : null}
                {clientData?.birthday ? <p>{clientData?.birthday}</p> : null}

                {clientData?.gender ? <h3>Gender</h3> : null}
                {clientData?.gender ? <p>{clientData?.gender}</p> : null}

                {clientData?.race ? <h3>Race</h3> : null}
                {clientData?.race ? <p>{clientData?.race}</p> : null}

                {clientData?.postalCode ? <h3>Postal code</h3> : null}
                {clientData?.postalCode ? (
                    <p>{clientData?.postalCode}</p>
                ) : null}

                {clientData?.numKids || clientData?.numKids === 0 ? (
                    <h3>'Number of kids'</h3>
                ) : null}
                {clientData?.numKids || clientData?.numKids === 0 ? (
                    <p>{clientData?.numKids}</p>
                ) : null}
            </div>

            <div className={styles.rowContainer}>
                <h3>
                    {clientData?.isCheckedIn ? 'Checked in' : 'Not checked in'}
                </h3>

                <h3>{clientData?.isBanned ? 'Banned' : 'Not banned'}</h3>
            </div>

            <h1>Options</h1>

            <div className={styles.rowContainer}>
                <Link href={`/update/${params.userId}`}>
                    <button>Edit</button>
                </Link>
                <br />
                <Link href={`/checkin/${params.userId}`}>
                    <button>Check in</button>
                </Link>
                <br />
                <Link href={`/checkout/${params.userId}`}>
                    <button>Check out</button>
                </Link>
            </div>

            <div>
                <h1>5 Most recent visits</h1>
                {visits}
            </div>
        </div>
    );
}
