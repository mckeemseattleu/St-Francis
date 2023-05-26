'use client';

import Spinner from '@/components/Spinner/Spinner';
import { Button, Modal } from '@/components/UI';
import VisitDetail from '@/components/Visit/VisitDetail';
import VisitInfoForm from '@/components/Visit/VisitInfoForm';
import { useAlert } from '@/hooks/index';
import { Visit as VisitModel } from '@/models/index';
import {
    CLIENTS_PATH,
    deleteVisit,
    getVisit,
    updateVisit,
    VISITS_PATH,
} from '@/utils/index';
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
    const [show, setShow] = useState(false);
    const [visitFormData, setVisitFormData] = useState<VisitModel>();

    const {
        isLoading,
        data: visitData,
        refetch,
    } = useQuery(
        [CLIENTS_PATH, params.userId, VISITS_PATH, params.visitId],
        () => getVisit(params.userId, params.visitId)
    );
    const [editVisit, setEditVisit] = useState(false);

    const removeVisit = async () => {
        await deleteVisit(params.visitId, params.userId);
        setAlert({ message: 'Successfully deleted visit', type: 'success' });
        // Redirect back to client profile
        router.push(`/profile/${params.userId}`);
    };
    if (isLoading) return <Spinner />;

    const handleSubmit = async (data: VisitModel) => {
        //TODO: allow update of visit date (aka createdAt)
        await updateVisit(data, params.userId);
        setAlert({ message: 'Successfully updated Visit', type: 'success' });
        refetch();
        setEditVisit(false);
    };

    const visitDate = visitData?.createdAt?.toDate()?.toLocaleString();

    const onChange = (visitData: VisitModel) => {
        setVisitFormData(visitData);
    };

    const saveVisit = () => {
        visitFormData && handleSubmit(visitFormData);
    };

    return (
        <div>
            <div>
                <h1>Visit Details</h1>
                {visitData?.createdAt && <h2>{visitDate}</h2>}
            </div>
            <hr />
            <div className={styles.rowContainer}>
                <Button
                    onClick={() => router.push(`/profile/${params.userId}`)}
                >
                    Back to Profile
                </Button>
                <Button onClick={() => setEditVisit(!editVisit)}>
                    {!editVisit ? 'Edit Visit' : 'Cancel Edit'}
                </Button>
                {editVisit && <Button onClick={saveVisit}>Save Visit</Button>}
            </div>
            {editVisit ? (
                <VisitInfoForm
                    initialVisitData={visitData}
                    onSubmit={handleSubmit}
                    onChange={onChange}
                    submitLabel="Save Visit"
                />
            ) : (
                <VisitDetail visitData={visitData as VisitModel} />
            )}
            <h2>Options</h2>
            <div className={styles.rowContainer}>
                <Button onClick={() => setEditVisit(!editVisit)}>
                    {!editVisit ? 'Edit Visit' : 'Cancel Edit'}
                </Button>
                <Button onClick={() => setShow(true)}>Delete Visit</Button>
                <Link
                    href={`/profile/${params.userId}/visit/${params.visitId}/printout`}
                >
                    <Button>Printout</Button>
                </Link>
            </div>
            <Modal show={show} setShow={setShow}>
                <h3>Are you sure you want to delete this visit?</h3>
                <hr />
                <h4>
                    Visit Date:{' '}
                    {visitData?.createdAt?.toDate()?.toLocaleString()}
                </h4>
                <div className={styles.rowContainer}>
                    <Button onClick={() => setShow(false)}>Cancel</Button>{' '}
                    <Button onClick={removeVisit}>Confirm Delete</Button>
                </div>
            </Modal>
        </div>
    );
}
