'use client';
import { ClientList } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import type { Client } from '@/models/index';
import { listClients } from '@/utils/index';
import { useQuery } from 'react-query';

export default function CheckedIn() {
    // Gets all clients whose isCheckedIn status is true
    const { isLoading, data } = useQuery('checkedin-clients', () =>
        listClients({ isCheckedIn: true })
    );

    return (
        <>
            <h1>Checked in clients</h1>
            {isLoading ? (
                <Spinner />
            ) : (
                <ClientList
                    clients={data as Client[]}
                    noDataMessage="No clients are currently checked in"
                />
            )}
        </>
    );
}
