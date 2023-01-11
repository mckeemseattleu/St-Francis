import { createContext } from 'react';

export interface Settings {
    daysEarlyThreshold: number;
    backpackThreshold: number;
    sleepingBagThreshold: number;
    earlyOverride: boolean;
}

export interface SettingsContext {
    settings: Settings;
    setSettings: Function | null;
}

// Init values immediately set in layout.tsx
export const SettingsContext = createContext<SettingsContext>({
    settings: {
        daysEarlyThreshold: 0,
        backpackThreshold: 0,
        sleepingBagThreshold: 0,
        earlyOverride: false,
    },
    setSettings: null,
});
