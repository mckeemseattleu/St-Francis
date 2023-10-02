import { Settings } from '@/models/index';
import { useState } from 'react';
import { Button } from '@/components/UI';

type SettingsFormProps = {
    initialSettings?: Settings;
    onSubmit?: (settings: Settings) => void;
};

type SettingsForm = {
    id: string;
    daysEarlyThreshold: string;
    backpackThreshold: string;
    sleepingBagThreshold: string;
    earlyOverride: boolean;
};

function SettingsForm(props: SettingsFormProps) {
    const { initialSettings, onSubmit } = props;

    const defaultSettings = {
        id: initialSettings?.id || 'default',
        daysEarlyThreshold:
            initialSettings?.daysEarlyThreshold?.toString() || '0',
        backpackThreshold:
            initialSettings?.backpackThreshold?.toString() || '0',
        sleepingBagThreshold:
            initialSettings?.sleepingBagThreshold?.toString() || '0',
        earlyOverride: !!initialSettings?.earlyOverride,
    } as SettingsForm;
    const [settings, setSettings] = useState(defaultSettings);

    // Update form settings state on change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string | boolean = e.target.value;
        if (e.target.type === 'checkbox') value = e.target.checked;
        setSettings({ ...settings, [e.target.name]: value });
    };

    // Transform to correct data types before execute injected submitting action
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const settingsData: Settings = {
            ...settings,
            daysEarlyThreshold: parseInt(settings.daysEarlyThreshold),
            backpackThreshold: parseInt(settings.backpackThreshold),
            sleepingBagThreshold: parseInt(settings.sleepingBagThreshold),
        };
        onSubmit && onSubmit(settingsData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="daysEarlyThreshold">
                <h2>Days Early Threshold</h2>
            </label>
            <input
                type="number"
                name="daysEarlyThreshold"
                id="daysEarlyThreshold"
                value={settings.daysEarlyThreshold}
                onChange={handleChange}
                required
                min="0"
            />
            <br />

            <label htmlFor="backpackThreshold">
                <h2>Backpack Threshold</h2>
            </label>
            <input
                type="number"
                name="backpackThreshold"
                id="backpackThreshold"
                value={settings.backpackThreshold}
                onChange={handleChange}
                required
                min="0"
            />
            <br />

            <label htmlFor="sleepingBagThreshold">
                <h2>Sleeping Bag Threshold</h2>
            </label>
            <input
                type="number"
                name="sleepingBagThreshold"
                id="sleepingBagThreshold"
                value={settings.sleepingBagThreshold}
                onChange={handleChange}
                required
                min="0"
            />
            <br />

            <label htmlFor="earlyOverride">
                <h2>Early Check In Override</h2>
            </label>
            <input
                type="checkbox"
                name="earlyOverride"
                id="earlyOverride"
                title="enable to bypass early check in"
                checked={settings.earlyOverride}
                onChange={handleChange}
            />
            <br />

            <br />
            <Button type="submit">Save as default</Button>
        </form>
    );
}

export default SettingsForm;
