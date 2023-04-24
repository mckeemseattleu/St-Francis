'use client';

import Spinner from '@/components/Spinner/Spinner';
import { useAlert, useQueryCache } from '@/hooks/index';
import { updateClient } from '@/utils/mutations';
import { CLIENTS_PATH, getClient } from '@/utils/queries';
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
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <h2>{`${clientData?.firstName} ${clientData?.lastName}`}</h2>

                    <p>
                        {clientData?.isCheckedIn
                            ? 'Checked in'
                            : 'Not checked in'}
                    </p>

                    <Link href={`/update/${params.userId}`}>
                        <button>Edit profile</button>
                    </Link>
                </div>

                <h2>Notes:</h2>
                <p>{clientData ? clientData.notes : null}</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent redirect
                    checkOut();
                }}
            >
                <button type="submit">Check out</button>
            </form>
        </div>
    );
}
