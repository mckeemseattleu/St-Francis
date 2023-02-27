'use client';

import { ClientInfoForm } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import { Client } from '@/models/index';
import { DocFilter, getClient, updateClient } from '@/utils/index';
import { CLIENTS_PATH } from '@/utils/queries';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from 'react-query';

interface UpdateProps {
    params: { userId: string };
}

export default function Update({ params }: UpdateProps) {
    const queryClient = useQueryClient();
    const { isLoading, data } = useQuery([CLIENTS_PATH, params.userId], () =>
        getClient(params.userId)
    );
    const router = useRouter();

    // TODO: update cached query data instead of removing it, no refetch needed
    // TODO: move this logic to the updateClient helper function
    const updateCache = (clientData: DocFilter) => {
        // Remove cached query data when update is successful, refetch on next page load
        queryClient.removeQueries([CLIENTS_PATH, params.userId]);
        // Remove cached query data for checked-in clients query, refetch on next page load
        queryClient.removeQueries([CLIENTS_PATH, 'checkedin']);

        // Update cached query data for searched clients query, no refetch needed
        queryClient.setQueriesData(CLIENTS_PATH, (data: any) => {
            if (!data) return;
            data[CLIENTS_PATH].forEach((client: Client, index: number) => {
                if (client.id === clientData.id)
                    data[CLIENTS_PATH][index] = { ...client, ...clientData };
            });
            return data;
        });
    };

    const onUpdate = async (clientData: DocFilter) => {
        // save existing client and redirect to profile page
        await updateClient(clientData);
        updateCache(clientData);
        router.push(`/profile/${clientData.id}`);
    };

    const onSaveAndCheck = async (clientData: DocFilter) => {
        // save and check-out, redirect to profile page
        if (clientData.isCheckedIn) {
            clientData.isCheckedIn = false;
            await onUpdate(clientData);
            return;
        }

        // save and redirect to check-in page
        await updateClient(clientData);
        updateCache(clientData);
        router.push(`/checkin/${clientData.id}`);
    };

    if (isLoading) return <Spinner />;
    if (!data) return <>Client Not Found</>;

    return (
        <div className="container">
            <ClientInfoForm
                initialData={data}
                title={'Update Client Form'}
                onSave={onUpdate}
                onSaveAndCheck={onSaveAndCheck}
            />
        </div>
    );
}
