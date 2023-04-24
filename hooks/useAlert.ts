import { AlertContext } from '@/providers/AlertProvider';
import { useContext } from 'react';

export const useAlert = () => {
    const { alert, setAlert } = useContext(AlertContext);
    return [alert, setAlert] as const;
};
export default useAlert;
