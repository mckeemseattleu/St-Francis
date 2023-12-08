'use client';
import { ClientInfoForm } from '@/components/Client/index';
import { useAlert } from '@/hooks/index';
import { createClient, DocFilter, fetchData } from '@/utils/index';
import { useRouter } from 'next/navigation';

export default function AddClient() {
    const router = useRouter();
    const [, setAlert] = useAlert();

    // Transform Client data with birthday converted to UTC
    const transformData = (clientData: DocFilter) => ({
        ...clientData,
        birthday: new Date(clientData.birthday as string),
    });

    // check for duplicate client using (fistName + lastName + birthday + gender)
    const checkForDuplicateClient = async (clientData: DocFilter) => {
        try {
            const filter = {
                firstNameLower: clientData.firstNameLower,
                lastNameLower: clientData.lastNameLower,
                birthday: clientData.birthday,
                gender: clientData.gender,
            };
            const clients = await fetchData(filter);
            return Array.isArray(clients) && clients.length > 0;
        } catch (err: any) {
            setAlert({
                message: err.message,
                type: 'error',
            });
        }
    };

    // save new client and redirect to profile page
    const onSave = async (clientData: DocFilter) => {
        try {
            // alert if duplicate client already exists
            const isDuplicate = await checkForDuplicateClient(
                transformData(clientData)
            );
            if (isDuplicate) {
                setAlert({
                    message: 'Duplicate client detected. Client not created.',
                    type: 'error',
                });
                return;
            }

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
            // alert if duplicate client already exists
            const isDuplicate = await checkForDuplicateClient(
                transformData(clientData)
            );
            if (isDuplicate) {
                setAlert({
                    message: 'Duplicate client detected. Client not created.',
                    type: 'error',
                });
                return;
            }

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
            actions={{ Save: onSave, 'Save and check in': onSaveAndCheck }}
        />
    );
}
