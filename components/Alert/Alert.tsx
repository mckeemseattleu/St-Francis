import styles from './Alert.module.css';

type AlertProps = {
    children?: React.ReactNode;
    open?: boolean;
    onClose?: () => void;
    type: 'error' | 'warning' | 'info' | 'success' | undefined;
};

function Alert(props: AlertProps) {
    const { open, children, onClose, type = 'success' } = props;

    return (
        (open && (
            <div
                className={`${styles.alert} ${styles[type]} noprint`}
                onClick={onClose}
            >
                {children}
            </div>
        )) ||
        null
    );
}

export default Alert;
