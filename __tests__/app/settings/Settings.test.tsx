import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Settings from '../../../app/settings/page';

jest.mock('@/hooks/useAlert', () => {
    return () => [{}, jest.fn()];
})

describe('Settings page', () => {
    it('should display Settings heading', () => {
        render(<Settings />);
        const title = screen.getByRole('heading', { name: 'Settings' });
        expect(title).toBeInTheDocument();
    });

    it('renders with default form when settings context is not ready', async () => {
        render(<Settings />);

        const daysEarly = screen.queryByRole('heading', {
            name: 'Days Early Threshold',
        });
        const backpack = screen.queryByRole('heading', {
            name: 'Backpack Threshold',
        });
        const sleepingBag = screen.queryByRole('heading', {
            name: 'Sleeping Bag Threshold',
        });
        const override = screen.queryByRole('heading', {
            name: 'Early Check In Override',
        });

        expect(daysEarly).toBeInTheDocument();
        expect(backpack).toBeInTheDocument();
        expect(sleepingBag).toBeInTheDocument();
        expect(override).toBeInTheDocument();
    });

    it('renders with default form when settings context is not ready', async () => {
        render(<Settings />);

        const saveButton = screen.queryByRole('button', {
            name: 'Save as default',
        }) as HTMLButtonElement;
        fireEvent.click(saveButton);
    });
});
