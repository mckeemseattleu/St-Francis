import { useState, useEffect } from 'react';

export const MOBILE_WIDTH = 768;

export type UseWindowSize = {
    isMobile: boolean;
    width: number;
    height: number;
};
/**
 *  Hook to get the window size width and height and if it is mobile
 */
export function useWindowSize(): UseWindowSize {
    const [size, setSize] = useState({ width: MOBILE_WIDTH, height: 0 });
    useEffect(() => {
        const resize = () =>
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return { ...size, isMobile: size.width < MOBILE_WIDTH };
}
