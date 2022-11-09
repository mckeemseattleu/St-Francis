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

export const SettingsContext = createContext<SettingsContext>({
    settings: {
        daysEarlyThreshold: 25,
        backpackThreshold: 91,
        sleepingBagThreshold: 182,
        earlyOverride: false,
    },
    setSettings: null,
});
