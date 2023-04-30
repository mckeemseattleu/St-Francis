import { useSettings } from '@/hooks/useSettings';
import SettingsProvider from '@/providers/SettingsProvider';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/utils/index', () => ({
    getSettings: jest.fn(() => {}),
    updateSettings: jest.fn(() => {}),
}));

const TestComponent = () => {
    const { saveSettings } = useSettings();
    return <button onClick={() => saveSettings()}>Save Settings</button>;
};

describe('SettingsProvider', () => {
    it('provides proper signin signout functionalities', () => {
        render(
            <SettingsProvider>
                <TestComponent />
            </SettingsProvider>
        );
        const saveBtn = screen.getByText('Save Settings');
        fireEvent.click(saveBtn);
    });
});
