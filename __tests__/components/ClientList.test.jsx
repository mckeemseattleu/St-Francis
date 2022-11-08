import { render, screen } from '@testing-library/react';
import ClientList from '../../components/ClientList';
import '@testing-library/jest-dom';

describe('Home', () => {
    it('renders a title with undefined clients data', () => {
        render(<ClientList />);

        const heading = screen.getByRole('heading', {
            name: 'Clients',
        });

        expect(heading).toBeInTheDocument();
    });

    it('renders clients with valid clients data', () => {
        const clients = [
            { id: 'abcd', firstName: 'TestFirstA', lastName: 'TestLastA' },
            { id: 'abcde', firstName: 'TestFirstB', lastName: 'TestLastB' },
        ];

        render(<ClientList clients={clients} />);

        const testClientA = screen.getByText('TestFirstA TestLastA');
        const testClientB = screen.getByText('TestFirstB TestLastB');

        expect(testClientA).toBeInTheDocument();
        expect(testClientB).toBeInTheDocument();
    });
});
