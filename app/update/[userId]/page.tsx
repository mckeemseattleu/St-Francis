'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { useRouter } from 'next/navigation';
import ClientInfoForm from '../../../components/ClientInfoForm/ClientInfoForm';
import { ClientDoc } from '../../profile/[userId]/page';

interface UpdateProps {
    params: { userId: string };
}

export default function Update({ params }: UpdateProps) {
    const router = useRouter();
    const [oldClientData, setOldClientData] = useState<ClientDoc>();

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
        <div className="container">
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
