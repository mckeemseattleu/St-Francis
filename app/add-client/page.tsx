'use client';

import ClientInfoForm from '../../components/ClientInfoForm/ClientInfoForm';

export default function AddClient() {
    return (
        <div className="container">
            <ClientInfoForm title="New Client" showBackButton={false} />
        </div>
    );
}
