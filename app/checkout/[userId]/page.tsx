'use client';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { Client } from '../../../components/ClientList/ClientList';
import { useRouter } from 'next/navigation';

interface CheckOutProps {
    params: { userId: string };
}

export default function CheckOut({ params }: CheckOutProps) {
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

    const checkIn = async () => {
        await updateDoc(doc(firestore, 'clients', params.userId), {
            isCheckedIn: false,
        });

        getClientData();
    };

    return (
        <div>
            <h1>Check-out page</h1>

            <p>{`${oldClientData?.firstName} ${oldClientData?.lastName}`}</p>
            <p>{oldClientData ? oldClientData.notes : null}</p>
            <p>
                {oldClientData?.isCheckedIn ? 'Checked in' : 'Not checked in'}
            </p>

            <h2>Edit data</h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    checkIn();
                }}
            >
                <button type="submit">Check out</button>
            </form>
        </div>
    );
}
