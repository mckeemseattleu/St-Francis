import SettingsForm from '@/components/Settings/SettingsForm';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('SettingsForm', () => {
    it('should match snapshot', () => {
        const tree = renderer.create(<SettingsForm />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should render with default form when initialSettings is not ready', () => {
        render(<SettingsForm />);
        expect(
            screen.getByRole('spinbutton', {
                name: /days early threshold/i,
            })
        ).toHaveValue(0);
        expect(
            screen.getByRole('spinbutton', {
                name: /backpack threshold/i,
            })
        ).toHaveValue(0);
        expect(
            screen.getByRole('spinbutton', {
                name: /sleeping bag threshold/i,
            })
        ).toHaveValue(0);
        expect(
            screen.getByRole('checkbox', {
                name: /early check in override/i,
            })
        ).not.toBeChecked();
    });

    it('should save Settings with button Click', () => {
        const mockOnSubmit = jest.fn();
        mockOnSubmit.mockImplementation((settings) => settings.id);
        render(
            <SettingsForm
                initialSettings={{
                    id: 'default',
                    daysEarlyThreshold: 3,
                    backpackThreshold: 4,
                    sleepingBagThreshold: 5,
                    earlyOverride: true,
                }}
                onSubmit={mockOnSubmit}
            />
        );

        const saveBtn = screen.getByRole('button', {
            name: /save as default/i,
        });

        fireEvent.click(saveBtn);
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toReturnWith('default');
    });

    it('shoudld save form with modified input value', () => {
        const mockOnSubmit = jest.fn();
        const newValue = 10;
        mockOnSubmit.mockImplementation(
            (settings) => settings.daysEarlyThreshold
        );
        render(
            <SettingsForm
                initialSettings={{
                    id: 'default',
                    daysEarlyThreshold: 3,
                }}
                onSubmit={mockOnSubmit}
            />
        );
        const daysEarly = screen.getByRole('spinbutton', {
            name: /days early threshold/i,
        });
        const saveBtn = screen.getByRole('button', {
            name: /save as default/i,
        });

        fireEvent.change(daysEarly, {
            target: {
                value: newValue.toString(),
            },
        });
        fireEvent.click(saveBtn);

        expect(mockOnSubmit).toReturnWith(newValue);
    });
});
