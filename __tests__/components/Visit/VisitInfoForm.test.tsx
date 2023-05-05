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
    const getInputField = (label: string) => {
        const input = screen.getByLabelText(label) as HTMLInputElement;
        if (input.type === 'checkbox') return input.checked;
        return input.value;
    };
    const mockVisitData = {
        id: 'mockVisitId',
        clothingMen: true,
        clothingWomen: true,
        clothingBoy: true,
        clothingGirl: true,
        backpack: true,
        sleepingBag: true,
        busTicket: 1,
        giftCard: 2,
        diaper: 3,
        financialAssistance: 4,
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
        render(<VisitInfoForm initialVisitData={mockVisitData} />);
        expect(getInputField('Men')).toBe(true);
        expect(getInputField('Women')).toBe(true);
        expect(getInputField('Kids (Boy)')).toBe(true);
        expect(getInputField('Kids (Girl)')).toBe(true);
        expect(getInputField('Backpack')).toBe(true);
        expect(getInputField('Sleeping Bag')).toBe(true);
        expect(getInputField('Bus Ticket')).toBe('1');
        expect(getInputField('Gift Card')).toBe('2');
        expect(getInputField('Diaper')).toBe('3');
        expect(getInputField('Financial Assistance')).toBe('4');
    });

    it('saves correct output with mock onSubmit callback', async () => {
        const mockOnSave = jest.fn((VisitData) => VisitData);
        render(<VisitInfoForm onSubmit={mockOnSave} />);
        const saveButton = screen.getByRole('button', {
            name: 'New Visit / Check-in',
        });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('changes input value correctly', async () => {
        render(<VisitInfoForm />);
        const textboxes = screen.getAllByRole('textbox');
        const input = textboxes[0] as HTMLInputElement;
        await userEvent.type(input, '123');
        expect(input.value).toBe('123');
    });

    it('changes input value correctly', async () => {
        render(<VisitInfoForm />);
        const input = screen.getByRole('spinbutton', {
            name: /bus ticket/i,
        }) as HTMLInputElement;
        await userEvent.clear(input);
        const saveButton = screen.getByRole('button', {
            name: 'New Visit / Check-in',
        });
        fireEvent.click(saveButton);
    });

    it('allows early override to checkin', async () => {
        (useSettings as jest.Mock).mockReturnValue({
            settings: { earlyOverride: true },
        });
        const mockOnSave = jest.fn((VisitData) => VisitData);
        render(<VisitInfoForm onSubmit={mockOnSave} />);
        const saveButton = screen.getByRole('button', {
            name: 'New Visit / Check-in',
        });
        fireEvent.click(saveButton);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
});
