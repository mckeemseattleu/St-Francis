'use client';

import {
    collection,
    DocumentData,
    getDocs,
    limit,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';
import ClientCard from './ClientCard/ClientCard';
import styles from './ClientList.module.css';

export interface ClientCardInfo {
    id: string;
    firstName: string;
    lastName: string;
    birthday: string;
    notes: string;
    isCheckedIn: boolean;
    isBanned: boolean;
}

interface Filter {
    firstName: string;
    lastName: string;
    birthday: string;
}

export default function ClientList() {
    const [clients, setClients] = useState<Array<ClientCardInfo>>();
    const [filter, setFilter] = useState<Filter>({
        firstName: '',
        lastName: '',
        birthday: new Date().toISOString().substr(0, 10),
    });
    const [filterByBirthday, setFilterByBirthday] = useState<boolean>(false);

    // TODO: Reevaluate if open queries with no filters should even be allowed
    // Max number of clients returned when no search params are provided and
    // query will return all clients
    const MAX_CLIENTS_RETURNED = 50;

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
                    where('lastNameLower', '==', filter.lastName.toLowerCase()),
                    where('birthday', '==', filter.birthday)
                );
            } else if (filter.lastName === '') {
                // Get only by first name and birthday
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('firstNameLower', '==', filter.firstName.toLowerCase()),
                    where('birthday', '==', filter.birthday)
                );
            } else {
                // Get by first and last name and birthday
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('firstNameLower', '==', filter.firstNameLower.toLowerCase()),
                    where('lastNameLower', '==', filter.lastName.toLowerCase()),
                    where('birthday', '==', filter.birthday)
                );
            }
        } else {
            if (filter.firstName === '' && filter.lastName === '') {
                // Get all clients
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    limit(MAX_CLIENTS_RETURNED)
                );
            } else if (filter.firstName === '') {
                // Get only by last name
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('lastNameLower', '==', filter.lastName)
                );
            } else if (filter.lastName === '') {
                // Get only by first name
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('firstNameLower', '==', filter.firstName)
                );
            } else {
                // Get by first and last name
                clientsQuery = query(
                    collection(firestore, 'clients'),
                    where('firstNameLower', '==', filter.firstName),
                    where('lastNameLower', '==', filter.lastName)
                );
            }
        }

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
    const clientsList =
        // If clients arr exist and isn't empty
        clients && clients.length > 0 ? (
            clients?.map((client: ClientCardInfo) => {
                return (
                    <ClientCard
                        id={client.id}
                        firstName={client.firstName}
                        lastName={client.lastName}
                        birthday={client.birthday}
                        notes={client.notes}
                        key={client.id}
                        isBanned={client.isBanned}
                    />
                );
            })
        ) : clients ? (
            // If clients is 0 length arr, user searched something but found
            // nothing
            <h1>No matching clients</h1>
        ) : // If clients doesn't exist at all, the page just loaded and no
        // search happened yet
        null;

    return (
        <>
            <div className="container">
                <h1>Lookup Client</h1>

                <form
                    onSubmit={(e) => {
                        getClientsData(e);
                    }}
                >
                    <div className={styles.formContainer}>
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

                        <label>
                            Birthday
                            <div className={styles.birthdayControlsContainer}>
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
                            </div>
                        </label>
                    </div>

                    <div className={styles.formControls}>
                        <button type="submit">Filter</button>

                        <Link href="/add-client">
                            <button>New client</button>
                        </Link>
                    </div>
                </form>
                <br />
                <br />
            </div>

            <div className={styles.cardContainer}>{clientsList}</div>
        </>
    );
}
