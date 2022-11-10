'use client';

import { doc, getDoc } from 'firebase/firestore';
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

    useEffect(() => {
        getClientData();
    }, []);

    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

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
    };

    return (
        <>
            <h1>Profile</h1>

            <h2>{`${clientData?.firstName} ${clientData?.middleInitial} ${clientData?.lastName}`}</h2>
            <p>Birthday: {clientData?.birthday}</p>
            <p>Gender: {clientData?.gender}</p>
            <p>Race: {clientData?.race}</p>
            <p>Postal code: {clientData?.postalCode}</p>
            <p>Number of kids: {clientData?.numKids}</p>
            <p> Notes:</p>
            <p>{clientData?.notes}</p>
            <p>{clientData?.isCheckedIn ? 'Checked in' : 'Not checked in'}</p>
            <p>{clientData?.isBanned ? 'Banned' : 'Not banned'}</p>
        </>
    );
}
