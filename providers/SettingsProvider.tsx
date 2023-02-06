import { createContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

export interface Settings {
    daysEarlyThreshold: number;
    backpackThreshold: number;
    sleepingBagThreshold: number;
    earlyOverride: boolean;
}

export interface SettingsContext {
    settings: Settings;
    setSettings: Function;
}

export const SettingsContext = createContext({
    settings: {
        daysEarlyThreshold: 0,
        backpackThreshold: 0,
        sleepingBagThreshold: 0,
        earlyOverride: false,
    },
} as SettingsContext);

interface SettingsProviderProps {
    children: React.ReactNode;
}

export default function SettingsProvider(props: SettingsProviderProps) {
    const { children } = props;

    const [settings, setSettings] = useState<Settings>({
        daysEarlyThreshold: 0,
        backpackThreshold: 0,
        sleepingBagThreshold: 0,
        earlyOverride: false,
    });

    const getSettingsDoc = async () => {
        const settingsDoc = await getDoc(doc(firestore, 'settings', 'default'));

        if (settingsDoc.exists()) {
            setSettings(settingsDoc.data() as Settings);
        }
    };

    useEffect(() => {
        getSettingsDoc();
    }, []);

    const values = {
        settings: settings,
        setSettings: setSettings,
    };

    return (
        <SettingsContext.Provider value={values}>
            {children}
        </SettingsContext.Provider>
    );
}
