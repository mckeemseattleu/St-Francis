import { fireEvent, render, screen } from '@testing-library/react';
import { ClientSearch } from '@/components/Client/index';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';

describe('ClientSearch', () => {
    const queryClient = new QueryClient();
    const ClientSearchTest = () => {
        return (
            <QueryClientProvider client={queryClient}>
                <ClientSearch />
            </QueryClientProvider>
        );
    }

    it('renders a title', () => {
        render(<ClientSearchTest />);

        const heading = screen.getByRole('heading', {
            name: 'Lookup Client',
        });

        expect(heading).toBeInTheDocument();
    });

    it('sets first name filter correctly', () => {
        render(<ClientSearchTest />);

        const firstNameFilterInput = screen.getByLabelText('First name');

        fireEvent.change(firstNameFilterInput, {
            target: { value: 'TestName' },
        });

        expect(screen.getByLabelText('First name')).toHaveValue('TestName');
    });

    it('sets last name filter correctly', () => {
        render(<ClientSearchTest />);

        const firstNameFilterInput = screen.getByLabelText('Last name');

        fireEvent.change(firstNameFilterInput, {
            target: { value: 'TestName' },
        });

        expect(screen.getByLabelText('Last name')).toHaveValue('TestName');
    });
});
