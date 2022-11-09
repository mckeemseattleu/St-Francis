'use client';

import { useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';

export default function Settings() {
    const { settings, setSettings } = useContext(SettingsContext);

    return (
        <>
            <h1>Settings</h1>
        </>
    );
}
