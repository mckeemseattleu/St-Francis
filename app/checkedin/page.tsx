'use client';
import { ClientList } from '@/components/Client/index';
import type { Client } from '@/models/index';
import { listClients } from '@/utils/index';
import { useQuery } from 'react-query';

export default function CheckedIn() {
    // Gets all clients whose isCheckedIn status is true
    const { isLoading, data } = useQuery('checkedin-clients', () =>
        listClients({ isCheckedIn: true })
    );

    return (
        <ClientList
            clients={data as Client[]}
            noDataMessage="No clients are currently checked in"
            title="Checked in clients"
            isLoading={isLoading}
        />
    );
}
