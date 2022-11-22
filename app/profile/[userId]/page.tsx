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
    const [visitsData, setVisitsData] = useState<Array<any>>();

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
            const q = query(visitsRef, orderBy('timestamp'), limit(5));

            // Get array of documents
            const visits = await getDocs(q);
            let visitsArr: any = [];

            // Take the data for each visit and append to visitsArr
            visits.forEach((visit) => {
                visitsArr.push(visit.data());
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
                        <h2>
                            {new Date(
                                visit.timestamp.seconds * 1000
                            ).toDateString()}
                        </h2>

                        <h3>Clothing</h3>
                        <p>{visit.clothingMen ? 'Men' : null}</p>
                        <p>{visit.clothingWomen ? 'Women' : null}</p>
                        <p>{visit.clothingBoy ? 'Kids (boy)' : null}</p>
                        <p>{visit.clothingGirl ? 'Kids (girl)' : null}</p>

                        <h3>Notes</h3>
                        <p>{visit.notes.length === 0 ? 'None' : visit.notes}</p>
                    </div>
                );
            })
        );

    return (
        <div className="container">
            <h1>Profile</h1>

            <div>
                <h2>{`${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`}</h2>
                <p>Birthday: {clientData?.birthday}</p>
                <p>Gender: {clientData?.gender}</p>
                <p>Race: {clientData?.race}</p>
                <p>Postal code: {clientData?.postalCode}</p>
                <p>Number of kids: {clientData?.numKids}</p>
                <p> Notes:</p>
                <p>{clientData?.notes}</p>
                <p>
                    {clientData?.isCheckedIn ? 'Checked in' : 'Not checked in'}
                </p>
                <p>{clientData?.isBanned ? 'Banned' : 'Not banned'}</p>

                <h1>Options</h1>
                <Link href={`/update/${params.userId}`}>Edit</Link>
                <br />
                <Link href={`/checkin/${params.userId}`}>Check in</Link>
                <br />
                <Link href={`/checkout/${params.userId}`}>Check out</Link>
            </div>

            <div>
                <h1>5 Most recent visits</h1>
                {visits}
            </div>
        </div>
    );
}
