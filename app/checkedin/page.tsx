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
import styles from './checkedin.module.css';

export default function CheckedIn() {
    const [clients, setClients] = useState<Array<Client>>();

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
                notes: client.data().notes,
                isCheckedIn: client.data().isCheckedIn,
            }))
        );
    };

    // Create a ClientCard for each Client in clients, if they exist
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
        <div className="container">
            <h1>Checked in clients</h1>
            <div className={styles.cardContainer}>{clientsList}</div>
        </div>
    );
}
