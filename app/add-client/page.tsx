'use client';
import { ClientInfoForm } from '@/components/Client/index';
import { useAlert } from '@/hooks/index';
import { createClient, DocFilter } from '@/utils/index';
import { useRouter } from 'next/navigation';

export default function AddClient() {
    const router = useRouter();
    const [, setAlert] = useAlert();

    // Transform Client data with birthday converted to UTC
    const transformData = (clientData: DocFilter) => ({
        ...clientData,
        birthday: new Date(clientData.birthday as string),
    });

    // save new client and redirect to profile page
    const onSave = async (clientData: DocFilter) => {
        try {
            const client = await createClient(transformData(clientData));
            setAlert({
                message: 'Client Successfully Created.',
                type: 'success',
            });
            router.push(`/profile/${client.id}`);
        } catch (err: any) {
            setAlert({
                message: err.message,
                type: 'error',
            });
        }
    };

    // save new client and redirect to check-in page
    const onSaveAndCheck = async (clientData: DocFilter) => {
        try {
            const client = await createClient(transformData(clientData));
            setAlert({
                message: 'Client Created, Check-In Now',
                type: 'success',
            });
            router.push(`/checkin/${client.id}`);
        } catch (err: any) {
            setAlert({
                message: err.message,
                type: 'error',
            });
        }
    };

    return (
        <ClientInfoForm
            title="New Client"
            onSave={onSave}
            onSaveAndCheck={onSaveAndCheck}
        />
    );
}
