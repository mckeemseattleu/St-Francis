import ClientInfoForm from '@/components/Client/ClientInfoForm/ClientInfoForm';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

describe('Client Info Form Component', () => {
    const mockClient = {
        firstName: 'First',
        lastName: 'Last',
        firstNameLower: 'first',
        lastNameLower: 'last',
        middleInitial: 'M',
        birthday: '2003-12-13',
        gender: 'Gender',
        race: 'Race',
        postalCode: '123456',
        numKids: 0,
        notes: 'Notes',
        isCheckedIn: false,
        isBanned: false,
        unhoused: false,
    };
    it('matches snapshot without any props', async () => {
        const tree = renderer.create(<ClientInfoForm />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('renders correctly without initial data', async () => {
        await act(async () => {
            render(<ClientInfoForm />);
        });
        const title = screen.queryByRole('heading', {
            name: 'Client Form',
        });
        expect(title).toBeInTheDocument();
        expect(screen.queryByText('First name')).toBeInTheDocument();
        expect(screen.queryByText('Middle initial')).toBeInTheDocument();
        expect(screen.queryByText('Last name')).toBeInTheDocument();
        expect(screen.queryByText('Birthday')).toBeInTheDocument();
        expect(screen.queryByText('Gender')).toBeInTheDocument();
        expect(screen.queryByText('Race')).toBeInTheDocument();
        expect(screen.queryByText('Postal code')).toBeInTheDocument();
        expect(screen.queryByText('Number of Kids')).toBeInTheDocument();
        expect(screen.queryByText('Notes')).toBeInTheDocument();
        expect(screen.queryByText('Unhoused')).toBeInTheDocument();
        expect(screen.queryByText('Ban')).toBeInTheDocument();
        expect(screen.queryByText('Save and check in')).toBeInTheDocument();
        expect(screen.queryByText('Save')).toBeInTheDocument();
    });

    it('renders correctly with initial client Data', async () => {
        await act(async () => {
            render(<ClientInfoForm initialData={mockClient} />);
        });
        const fullname = screen.queryByRole('heading', {
            name: `${mockClient.firstName} ${mockClient.middleInitial} ${mockClient.lastName}`,
        });
        expect(fullname).toBeInTheDocument();

        expect(screen.getByLabelText('Postal code').value).toBe(
            mockClient.postalCode
        );
        expect(screen.getByLabelText('First name').value).toBe(
            mockClient.firstName
        );
        expect(screen.getByLabelText('Middle initial').value).toBe(
            mockClient.middleInitial
        );
        expect(screen.getByLabelText('Last name').value).toBe(
            mockClient.lastName
        );
        expect(screen.getByLabelText('Birthday').value).toBe(
            mockClient.birthday
        );
        expect(screen.getByLabelText('Gender').value).toBe(mockClient.gender);
        expect(screen.getByLabelText('Race').value).toBe(mockClient.race);
        expect(screen.getByLabelText('Postal code').value).toBe(
            mockClient.postalCode
        );
        expect(screen.getByLabelText('Number of Kids').value).toBe(
            mockClient.numKids.toString()
        );
        expect(screen.getByLabelText('Notes').value).toBe(mockClient.notes);
        expect(screen.getByLabelText('Unhoused').value).toBe(
            (mockClient.unhoused && 'on') || 'off'
        );
        expect(screen.getByLabelText('Ban').value).toBe(
            (mockClient.isBanned && 'on') || 'off'
        );
    });

    it('saves correct output with mock onSubmit callback', async () => {
        // numKids will be convert to integer by the form on submit
        const mockOnSave = jest.fn((clientData) => clientData.numKids);
        render(<ClientInfoForm initialData={mockClient} onSave={mockOnSave} />);
        const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave.mock.results[0].value).toBe(mockClient.numKids);
    });

    it('saves correct output with mock onSubmitAndCheck callback', async () => {
        const mockOnSaveAndCheck = jest.fn((clientData) => clientData.birthday);
        render(
            <ClientInfoForm
                initialData={{ ...mockClient, isCheckedIn: false }}
                onSaveAndCheck={mockOnSaveAndCheck}
            />
        );
        const saveButton = screen.getByRole('button', {
            name: 'Save and check in',
        });
        fireEvent.click(saveButton);
        expect(mockOnSaveAndCheck).toHaveBeenCalledTimes(1);
        expect(mockOnSaveAndCheck.mock.results[0].value).toBe(
            mockClient.birthday
        );
    });
});
