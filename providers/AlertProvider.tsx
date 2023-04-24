import Alert from '@/components/Alert/Alert';
import usePrevious from '@/hooks/usePrevious';
import { createContext, Dispatch, useEffect, useState } from 'react';

type AlertType = {
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
};

interface AlertContext {
    alert: AlertType | undefined;
    setAlert: Dispatch<AlertType | undefined>;
}

type AlertProviderProps = {
    children: React.ReactNode;
};

const initialValues = {} as AlertContext;

export const AlertContext = createContext<AlertContext>(initialValues);

export const AlertProvider = (props: AlertProviderProps) => {
    const { children } = props;

    const [alert, setAlert] = useState<AlertType | undefined>();
    const [open, setOpen] = useState(false);
    const prevAlert = usePrevious(alert);

    // TODO: Log errors to server implementation
    const reportError = async (err: string, active: boolean) => {
        // if (active) console.log('GLOBAL ERROR', err);
    };

    useEffect(() => {
        let active = true;
        if (alert && alert.type === 'error') {
            const preparedAlert = JSON.stringify(alert);
            reportError(preparedAlert, active);
        }
        if (alert) {
            setOpen(true);
        }
        return () => {
            active = false;
        };
    }, [alert]);

    useEffect(() => {
        const timer = setTimeout(() => setOpen(false), 10000);
        return () => clearTimeout(timer);
    }, [alert]);

    const contextValue = {
        alert,
        setAlert,
    };

    return (
        <AlertContext.Provider value={contextValue}>
            {children}
            <Alert
                open={open && !!alert}
                onClose={() => setAlert(undefined)}
                type={alert?.type}
            >
                {!!alert ? alert.message : prevAlert?.message}
            </Alert>
        </AlertContext.Provider>
    );
};

export default AlertProvider;
