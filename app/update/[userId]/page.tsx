'use client';

import { ClientInfoForm } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import { DocFilter, getClient, updateClient } from '@/utils/index';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';

interface UpdateProps {
    params: { userId: string };
}

export default function Update({ params }: UpdateProps) {
    const { isLoading, data } = useQuery(
        ['selected-clients', params.userId],
        () => getClient(params.userId)
    );
    const router = useRouter();

    const onUpdate = async (clientData: DocFilter) => {
        // save existing client and redirect to profile page
        await updateClient(clientData);
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
