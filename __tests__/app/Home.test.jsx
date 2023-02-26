import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../app/page';
import { QueryClient, QueryClientProvider } from 'react-query';

// Fake Login component
jest.mock('../../components/Login/Login');

describe('Home', () => {
    const queryClient = new QueryClient();
    it('renders a title', () => {
        render(<QueryClientProvider client={queryClient}><Home /></QueryClientProvider>);

        const title = screen.getByRole('heading', {
            name: 'St. Francis House',
        });

        expect(title).toBeInTheDocument();
    });
});
