import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Settings from '../../../app/settings/page';

describe('Settings page', () => {
    it('renders no options when context is not ready', async () => {
        render(<Settings />);

        screen.getByRole('heading', { name: 'Settings' });
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

        expect(daysEarly).not.toBeInTheDocument();
        expect(backpack).not.toBeInTheDocument();
        expect(sleepingBag).not.toBeInTheDocument();
        expect(override).not.toBeInTheDocument();
    });
});
