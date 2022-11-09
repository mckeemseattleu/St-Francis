'use client';

import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ClientCard from '../../components/ClientList/ClientCard/ClientCard';
import { Client } from '../../components/ClientList/ClientList';
import { firestore } from '../../firebase/firebase';

export default function CheckedIn() {
    const [clients, setClients] = useState<Array<Client>>();

    useEffect(() => {
        getClientsData();
    }, []);

    const getClientsData = async () => {
        let clientsQuery;

        clientsQuery = query(
            collection(firestore, 'clients'),
            where('isCheckedIn', '==', true)
        );

        const querySnapshot = await getDocs(clientsQuery);

        const result: QueryDocumentSnapshot<DocumentData>[] = [];

        querySnapshot.forEach((snapshot) => {
            result.push(snapshot);
        });

        setClients(
            result.map((client) => ({
                id: client.id,
                firstName: client.data().firstName,
                lastName: client.data().lastName,
                notes: client.data().notes,
                isCheckedIn: client.data().isCheckedIn,
            }))
        );
    };

    const clientsList = clients?.map((client: Client) => {
        return (
            <ClientCard
                id={client.id}
                firstName={client.firstName}
                lastName={client.lastName}
                notes={client.notes}
                key={client.id}
            />
        );
    });

    return (
        <div>
            <h1>Checked in clients</h1>
            {clientsList}
        </div>
    );
}
