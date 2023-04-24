import { useEffect, useRef } from 'react';

const usePrevious = <T>(value: T) => {
    const prevRef = useRef<T>();
    useEffect(() => {
        prevRef.current = value;
    });

    return prevRef.current;
};

export default usePrevious;
