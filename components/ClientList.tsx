export interface Client {
    id: string;
    firstName: string;
    lastName: string;
}

export interface ClientListProps {
    clients: Array<Client>;
}

export default function ClientList({ clients }: ClientListProps) {
    const clientsList = clients?.map((client: Client) => {
        return (
            <p key={client.id}>
                {client.firstName} {client.lastName}
            </p>
        );
    });

    return (
        <div>
            <h1>Clients</h1>
            {clientsList}
        </div>
    );
}
