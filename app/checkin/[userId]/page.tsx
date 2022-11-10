'use client';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { Client } from '../../../components/ClientList/ClientList';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CheckinProps {
    params: { userId: string };
}

export default function Checkin({ params }: CheckinProps) {
    const router = useRouter();
    const [oldClientData, setOldClientData] = useState<Client>();

    // Get client data on component load
    useEffect(() => {
        getClientData();
    }, []);

    // Gets the client's data from firestore based on route's userId
    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        // Set local state if their doc exists, otherwise go back to homepage
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

    // Sets isCheckedIn status to true then gets updated client data
    const checkIn = async () => {
        await updateDoc(doc(firestore, 'clients', params.userId), {
            isCheckedIn: true,
        });

        getClientData();
    };

    return (
        <div>
            <h1>Check-in page</h1>

            <p>{`${oldClientData?.firstName} ${oldClientData?.lastName}`}</p>
            <p>{oldClientData ? oldClientData.notes : null}</p>
            <p>
                {oldClientData?.isCheckedIn ? 'Checked in' : 'Not checked in'}
            </p>

            <Link href={`/update/${params.userId}`}>Edit data</Link>
            <br />

            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent redirect
                    checkIn();
                }}
            >
                <button type="submit">Check in</button>
            </form>
        </div>
    );
}
