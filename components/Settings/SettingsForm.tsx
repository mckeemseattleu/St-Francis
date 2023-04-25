import { Settings } from '@/providers/SettingsProvider';
import { useState } from 'react';

type SettingsFormProps = {
    initialSettings?: Settings;
    onSubmit?: (settings: Settings) => void;
};

type SettingsFormState = {
    daysEarlyThreshold: string;
    backpackThreshold: string;
    sleepingBagThreshold: string;
    earlyOverride: string;
};

function SettingsForm(props: SettingsFormProps) {
    const { initialSettings, onSubmit } = props;
    const [settings, setSettings] = useState<SettingsFormState>({
        daysEarlyThreshold:
            initialSettings?.daysEarlyThreshold?.toString() || '0',
        backpackThreshold:
            initialSettings?.backpackThreshold?.toString() || '0',
        sleepingBagThreshold:
            initialSettings?.sleepingBagThreshold?.toString() || '0',
        earlyOverride: !!initialSettings?.earlyOverride ? 'on' : 'off',
    });
    console.log({settings, initialSettings})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings((prev: SettingsFormState) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const settingsData: Settings = {
            daysEarlyThreshold: parseInt(settings.daysEarlyThreshold),
            backpackThreshold: parseInt(settings.backpackThreshold),
            sleepingBagThreshold: parseInt(settings.sleepingBagThreshold),
            earlyOverride: settings.earlyOverride === 'on',
        };
        onSubmit && onSubmit(settingsData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Days Early Threshold</h2>
            <input
                type="number"
                name="daysEarlyThreshold"
                id="daysEarlyThreshold"
                value={settings.daysEarlyThreshold}
                onChange={handleChange}
            />
            <br />

            <h2>Backpack Threshold</h2>
            <input
                type="number"
                name="backpackThreshold"
                id="backpackThreshold"
                value={settings.backpackThreshold}
                onChange={handleChange}
            />
            <br />

            <h2>Sleeping Bag Threshold</h2>
            <input
                type="number"
                name="sleepingBagThreshold"
                id="sleepingBagThreshold"
                value={settings.sleepingBagThreshold}
                onChange={handleChange}
            />
            <br />

            <h2>Early Check In Override</h2>
            <input
                type="checkbox"
                name="earlyOverride"
                id="earlyOverride"
                value={settings.earlyOverride ? 'on' : 'off'}
                onChange={handleChange}
            />
            <br />

            <br />
            <button type="submit">Save as default</button>
        </form>
    );
}

export default SettingsForm;
