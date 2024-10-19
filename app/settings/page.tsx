'use client';

import SettingsForm from '@/components/Settings/SettingsForm';
import useAlert from '@/hooks/useAlert';
import { useSettings } from '@/hooks/useSettings';
import { Settings } from '@/models/index';

export default function SettingsPage() {
    const { settings, saveSettings } = useSettings();
    const [, setAlert] = useAlert();

    const handleSubmit = async (settingsData: Settings) => {
        try {
            await saveSettings(settingsData);
            setAlert({
                type: 'success',
                message: `Settings saved at ${new Date().toLocaleTimeString()}`,
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error saving settings' });
        }
    };

    return (
        <div>
            <h1>Settings</h1>
            <SettingsForm
                onSubmit={handleSubmit}
                initialSettings={settings}
                key={settings?.backpackThreshold} // TODO: remove this when form is refactored
            />
        </div>
    );
}
