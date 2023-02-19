'use client';
import { ClientList } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import type { Client } from '@/models/index';
import { fetchData } from '@/utils/fetchData';
import { useEffect, useState } from 'react';

export default function CheckedIn() {
    const [clients, setClients] = useState<Array<Client>>([]);
    const [loading, setLoading] = useState(false);

    // Get client data on component load
    useEffect(() => {
        getClientsData();
    }, []);

    // Gets all clients whose isCheckedIn status is true
    const getClientsData = async () => {
        const fields = { isCheckedIn: true };
        setLoading(true);
        const data = await fetchData<Client>(fields);
        setClients(data);
        setLoading(false);
    };

    return (
        <div className="container">
            <h1>Checked in clients</h1>
            {loading ? (
                <Spinner />
            ) : (
                <ClientList
                    clients={clients}
                    noDataMessage="No clients are currently checked in"
                />
            )}
        </div>
    );
}
