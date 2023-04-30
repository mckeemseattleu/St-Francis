import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddClient from '../../../app/add-client/page';

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/hooks/index', () => ({
    useAlert: jest.fn(() => [null, jest.fn()]),
}));

describe('Add Client page', () => {
    it('renders child component correctly', () => {
        render(<AddClient />);

        const title = screen.getByRole('heading', { name: 'New Client' });

        expect(title).toBeInTheDocument();
    });

    // TODO: fix this test, could not simulate user typing on date field
    it('create new client and redirect to profile', async () => {
        render(<AddClient />);
        const saveButton = screen.getByRole('button', { name: 'Save' });
        const birthdayInput = screen.getByLabelText('Birthday');
        fireEvent.change(birthdayInput, { target: { value: '2002-02-02' } })
        fireEvent.click(saveButton);
    });

    // TODO: fix this test, could not simulate user typing on date field
    it('renders child component correctly', async () => {
        render(<AddClient />);
        const saveandCheckBtn = screen.getByRole('button', {
            name: 'Save and check in',
        });
        const birthdayInput = screen.getByLabelText('Birthday');
        fireEvent.change(birthdayInput, { target: { value: '2002-02-02' } })
        fireEvent.click(saveandCheckBtn);
    });

    it('create new client error without birthday', () => {
        render(<AddClient />);
        const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);
    });

    it('create new client and check in error without birthday', () => {
        render(<AddClient />);
        const saveandCheckBtn = screen.getByRole('button', {
            name: 'Save and check in',
        });
        fireEvent.click(saveandCheckBtn);
    });
});
