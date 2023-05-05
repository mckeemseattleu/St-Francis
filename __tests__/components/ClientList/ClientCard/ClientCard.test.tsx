import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClientCard } from '@/components/Client/index';

describe('ClientCard', () => {
    it('renders all info correctly', () => {
        const client = {
            id: 'testId',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            notes: 'Some test notes.',
        };
        render(
            <ClientCard
                client={client}
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
