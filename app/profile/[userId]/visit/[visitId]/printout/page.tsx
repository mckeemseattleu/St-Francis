'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { firestore } from '../../../../../../firebase/firebase';
import { VisitDoc } from '../../../../../checkin/[userId]/page';
import { ClientDoc } from '../../../page';

interface PrintoutProps {
    params: { visitId: string; userId: string };
}

export default function Printout({ params }: PrintoutProps) {
    const router = useRouter();
    const [visitData, setVisitData] = useState<VisitDoc>();
    const [clientData, setClientData] = useState<ClientDoc>();

    // Get visit data on component load
    useEffect(() => {
        getClientData();
        getVisitData();
    }, []);

    // Gets the client's document from firestore based on route's clientId
    const getClientData = async () => {
        const clientDoc = await getDoc(
            doc(firestore, 'clients', params.userId)
        );

        if (clientDoc.exists()) {
            setClientData(clientDoc.data() as ClientDoc);
        } else {
            router.push('/');
        }
    };

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

    return (
        <>
            <h1>{`${clientData?.firstName} ${clientData?.lastName}'s Shopping List`}</h1>
            <h1>
                {
                    // Uses timestamp, if undefined uses today's date
                    new Date(
                        visitData
                            ? visitData?.timestamp?.seconds * 1000
                            : new Date()
                    ).toDateString()
                }
            </h1>
        </>
    );
}
