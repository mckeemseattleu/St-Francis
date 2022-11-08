import { render, screen } from '@testing-library/react';
import ClientList from '../../components/ClientList';
import '@testing-library/jest-dom';

describe('Home', () => {
    it('renders a title', () => {
        render(<ClientList />);

        const heading = screen.getByRole('heading', {
            name: 'Clients',
        });

        expect(heading).toBeInTheDocument();
    });
});
