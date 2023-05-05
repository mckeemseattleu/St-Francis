import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckedIn from '../../../app/checkedin/page';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('CheckedIn', () => {
    const queryClient = new QueryClient();
    it('renders a title', () => {
        render(<QueryClientProvider client={queryClient}><CheckedIn /></QueryClientProvider>);

        const title = screen.getByRole('heading', {
            name: 'Checked in clients',
        });

        expect(title).toBeInTheDocument();
    });
});
