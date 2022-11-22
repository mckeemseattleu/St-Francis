'use client';

import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
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
    const [visitData, setVisitData] = useState<any>({
        clothingMen: false,
        clothingWomen: false,
        clothingBoy: false,
        clothingGirl: false,
        household: '',
        notes: '',
        timestamp: new Date(),
    });

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

    // Checkin process
    const checkIn = async () => {
        // Update isCheckedIn status to true
        await updateDoc(doc(firestore, 'clients', params.userId), {
            isCheckedIn: true,
        });

        // Update timestamp to current time
        setVisitData((prev: typeof visitData) => ({
            ...prev,
            timestamp: new Date(),
        }));

        // Add new visit entry
        await addDoc(
            collection(firestore, 'clients', params.userId, 'visits'),
            visitData
        );

        // Get updated client data
        getClientData();

        // Redirect to user profile page after checking user in
        router.push(`/profile/${params.userId}`);
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
                <h2>Clothing</h2>

                <label htmlFor="clothingMen">Men</label>
                <input
                    type="checkbox"
                    name="clothingMen"
                    id="clothingMen"
                    value={visitData.clothingMen ? 'on' : 'off'}
                    onChange={(e) => {
                        setVisitData((prev: any) => ({
                            ...prev,
                            clothingMen: e.target.checked,
                        }));
                    }}
                />
                <br />

                <label htmlFor="clothingWomen">Women</label>
                <input
                    type="checkbox"
                    name="clothingWomen"
                    id="clothingWomen"
                    value={visitData.clothingWomen ? 'on' : 'off'}
                    onChange={(e) => {
                        setVisitData((prev: any) => ({
                            ...prev,
                            clothingWomen: e.target.checked,
                        }));
                    }}
                />
                <br />

                <label htmlFor="clothingBoy">Kids (Boy)</label>
                <input
                    type="checkbox"
                    name="clothingBoy"
                    id="clothingBoy"
                    value={visitData.clothingBoy ? 'on' : 'off'}
                    onChange={(e) => {
                        setVisitData((prev: any) => ({
                            ...prev,
                            clothingBoy: e.target.checked,
                        }));
                    }}
                />
                <br />

                <label htmlFor="clothingGirl">Kids (Girl)</label>
                <input
                    type="checkbox"
                    name="clothingGirl"
                    id="clothingGirl"
                    value={visitData.clothingGirl ? 'on' : 'off'}
                    onChange={(e) => {
                        setVisitData((prev: any) => ({
                            ...prev,
                            clothingGirl: e.target.checked,
                        }));
                    }}
                />
                <br />

                <label htmlFor="notes">Notes</label>
                <input
                    type="text"
                    name="notes"
                    id="notes"
                    value={visitData.notes}
                    onChange={(e) => {
                        setVisitData((prev: typeof visitData) => ({
                            ...prev,
                            notes: e.target.value,
                        }));
                    }}
                />
                <br />

                <label htmlFor="household">Household items</label>
                <input
                    type="text"
                    name="household"
                    id="household"
                    value={visitData.household}
                    onChange={(e) => {
                        setVisitData((prev: typeof visitData) => ({
                            ...prev,
                            household: e.target.value,
                        }));
                    }}
                />
                <br />

                <button type="submit">Check in</button>
            </form>
        </div>
    );
}
