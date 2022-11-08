import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../app/page';

// Fake Login component
jest.mock('../../components/Login/Login');

describe('Home', () => {
    it('renders a title', () => {
        render(<Home />);

        const title = screen.getByRole('heading', {
            name: 'St. Francis House',
        });

        expect(title).toBeInTheDocument();
    });

    it('does not render a client list when not signed in', () => {
        render(<Home />);

        const clientListHeading = screen.queryByRole('heading', {
            name: 'Clients',
        });

        expect(clientListHeading).not.toBeInTheDocument();
    });
});
