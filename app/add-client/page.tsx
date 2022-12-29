'use client';

import ClientInfoForm from '../../components/ClientInfoForm/ClientInfoForm';

export default function AddClient() {
    return (
        <>
            <h1>New client</h1>

            <ClientInfoForm showBackButton={false} />
        </>
    );
}
