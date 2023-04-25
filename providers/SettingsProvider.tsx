import { createContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
export interface Settings {
    daysEarlyThreshold: number;
    backpackThreshold: number;
    sleepingBagThreshold: number;
    earlyOverride: boolean;
}

export interface SettingsContext {
    settings: Settings;
    updateSettings: Function;
}

export const SettingsContext = createContext({} as SettingsContext);

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

    const getSettings = async () => {
        const settingsDoc = await getDoc(doc(firestore, 'settings', 'default'));

        if (settingsDoc.exists()) {
            setSettings(settingsDoc.data() as Settings);
        }
    };

    const updateSettings = async (settingsData: Settings) => {
        await setDoc(doc(firestore, 'settings', 'default'), {
            ...settings,
            ...settingsData,
        });
        await getSettings();
    };

    useEffect(() => {
        getSettings();
    }, []);

    const values = {
        settings: settings,
        updateSettings: updateSettings,
    };

    return (
        <SettingsContext.Provider value={values}>
            {children}
        </SettingsContext.Provider>
    );
}
