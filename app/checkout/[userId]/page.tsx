'use client';

import { ClientStatus } from '@/components/Client';
import Spinner from '@/components/Spinner/Spinner';
import { Button } from '@/components/UI';
import { useAlert, useQueryCache } from '@/hooks/index';
import { CLIENTS_PATH, getClient, updateClient } from '@/utils/index';
import ErrorPage from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import styles from './checkout.module.css';

interface CheckOutProps {
    params: { userId: string };
}

export default function CheckOut({ params }: CheckOutProps) {
    const { updateClientCache } = useQueryCache();
    const [, setAlert] = useAlert();
    const router = useRouter();

    const { isLoading, data: clientData } = useQuery(
        [CLIENTS_PATH, params.userId],
        () => getClient(params.userId)
    );

    // Sets isCheckedIn status to false then gets updated client data
    const checkOut = async () => {
        const data = await updateClient({
            ...clientData,
            isCheckedIn: false,
        });
        updateClientCache(data);
        setAlert({
            message: `Successfully Checked Out ${clientData?.firstName}`,
            type: 'success',
        });
        router.push(`/checkedin`);
    };

    if (isLoading) return <Spinner />;
    if (!clientData) return <ErrorPage statusCode={404} withDarkMode={false} />;

    return (
        <div className={styles.container}>
            <h1>Checkout Page</h1>
            <div className={styles.rowContainer}>
                <h1>{`${clientData?.firstName} ${clientData?.lastName}`}</h1>
                <ClientStatus
                    isBanned={!!clientData.isBanned}
                    isCheckedIn={!!clientData.isCheckedIn}
                    unhoused={!!clientData.unhoused}
                />
            </div>
            <hr />
            <div className={styles.rowContainer}>
                <Button>
                    <Link href={`/profile/${params.userId}`}>Profile</Link>
                </Button>
                <Button>
                    <Link href={`/update/${params.userId}`}>Edit</Link>
                </Button>
                <Button type="submit" onClick={checkOut}>
                    Check out
                </Button>
            </div>
            <h2>Notes:</h2>
            <p>{clientData ? clientData.notes : null}</p>
        </div>
    );
}
