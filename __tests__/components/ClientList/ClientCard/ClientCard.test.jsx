import {
    fireEvent,
    getByLabelText,
    render,
    screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientCard from '../../../../components/ClientList/ClientCard/ClientCard';

describe('ClientCard', () => {
    it('renders all info correctly', () => {
        render(
            <ClientCard
                id={'testId'}
                firstName={'TestFirstName'}
                lastName={'TestLastName'}
                notes={'Some test notes.'}
            />
        );

        const name = screen.getByRole('heading', {
            name: 'TestFirstName TestLastName',
        });
        const notes = screen.getByText('Some test notes.');

        expect(name).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    });
});
