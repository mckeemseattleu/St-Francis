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
import { ClientCardInfo } from '../../components/ClientList/ClientList';
import { firestore } from '../../firebase/firebase';
import styles from './checkedin.module.css';

export default function CheckedIn() {
    const [clients, setClients] = useState<Array<ClientCardInfo>>();

    // Get client data on component load
    useEffect(() => {
        getClientsData();
    }, []);

    // Gets all clients whose isCheckedIn status is true
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

        // Take results and create an array of Client, set clients to that array
        setClients(
            result.map((client) => ({
                id: client.id,
                firstName: client.data().firstName,
                lastName: client.data().lastName,
                birthday: client.data().birthday,
                notes: client.data().notes,
                isCheckedIn: client.data().isCheckedIn,
                isBanned: client.data().isBanned,
            }))
        );
    };

    // Create a ClientCard for each Client in clients, if they exist
    const clientsList = clients?.map((client: ClientCardInfo) => {
        return (
            <ClientCard
                id={client.id}
                firstName={client.firstName}
                lastName={client.lastName}
                birthday={client.birthday}
                isBanned={client.isBanned}
                notes={client.notes}
                key={client.id}
            />
        );
    });

    return (
        <div className="container">
            <h1>Checked in clients</h1>
            {clients && clients.length > 0 ? (
                <div className={styles.cardContainer}>{clientsList}</div>
            ) : (
                <p>No clients are currently checked in</p>
            )}
        </div>
    );
}
