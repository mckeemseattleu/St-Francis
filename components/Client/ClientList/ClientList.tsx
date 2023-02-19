import { ClientCard } from '@/components/Client/index';
import type { Client } from 'models';
import styles from './ClientList.module.css';

type ClientListProps = {
    clients: Array<Client>;
    noDataMessage?: string;
};

export default function ClientList(props: ClientListProps) {
    const { clients, noDataMessage = 'No Clients' } = props;
    const noClients = <h1>{noDataMessage}</h1>;
    const clientsCards = clients.map((client: any) => (
        <ClientCard client={client} key={client.id} />
    ));
    const clientsList = clients.length ? clientsCards : noClients;
    return <div className={styles.clientListContainer}>{clientsList}</div>;
}
