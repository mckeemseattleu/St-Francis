'use client';
import { ClientInfoForm } from '@/components/Client/index';
import { createClient, DocFilter } from '@/utils/index';
import { useRouter } from 'next/navigation';

export default function AddClient() {
    const router = useRouter();

    const onSave = async (clientData: DocFilter) => {
        // save new client and redirect to profile page
        const id = await createClient(clientData);
        router.push(`/profile/${id}`);
    };

    const onSaveAndCheck = async (clientData: DocFilter) => {
        // save new client and redirect to check-in page
        const id = await createClient(clientData);
        router.push(`/checkin/${id}`);
    };

    return (
        <div className="container">
            <ClientInfoForm
                title="New Client"
                onSave={onSave}
                onSaveAndCheck={onSaveAndCheck}
            />
        </div>
    );
}
