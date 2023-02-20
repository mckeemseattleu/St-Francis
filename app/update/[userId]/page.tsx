'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { useRouter } from 'next/navigation';
import { ClientInfoForm } from '@/components/Client/index';
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
                firstNameLower: clientDoc.data().firstNameLower,
                lastNameLower: clientDoc.data().lastNameLower,
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
            {oldClientData ? (
                <ClientInfoForm
                    id={params.userId}
                    initialData={oldClientData}
                    redirect={`/profile/${params.userId}`}
                    title={'Update Client Form'}
                />
            ) : null}
        </div>
    );
}
