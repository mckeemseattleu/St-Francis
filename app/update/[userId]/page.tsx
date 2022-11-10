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
    notes: string;
}

export default function Update({ params }: UpdateProps) {
    const router = useRouter();
    const [oldClientData, setOldClientData] = useState<Client>();

    useEffect(() => {
        getClientData();
    }, []);

    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        if (clientDoc.exists()) {
            setOldClientData({
                id: params.userId,
                firstName: clientDoc.data().firstName,
                lastName: clientDoc.data().lastName,
                notes: clientDoc.data().notes,
                isCheckedIn: clientDoc.data().isCheckedIn,
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

            <ClientInfoForm id={params.userId} />
        </div>
    );
}
