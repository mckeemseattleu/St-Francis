import {
    fireEvent,
    getByLabelText,
    render,
    screen,
} from '@testing-library/react';
import ClientList from '../../components/ClientList/ClientList';
import '@testing-library/jest-dom';

describe('Home', () => {
    it('renders a title', () => {
        render(<ClientList />);

        const heading = screen.getByRole('heading', {
            name: 'Clients',
        });

        expect(heading).toBeInTheDocument();
    });

    it('sets first name filter correctly', () => {
        render(<ClientList />);

        const firstNameFilterInput = screen.getByLabelText('First name');

        fireEvent.change(firstNameFilterInput, {
            target: { value: 'TestName' },
        });

        expect(screen.getByLabelText('First name')).toHaveValue('TestName');
    });

    it('sets last name filter correctly', () => {
        render(<ClientList />);

        const firstNameFilterInput = screen.getByLabelText('Last name');

        fireEvent.change(firstNameFilterInput, {
            target: { value: 'TestName' },
        });

        expect(screen.getByLabelText('Last name')).toHaveValue('TestName');
    });
});
