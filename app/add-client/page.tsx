import { ClientInfoForm } from '@/components/Client/index';

export default function AddClient() {
    return (
        <div className="container">
            <ClientInfoForm title="New Client" showBackButton={false} />
        </div>
    );
}
