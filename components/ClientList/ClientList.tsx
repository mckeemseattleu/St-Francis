'use client';

import {
    collection,
    DocumentData,
    getDocs,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';
import ClientCard from './ClientCard/ClientCard';
import styles from './ClientList.module.css';

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    notes: string;
    isCheckedIn: boolean;
}

interface Filter {
    firstName: string;
    lastName: string;
    birthday: string;
}

export default function ClientList() {
    const [clients, setClients] = useState<Array<Client>>();
    const [filter, setFilter] = useState<Filter>({
        firstName: '',
        lastName: '',
        birthday: new Date().toISOString().substr(0, 10),
    });
    const [filterByBirthday, setFilterByBirthday] = useState<boolean>(false);

    const getClientsData = async (e: any) => {
        // Prevent redirect
        e.preventDefault();

        // Init query before choosing which filters to apply
        let clientsQuery;

        // TODO: Consider refactoring filter logic
        // Apply filters
        if (filterByBirthday) {
            if (filter.firstName === '' && filter.lastName === '') {
                // Get all clients with birthday
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('birthday', '==', filter.birthday)
                );
            } else if (filter.firstName === '') {
                // Get only by last name and birthday
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('lastName', '==', filter.lastName),
                    where('birthday', '==', filter.birthday)
                );
            } else if (filter.lastName === '') {
                // Get only by first name and birthday
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('firstName', '==', filter.firstName),
                    where('birthday', '==', filter.birthday)
                );
            } else {
                // Get by first and last name and birthday
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('firstName', '==', filter.firstName),
                    where('lastName', '==', filter.lastName),
                    where('birthday', '==', filter.birthday)
                );
            }
        } else {
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
            <h1>Clients</h1>

            <Link href="/add-client">New client</Link>
            <br />
            <br />

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
                                    birthday: prev.birthday,
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
                                    birthday: prev.birthday,
                                };
                            });
                        }}
                    />
                </label>
                <br />

                <label>
                    Birthday
                    <input
                        type="date"
                        name="birthday"
                        id="birthday"
                        value={filter.birthday}
                        onChange={(e) => {
                            setFilter((prev: Filter) => {
                                return {
                                    firstName: prev.firstName,
                                    lastName: prev.lastName,
                                    birthday: e.target.value,
                                };
                            });
                        }}
                    />
                    <input
                        type="checkbox"
                        name="filterByBirthday"
                        id="filterByBirthday"
                        value={filterByBirthday ? 'on' : 'off'}
                        onChange={(e) => {
                            setFilterByBirthday(e.target.checked);
                        }}
                    />
                </label>
                <br />

                <button type="submit">Filter</button>
            </form>

            <div className={styles.cardContainer}>{clientsList}</div>
        </div>
    );
}
