import VisitInfoForm from '@/components/Visit/VisitInfoForm';
import { Client } from '@/models/index';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import renderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import { useSettings } from '@/hooks/index';

jest.mock('@/hooks/index', () => ({
    useSettings: jest.fn(() => ({
        settings: {
            visitThreshold: 30,
            backpackThreshold: 180,
            sleepingbagThreshold: 180,
        },
    })),
}));

describe('Visit Info Form Component', () => {
    const epochTimestamp = Timestamp.fromDate(new Date(0));
    const mockClient: Client = {
        id: '47636',
        firstName: 'First',
        lastName: 'Last',
        race: 'Race',
        notes: 'Notes',
        gender: 'Gender',
        isCheckedIn: false,
        isBanned: false,
        numKids: 0,
        numInFamily: 0,
        postalCode: '0',
        lastBusTicket: epochTimestamp,
        lastSleepingbag: epochTimestamp,
        birthday: epochTimestamp,
        createdAt: epochTimestamp,
        updatedAt: epochTimestamp,
        lastBackpack: epochTimestamp,
    };
    const earlyClient = {
        ...mockClient,
        lastBusTicket: Timestamp.fromDate(new Date()),
        lastSleepingbag: Timestamp.fromDate(new Date()),
        lastBackpack: Timestamp.fromDate(new Date()),
        lastVisit: Timestamp.fromDate(new Date()),
    };

    const getInputField = (label: string) => {
        return (screen.getByLabelText(label) as HTMLInputElement).value;
    };

    it('matches snapshot without any props', async () => {
        const tree = renderer.create(<VisitInfoForm />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly without initial data', async () => {
        render(<VisitInfoForm />);
        expect(screen.queryByText('Men')).toBeInTheDocument();
        expect(screen.queryByText('Women')).toBeInTheDocument();
        expect(screen.queryByText('Kids (Boy)')).toBeInTheDocument();
        expect(screen.queryByText('Kids (Girl)')).toBeInTheDocument();
        expect(screen.queryByText('Backpack')).toBeInTheDocument();
        expect(screen.queryByText('Sleeping Bag')).toBeInTheDocument();
        expect(screen.queryByText('Bus Ticket')).toBeInTheDocument();
        expect(screen.queryByText('Gift Card')).toBeInTheDocument();
        expect(screen.queryByText('Diaper')).toBeInTheDocument();
        expect(screen.queryByText('Financial Assistance')).toBeInTheDocument();
    });

    it('renders correctly with initial Visit Data', async () => {
        render(<VisitInfoForm clientData={mockClient} />);
        expect(getInputField('Men')).toBe('off');
        expect(getInputField('Women')).toBe('off');
        expect(getInputField('Kids (Boy)')).toBe('off');
        expect(getInputField('Kids (Girl)')).toBe('off');
        expect(getInputField('Backpack')).toBe('off');
        expect(getInputField('Sleeping Bag')).toBe('off');
        expect(getInputField('Bus Ticket')).toBe('');
        expect(getInputField('Gift Card')).toBe('');
        expect(getInputField('Diaper')).toBe('');
        expect(getInputField('Financial Assistance')).toBe('');
    });

    it('saves correct output with mock onSubmit callback', async () => {
        const mockOnSave = jest.fn((VisitData) => VisitData);
        render(<VisitInfoForm clientData={mockClient} onSubmit={mockOnSave} />);
        const saveButton = screen.getByRole('button', { name: 'Check in' });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('saves forcely if validates failed with mock onSubmit callback', async () => {
        const clientData = {
            ...mockClient,
            lastBusTicket: Timestamp.fromDate(new Date()),
            lastSleepingbag: Timestamp.fromDate(new Date()),
            lastBackpack: Timestamp.fromDate(new Date()),
            lastVisit: Timestamp.fromDate(new Date()),
        };
        const mockOnSave = jest.fn((VisitData) => VisitData);
        render(<VisitInfoForm clientData={clientData} onSubmit={mockOnSave} />);
        const saveButton = screen.getByRole('button', { name: 'Check in' });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(0);
        const forceSaveButton = screen.getByRole('button', {
            name: 'Force Check-in',
        });
        fireEvent.click(forceSaveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('saves forcely if validates failed with mock onSubmit callback', async () => {
        const mockOnSave = jest.fn((VisitData) => VisitData);
        render(
            <VisitInfoForm clientData={earlyClient} onSubmit={mockOnSave} />
        );
        const saveButton = screen.getByRole('button', { name: 'Check in' });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(0);
        const forceSaveButton = screen.getByRole('button', {
            name: 'Force Check-in',
        });
        fireEvent.click(forceSaveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('changes input value correctly', async () => {
        render(<VisitInfoForm clientData={mockClient} />);
        const input = screen.getByRole('textbox', {
            name: /household items/i,
        }) as HTMLInputElement;
        await userEvent.type(input, '123');
        expect(input.value).toBe('123');
    });

    it('changes input value correctly', async () => {
        render(<VisitInfoForm clientData={mockClient} />);
        const input = screen.getByRole('spinbutton', {
            name: /bus ticket/i,
        }) as HTMLInputElement;
        await userEvent.clear(input);
        const saveButton = screen.getByRole('button', { name: 'Check in' });
        fireEvent.click(saveButton);
    });

    it('allows early override to checkin', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            settings: { earlyOverride: true },
        });
        const clientData = {
            ...mockClient,
            lastBusTicket: Timestamp.fromDate(new Date()),
            lastSleepingbag: Timestamp.fromDate(new Date()),
            lastBackpack: Timestamp.fromDate(new Date()),
            lastVisit: Timestamp.fromDate(new Date()),
        };
        const mockOnSave = jest.fn((VisitData) => VisitData);
        render(
            <VisitInfoForm clientData={earlyClient} onSubmit={mockOnSave} />
        );
        const saveButton = screen.getByRole('button', { name: 'Check in' });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
});
