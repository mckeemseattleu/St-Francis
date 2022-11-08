interface ClientCardProps {
    firstName: string;
    lastName: string;
}

export default function ClientCard({ firstName, lastName }: ClientCardProps) {
    return (
        <div>
            <h1>{`${firstName} ${lastName}`}</h1>
        </div>
    );
}
