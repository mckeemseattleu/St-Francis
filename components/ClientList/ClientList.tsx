'use client';

import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';
import ClientCard from './ClientCard/ClientCard';

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    notes: string;
}

interface Filter {
    firstName: string;
    lastName: string;
}

export default function ClientList() {
    const [clients, setClients] = useState<Array<Client>>();
    const [filter, setFilter] = useState<Filter>({
        firstName: '',
        lastName: '',
    });

    const getClientsData = async (e: any) => {
        // Prevent redirect
        e.preventDefault();

        // Init query before choosing which filters to apply
        let clientsQuery;

        // Apply filters
        if (filter.firstName === '' && filter.lastName === '') {
            // Get all clients
            clientsQuery = query(collection(firestore, 'clients'));
        } else if (filter.firstName === '') {
            // Get only by last name
            clientsQuery = query(
                collection(firestore, 'clients'),
                where('lastName', '==', filter.lastName)
            );
        } else if (filter.lastName === '') {
            // Get only by first name
            clientsQuery = query(
                collection(firestore, 'clients'),
                where('firstName', '==', filter.firstName)
            );
        } else {
            // Get by first and last name
            clientsQuery = query(
                collection(firestore, 'clients'),
                where('firstName', '==', filter.firstName),
                where('lastName', '==', filter.lastName)
            );
        }

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
            <h1>Clients</h1>

            <form
                onSubmit={(e) => {
                    getClientsData(e);
                }}
            >
                <label>
                    First name
                    <input
                        type="text"
                        name="firstName"
                        value={filter.firstName}
                        onChange={(e) => {
                            setFilter((prev: Filter) => {
                                return {
                                    firstName: e.target.value,
                                    lastName: prev.lastName,
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
                        name="firstName"
                        value={filter.lastName}
                        onChange={(e) => {
                            setFilter((prev: Filter) => {
                                return {
                                    firstName: prev.firstName,
                                    lastName: e.target.value,
                                };
                            });
                        }}
                    />
                </label>
                <br />

                <button type="submit">Filter</button>
            </form>

            {clientsList}
        </div>
    );
}
