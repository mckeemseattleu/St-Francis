import { fireEvent, render, screen } from '@testing-library/react';
import { ClientSearch } from '@/components/Client/index';
import '@testing-library/jest-dom';

describe('ClientSearch', () => {
    it('renders a title', () => {
        render(<ClientSearch />);

        const heading = screen.getByRole('heading', {
            name: 'Lookup Client',
        });

        expect(heading).toBeInTheDocument();
    });

    it('sets first name filter correctly', () => {
        render(<ClientSearch />);

        const firstNameFilterInput = screen.getByLabelText('First name');

        fireEvent.change(firstNameFilterInput, {
            target: { value: 'TestName' },
        });

        expect(screen.getByLabelText('First name')).toHaveValue('TestName');
    });

    it('sets last name filter correctly', () => {
        render(<ClientSearch />);

        const firstNameFilterInput = screen.getByLabelText('Last name');

        fireEvent.change(firstNameFilterInput, {
            target: { value: 'TestName' },
        });

        expect(screen.getByLabelText('Last name')).toHaveValue('TestName');
    });
});
