import { Client } from '@/models/index';
import styles from './ClientStatus.module.css';

type ClientStatusProps = {
    client: Client;
};

function ClientStatus(props: ClientStatusProps) {
    const { isCheckedIn, unhoused, isBanned, sheltered, BPCResident } =
        props.client || {};
    return (
        <>
            <span className={isCheckedIn ? styles.success : styles.error}>
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </span>
            {BPCResident && (
                <span className={styles.success}>BPC Resident</span>
            )}
            {sheltered && <span className={styles.success}>Sheltered</span>}
            {unhoused && <span className={styles.warning}>Unhoused</span>}
            {isBanned && <span className={styles.error}>Banned</span>}
        </>
    );
}

export default ClientStatus;
