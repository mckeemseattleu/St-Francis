import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckedIn from '../../../app/checkedin/page';

describe('CheckedIn', () => {
    it('renders a title', () => {
        render(<CheckedIn />);

        const title = screen.getByRole('heading', {
            name: 'Checked in clients',
        });

        expect(title).toBeInTheDocument();
    });
});
