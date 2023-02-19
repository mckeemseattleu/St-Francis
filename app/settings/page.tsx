'use client';

import { useSettings } from '@/hooks/useSettings';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';

export interface SettingsDoc {
    daysEarlyThreshold: number;
    backpackThreshold: number;
    sleepingBagThreshold: number;
    earlyOverride: boolean;
}

export default function Settings() {
    // Local settings
    const { settings, setSettings } = useSettings();
    // "Saved" status message
    const [justUpdated, setJustUpdated] = useState<boolean>(false);

    const updateSettingsDoc = async () => {
        await setDoc(doc(firestore, 'settings', 'default'), settings);

        setJustUpdated(true);
    };

    return (
        <div className="container">
            <h1>Settings</h1>

            {/* If Context is ready show the form, otherwise show nothing;
            prevents calling of functions or data before it's ready */}
            {setSettings ? (
                <form
                    onSubmit={(e) => {
                        // Prevent redirect
                        e.preventDefault();

                        updateSettingsDoc();
                    }}
                >
                    <h2>Days Early Threshold</h2>
                    <input
                        type="number"
                        name="daysEarlyThreshold"
                        id="daysEarlyThreshold"
                        value={settings.daysEarlyThreshold}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                daysEarlyThreshold: parseInt(e.target.value),
                            }));
                        }}
                    />
                    <br />

                    <h2>Backpack Threshold</h2>
                    <input
                        type="number"
                        name="backpackThreshold"
                        id="backpackThreshold"
                        value={settings.backpackThreshold}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                backpackThreshold: parseInt(e.target.value),
                            }));
                        }}
                    />
                    <br />

                    <h2>Sleeping Bag Threshold</h2>
                    <input
                        type="number"
                        name="sleepingBagThreshold"
                        id="sleepingBagThreshold"
                        value={settings.sleepingBagThreshold}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                sleepingBagThreshold: parseInt(e.target.value),
                            }));
                        }}
                    />
                    <br />

                    <h2>Early Check In Override</h2>
                    <input
                        type="checkbox"
                        name="earlyOverride"
                        id="earlyOverride"
                        value={settings.earlyOverride ? 'on' : 'off'}
                        onChange={(e) => {
                            setSettings((prev: typeof settings) => ({
                                ...prev,
                                sleepingBagThreshold: e.target.value,
                            }));
                        }}
                    />
                    <br />

                    <br />
                    <button type="submit">Save as default</button>

                    {/* TODO: Make confirmation prettier */}
                    {justUpdated ? <p>Saved</p> : null}
                </form>
            ) : null}
        </div>
    );
}
