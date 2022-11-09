'use client';

import { useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';

export default function Settings() {
    const { settings, setSettings } = useContext(SettingsContext);

    return (
        <>
            <h1>Settings</h1>

            {setSettings ? (
                <>
                    <h2>Days early threshold</h2>
                    <input
                        type="number"
                        name="daysEarlyThreshold"
                        id="daysEarlyThreshold"
                        value={settings.daysEarlyThreshold}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                daysEarlyThreshold: e.target.value,
                            }));
                        }}
                    />
                    <br />

                    <h2>Backpack threshold</h2>
                    <input
                        type="number"
                        name="backpackThreshold"
                        id="backpackThreshold"
                        value={settings.backpackThreshold}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                backpackThreshold: e.target.value,
                            }));
                        }}
                    />
                    <br />

                    <h2>Sleeping bag threshold</h2>
                    <input
                        type="number"
                        name="sleepingBagThreshold"
                        id="sleepingBagThreshold"
                        value={settings.sleepingBagThreshold}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                sleepingBagThreshold: e.target.value,
                            }));
                        }}
                    />
                    <br />
                </>
            ) : null}
        </>
    );
}
