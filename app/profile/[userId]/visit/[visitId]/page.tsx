'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { firestore } from '../../../../../firebase/firebase';
import { VisitDoc } from '../../../../checkin/[userId]/page';

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

    return (
        <>
            <h1>Visit</h1>
        </>
    );
}
