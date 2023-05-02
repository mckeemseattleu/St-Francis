'use client';

import Spinner from '@/components/Spinner/Spinner';
import { Button } from '@/components/UI';
import VisitInfoForm from '@/components/Visit/VisitInfoForm';
import { useAlert } from '@/hooks/index';
import { Visit as VisitModel } from '@/models/index';
import { deleteVisit, updateVisit } from '@/utils/mutations';
import { CLIENTS_PATH, getVisit, VISITS_PATH } from '@/utils/queries';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styles from './visit.module.css';

interface VisitProps {
    params: { visitId: string; userId: string };
}

export default function Visit({ params }: VisitProps) {
    const router = useRouter();
    const [, setAlert] = useAlert();
    const {
        isLoading,
        data: visitData,
        refetch,
    } = useQuery(
        [CLIENTS_PATH, params.userId, VISITS_PATH, params.visitId],
        () => getVisit(params.userId, params.visitId)
    );
    const [edit, setEdit] = useState(false);

    const removeVisit = async () => {
        await deleteVisit(params.visitId, params.userId);
        setAlert({ message: 'Successfully deleted visit', type: 'success' });
        // Redirect back to client profile
        router.push(`/profile/${params.userId}`);
    };
    if (isLoading) return <Spinner />;

    const handleSubmit = async (data: VisitModel) => {
        await updateVisit(data, params.userId);
        setAlert({ message: 'Visit updated', type: 'success' });
        refetch();
        setEdit(false);
    };

    return (
        <>
            <h1>Visit Details</h1>
            <div>
                {visitData?.createdAt ? (
                    <h2>{visitData?.createdAt?.toDate()?.toLocaleString()}</h2>
                ) : null}
            </div>
            {(edit && (
                <VisitInfoForm
                    initialVisitData={visitData}
                    onSubmit={handleSubmit}
                />
            )) || (
                <>
                    <h2>Clothing</h2>
                    {visitData?.clothingBoy ||
                    visitData?.clothingWomen ||
                    visitData?.clothingBoy ||
                    visitData?.clothingGirl ? (
                        <>
                            <p>{visitData?.clothingMen ? 'Men' : null}</p>
                            <p>{visitData?.clothingWomen ? 'Women' : null}</p>
                            <p>
                                {visitData?.clothingBoy ? 'Kids (boy)' : null}
                            </p>
                            <p>
                                {visitData?.clothingGirl ? 'Kids (girl)' : null}
                            </p>
                        </>
                    ) : (
                        <p>None</p>
                    )}

                    <h2>Special Requests</h2>
                    {visitData?.backpack ||
                    visitData?.sleepingBag ||
                    visitData?.busTicket ||
                    visitData?.giftCard ||
                    visitData?.diaper ||
                    visitData?.financialAssistance ? (
                        <>
                            <p>{visitData?.backpack ? 'Backpack' : null}</p>
                            <p>
                                {visitData?.sleepingBag ? 'Sleeping Bag' : null}
                            </p>
                            <p>
                                {visitData?.busTicket
                                    ? `Bus Tickets: ${visitData?.busTicket}`
                                    : null}
                            </p>
                            <p>
                                {visitData?.giftCard
                                    ? `Gift Card: ${visitData?.giftCard}`
                                    : null}
                            </p>
                            <p>
                                {visitData?.diaper
                                    ? `Diapers: ${visitData?.diaper}`
                                    : null}
                            </p>
                            <p>
                                {visitData?.financialAssistance
                                    ? `Financial Assistance: ${visitData?.financialAssistance}`
                                    : null}
                            </p>
                        </>
                    ) : (
                        <p>None</p>
                    )}

                    <h2>Household items</h2>
                    <p>
                        {visitData?.household?.length === 0
                            ? 'None'
                            : visitData?.household}
                    </p>

                    <h2>Notes</h2>
                    <p>
                        {visitData?.notes?.length === 0
                            ? 'None'
                            : visitData?.notes}
                    </p>
                </>
            )}

            <h2>Options</h2>
            <div className={styles.rowContainer}>
                <Button onClick={() => setEdit(!edit)}>
                    {!edit ? 'Edit Visit' : 'Cancel Edit'}
                </Button>
                <Button onClick={removeVisit}>Delete Visit</Button>
                <Link
                    href={`/profile/${params.userId}/visit/${params.visitId}/printout`}
                >
                    <Button>Printout</Button>
                </Link>
            </div>
        </>
    );
}
