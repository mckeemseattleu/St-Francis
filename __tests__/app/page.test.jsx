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
});
