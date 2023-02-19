import { SettingsContext } from '@/providers/SettingsProvider';
import { useContext } from 'react';

export function useSettings() {
    return useContext(SettingsContext);
}
