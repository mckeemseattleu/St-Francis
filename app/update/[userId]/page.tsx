'use client';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { Client } from '../../../components/ClientList/ClientList';
import { useRouter } from 'next/navigation';
import ClientInfoForm from '../../../components/ClientInfoForm/ClientInfoForm';

interface UpdateProps {
    params: { userId: string };
}

interface ClientDoc {
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

export default function Update({ params }: UpdateProps) {
    const router = useRouter();
    const [oldClientData, setOldClientData] = useState<ClientDoc>();

    useEffect(() => {
        getClientData();
    }, []);

    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        if (clientDoc.exists()) {
            setOldClientData({
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
        <div>
            <h1>Update user page</h1>

            <h2>Old data</h2>
            <p>{`${oldClientData?.firstName} ${oldClientData?.lastName}`}</p>
            <p>{oldClientData ? oldClientData.notes : null}</p>

            <h2>Edit data</h2>
            {oldClientData ? (
                <ClientInfoForm
                    id={params.userId}
                    initialData={oldClientData}
                />
            ) : null}
        </div>
    );
}
