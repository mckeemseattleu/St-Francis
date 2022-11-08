'use client';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase/firebase';
import { Client } from '../../../components/ClientList/ClientList';
import { useRouter } from 'next/navigation';

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
    const [newClientData, setNewClientData] = useState<ClientDoc>({
        firstName: '',
        lastName: '',
        notes: '',
    });

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
            });

            setNewClientData({
                firstName: clientDoc.data().firstName,
                lastName: clientDoc.data().lastName,
                notes: clientDoc.data().notes,
            });
        } else {
            router.push('/');
        }
    };

    const updateClientData = async () => {
        await setDoc(doc(firestore, 'clients', params.userId), newClientData);

        getClientData();
    };

    return (
        <div>
            <h1>Update user page</h1>

            <h2>Old data</h2>
            <p>{`${oldClientData?.firstName} ${oldClientData?.lastName}`}</p>
            <p>{oldClientData ? oldClientData.notes : null}</p>

            <h2>Edit data</h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateClientData();
                }}
            >
                <label>
                    First name
                    <input
                        type="text"
                        name="firstName"
                        value={newClientData.firstName}
                        onChange={(e) => {
                            setNewClientData((prev: ClientDoc) => {
                                return {
                                    firstName: e.target.value,
                                    lastName: prev.lastName,
                                    notes: prev.notes,
                                };
                            });
                        }}
                    />
                </label>
                <br />

                <label>
                    Last name
                    <input
                        type="text"
                        name="lastName"
                        value={newClientData.lastName}
                        onChange={(e) => {
                            setNewClientData((prev: ClientDoc) => {
                                return {
                                    firstName: prev.firstName,
                                    lastName: e.target.value,
                                    notes: prev.notes,
                                };
                            });
                        }}
                    />
                </label>
                <br />

                <label>
                    Notes
                    <input
                        type="text"
                        name="notes"
                        value={newClientData.notes}
                        onChange={(e) => {
                            setNewClientData((prev: ClientDoc) => {
                                return {
                                    firstName: prev.firstName,
                                    lastName: prev.lastName,
                                    notes: e.target.value,
                                };
                            });
                        }}
                    />
                </label>
                <br />

                <button type="submit">Update</button>
            </form>
        </div>
    );
}
