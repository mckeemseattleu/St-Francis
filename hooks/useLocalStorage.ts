import { useState, useEffect } from 'react';

const getSavedValue = <T>(key: string, initialValue: T) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue) return JSON.parse(savedValue);
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
};

const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>();

    // SSR: localStorage initialized after components mounted
    useEffect(() => {
        const savedValue = getSavedValue(key, initialValue);
        setValue(savedValue);
    }, []);

    useEffect(() => {
        if (!value) return;
        const savedValue = JSON.stringify(value);
        localStorage.setItem(key, savedValue);
    }, [value]);

    return [value, setValue] as const;
};

export default useLocalStorage;
