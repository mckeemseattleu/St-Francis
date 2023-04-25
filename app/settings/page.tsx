'use client';

import SettingsForm from '@/components/Settings/SettingsForm';
import useAlert from '@/hooks/useAlert';
import { useSettings } from '@/hooks/useSettings';
import { Settings } from '@/providers/SettingsProvider';

export interface SettingsDoc {
    daysEarlyThreshold: number;
    backpackThreshold: number;
    sleepingBagThreshold: number;
    earlyOverride: boolean;
}

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const [, setAlert] = useAlert();

    const handleSubmit = async (settingsData: Settings) => {
        await updateSettings(settingsData);
        setAlert({ type: 'success', message: 'Settings saved' });
    };

    return (
        <div>
            <h1>Settings</h1>
            <SettingsForm onSubmit={handleSubmit} initialSettings={settings} />
        </div>
    );
}
