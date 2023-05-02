import styles from './ClientStatus.module.css';

type ClientStatusProps = {
    isCheckedIn?: boolean;
    unhoused?: boolean;
    isBanned?: boolean;
};

function ClientStatus(props: ClientStatusProps) {
    const { isCheckedIn, unhoused, isBanned } = props;
    return (
        <>
            <span className={isCheckedIn ? styles.success : styles.error}>
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
            </span>
            {unhoused && <span className={styles.warning}>Unhoused</span>}
            {isBanned && <span className={styles.error}>Banned</span>}
        </>
    );
}

export default ClientStatus;
