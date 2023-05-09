'use client';

import { ClientInfoForm } from '@/components/Client/index';
import Spinner from '@/components/Spinner/Spinner';
import { useAlert, useQueryCache } from '@/hooks/index';
import {
    CLIENTS_PATH,
    DocFilter,
    getClient,
    toUTCDateString,
    updateClient,
} from '@/utils/index';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';

interface UpdateProps {
    params: { userId: string };
}

export default function Update({ params }: UpdateProps) {
    const { updateClientCache } = useQueryCache();
    const [, setAlert] = useAlert();
    const { isLoading, data } = useQuery([CLIENTS_PATH, params.userId], () =>
        getClient(params.userId)
    );
    const router = useRouter();
    // Transform Client data with birthday converted to UTC
    const transformData = (clientData: DocFilter) => ({
        ...clientData,
        birthday: new Date(clientData.birthday as string),
    });

    const onUpdate = async (clientData: DocFilter) => {
        // save existing client and redirect to profile page
        try {
            clientData = transformData(clientData);
            await updateClient(clientData);
            updateClientCache(clientData);

            setAlert({
                message: 'Client Successfully Updated.',
                type: 'success',
            });
            router.push(`/profile/${clientData.id}`);
        } catch (error: any) {
            setAlert({ message: error.message, type: 'error' });
        }
    };

    const onSaveAndCheck = async (clientData: DocFilter) => {
        // save and check-out, redirect to checkout page
        if (clientData.isCheckedIn) {
            return router.push(`/checkout/${clientData.id}`);
        }
        // save and redirect to check-in page
        try {
            clientData = transformData(clientData);
            await updateClient(clientData);
            updateClientCache(clientData);
            setAlert({
                message: 'Client Saved, Check-In Now',
                type: 'success',
            });
            router.push(`/checkin/${clientData.id}`);
        } catch (error: any) {
            setAlert({ message: error.message, type: 'error' });
        }
    };

    if (isLoading) return <Spinner />;
    if (!data) return <>Client Not Found</>;
    const key = data.isCheckedIn ? 'Save and Check-out' : 'Save and Check-in';
    return (
        <ClientInfoForm
            initialData={{
                ...data,
                birthday: toUTCDateString(data.birthday),
            }}
            title={'Update Client Form'}
            actions={{
                Save: onUpdate,
                [key]: onSaveAndCheck,
            }}
        />
    );
}
