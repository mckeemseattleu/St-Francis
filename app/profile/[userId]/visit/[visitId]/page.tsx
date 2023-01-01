'use client';

import {
    collection,
    deleteDoc,
    deleteField,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { firestore } from '../../../../../firebase/firebase';
import { VisitDoc } from '../../../../checkin/[userId]/page';
import styles from './visit.module.css';

interface VisitProps {
    params: { visitId: string; userId: string };
}

export default function Visit({ params }: VisitProps) {
    const router = useRouter();
    const [visitData, setVisitData] = useState<VisitDoc>();

    // Get visit data on component load
    useEffect(() => {
        getVisitData();
    }, []);

    // Gets the visit's document from firestore based on route's visitId
    const getVisitData = async () => {
        const visitDoc = await getDoc(
            doc(firestore, 'clients', params.userId, 'visits', params.visitId)
        );

        if (visitDoc.exists()) {
            setVisitData(visitDoc.data() as VisitDoc);
        } else {
            router.push(`/profile/${params.userId}`);
        }
    };

    const deleteVisit = async () => {
        // Delete this visit
        await deleteDoc(
            doc(firestore, 'clients', params.userId, 'visits', params.visitId)
        );

        // Find updated most recent visit after we delete this visit
        const visitRef = collection(
            firestore,
            'clients',
            params.userId,
            'visits'
        );

        // Get most recent visit
        const mostRecentVisit = await getDocs(
            query(visitRef, orderBy('timestamp', 'desc'), limit(1))
        );

        // Get timestamp of most recent visit if it exists
        const newDateLastVisit = mostRecentVisit.docs[0]
            ?.data()
            .timestamp.toDate();

        // If newDateLastVisit is undefined, we just deleted the only visit, so
        // we can delete all validation fields
        if (newDateLastVisit == null) {
            // Delete validation data fields
            await updateDoc(doc(firestore, 'clients', params.userId), {
                dateLastVisit: deleteField(),
                dateLastBackpack: deleteField(),
                dateLastSleepingBag: deleteField(),
            });
        } else {
            // Otherwise we need to calculate when the client last requested a backpack or sleeping bag

            // Backpack
            const mostRecentBackpack = await getDocs(
                query(
                    visitRef,
                    where('backpack', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                )
            );

            // Sleeping bag
            const mostRecentSleepingBag = await getDocs(
                query(
                    visitRef,
                    where('sleepingBag', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                )
            );

            // Update client doc with new validation data
            await updateDoc(doc(firestore, 'clients', params.userId), {
                dateLastVisit: newDateLastVisit,
                dateLastBackpack:
                    mostRecentBackpack.docs[0]?.data().timestamp.toDate() ==
                    null
                        ? deleteField()
                        : mostRecentBackpack.docs[0].data().timestamp.toDate(),
                dateLastSleepingBag:
                    mostRecentSleepingBag.docs[0]?.data().timestamp.toDate() ==
                    null
                        ? deleteField()
                        : mostRecentSleepingBag.docs[0]
                              .data()
                              .timestamp.toDate(),
            });
        }

        // Redirect back to client profile
        router.push(`/profile/${params.userId}`);
    };

    return (
        <>
            <h1>Visit Details</h1>
            <div>
                {visitData?.timestamp ? (
                    <h3>
                        {`${new Date(
                            visitData?.timestamp?.seconds * 1000
                        ).toDateString()}
                            -
                            ${new Date(
                                visitData?.timestamp?.seconds * 1000
                            ).toTimeString()}`}
                    </h3>
                ) : null}

                <h3>Clothing</h3>
                {visitData?.clothingBoy ||
                visitData?.clothingWomen ||
                visitData?.clothingBoy ||
                visitData?.clothingGirl ? (
                    <>
                        <p>{visitData?.clothingMen ? 'Men' : null}</p>
                        <p>{visitData?.clothingWomen ? 'Women' : null}</p>
                        <p>{visitData?.clothingBoy ? 'Kids (boy)' : null}</p>
                        <p>{visitData?.clothingGirl ? 'Kids (girl)' : null}</p>
                    </>
                ) : (
                    <p>None</p>
                )}

                <h3>Special Requests</h3>
                {visitData?.backpack ||
                visitData?.sleepingBag ||
                visitData?.busTicket ||
                visitData?.giftCard ||
                visitData?.diaper ||
                visitData?.financialAssistance ? (
                    <>
                        <p>{visitData?.backpack ? 'Backpack' : null}</p>
                        <p>{visitData?.sleepingBag ? 'Sleeping Bag' : null}</p>
                        <p>
                            {visitData?.busTicket
                                ? `Bus Tickets: ${visitData?.busTicket}`
                                : null}
                        </p>
                        <p>
                            {visitData?.giftCard
                                ? `Gift Card: ${visitData?.giftCard}`
                                : null}
                        </p>
                        <p>
                            {visitData?.diaper
                                ? `Diapers: ${visitData?.diaper}`
                                : null}
                        </p>
                        <p>
                            {visitData?.financialAssistance
                                ? `Financial Assistance: ${visitData?.financialAssistance}`
                                : null}
                        </p>
                    </>
                ) : (
                    <p>None</p>
                )}

                <h3>Household items</h3>
                <p>
                    {visitData?.household.length === 0
                        ? 'None'
                        : visitData?.household}
                </p>

                <h3>Notes</h3>
                <p>
                    {visitData?.notes.length === 0 ? 'None' : visitData?.notes}
                </p>
            </div>

            <h2>Options</h2>
            <div className={styles.rowContainer}>
                <Link
                    href={`/profile/${params.userId}/visit/${params.visitId}/printout`}
                >
                    <button>Go to printout</button>
                </Link>

                <button onClick={deleteVisit}>Delete visit</button>
            </div>
        </>
    );
}
