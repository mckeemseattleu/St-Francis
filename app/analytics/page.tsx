'use client';
import { ClientList } from '@/components/Client';
import {
    genderList,
    raceList,
} from '@/components/Client/ClientInfoForm/ClientInfoForm';
import ReportForm from '@/components/Report/ReportForm';
import { Client } from '@/models/index';
import { CLIENTS_PATH } from '@/utils/constants';
import { DocFilter } from '@/utils/fetchData';
import { listClients } from '@/utils/queries';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export default function AnalyticsPage() {
    const [fields, setFields] = useState<DocFilter>();
    const { data, isLoading, refetch } = useQuery({
        queryKey: [CLIENTS_PATH, 'report'],
        queryFn: async () => {
            let clients: Array<Client> = [];
            clients = await listClients(fields);
            console.log(clients);
            return { clients, fields };
        },
        enabled: false,
    });

    useEffect(() => {
        if (fields) refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields]);

    const getGenderCounts = (clients: Client[]) => {
        const men = clients.filter(
            (client) => client.gender === genderList[0]
        ).length;
        const women = clients.filter(
            (client) => client.gender === genderList[1]
        ).length;
        const other = clients.length - men - women;
        return [men, women, other];
    };

    const getRaceCounts = (clients: Client[]) => {
        const raceCounts = [0, 0, 0, 0, 0, 0, 0];
        raceCounts.forEach((count, i) => {
            clients.forEach((client) =>
                client.race === raceList[i] ? raceCounts[i]++ : null
            );
        });
        return raceCounts;
    };

    const shelterCount = (clients: Client[]) => {
        return clients.filter((client) => client.sheltered === true).length;
    }

    const unhousedCount = (clients: Client[]) => {
        return clients.filter((client) => client.unhoused === true).length;
    }

    const bannedCount = (clients: Client[]) => {
        return clients.filter((client) => client.isBanned === true).length;
    }

    const bpcResidentCount = (clients: Client[]) => {
        return clients.filter((client) => client.BPCResident === true).length;
    }

    const numKids = (clients: Client[]) => {
        let count = 0;
        clients.forEach((client) => {
            count += client.numKids || 0;
        });
        return count;
    }

    return (
        <div>
            <h1>Analytics</h1>
            <ReportForm onSubmit={setFields} />
            {isLoading ? (
                <p>Loading...</p>
            ) : data?.clients ? (
                <div>
                    {getGenderCounts(data.clients).map((count, i) => (
                        <p>
                            {genderList[i]}:{count}
                        </p>
                    ))}
                    <p>Number of Kids: {numKids(data.clients)}</p>
                    <p>Sheltered: {shelterCount(data.clients)}</p>
                    <p>Unhoused: {unhousedCount(data.clients)}</p>
                    <p>Banned: {bannedCount(data.clients)}</p>
                    <p>BPC Residents: {bpcResidentCount(data.clients)}</p>
                    {getRaceCounts(data.clients).map((count, i) => (
                        <div>
                            <p>
                                {raceList[i]}: {count}
                            </p>
                        </div>
                    ))}

                </div>
            ) : (
                'No matching data within date range'
            )}
        </div>
    );
}
