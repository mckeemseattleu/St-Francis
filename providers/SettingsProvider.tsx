import { Settings } from '@/models/index';
import { getSettings, updateSettings } from '@/utils/index';
import { createContext, useEffect, useState } from 'react';

export type SettingsContext = {
    settings?: Settings;
    saveSettings: Function;
};

export const SettingsContext = createContext({} as SettingsContext);

type SettingsProviderProps = {
    children: React.ReactNode;
};

/**
 * SettingsProvider component is a provider for settings context.
 * Contains settings data and CRUD API for settings.
 */
export default function SettingsProvider(props: SettingsProviderProps) {
    const { children } = props;

    const [settings, setSettings] = useState<Settings>();

    // Fetch settings from database using helper function
    const fetchSettings = async () => {
        const settingsData = await getSettings();
        setSettings(settingsData as Settings);
    };

    // Update settings in database using helper function
    const saveSettings = async (settingsData: Settings) => {
        await updateSettings({ ...settings, ...settingsData });
        await fetchSettings();
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const values = {
        settings: settings,
        saveSettings: saveSettings,
    };

    return (
        <SettingsContext.Provider value={values}>
            {children}
        </SettingsContext.Provider>
    );
}
