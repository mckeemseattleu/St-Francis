import ReportForm, {
    DAY_IN_MS,
    DEFAULT_DATE_RANGE,
} from '@/components/Report/ReportForm';
import { toDateString } from '@/utils/formatDate';
import { DocFilter } from '@/utils/index';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

jest.mock('react-query', () => ({
    useQuery: jest.fn(() => ({
        data: {
            clients: [],
        },
        isLoading: false,
        refetch: jest.fn(),
    })),

    useMutation: jest.fn(() => ({
        data: {
            clients: [],
        },
        isLoading: false,
        refetch: jest.fn(),
    })),

    useQueryClient: jest.fn().mockReturnValue({
        resetQueries: jest.fn(),
    }),
}));

describe('Client Info Form Component', () => {
    it('renders correctly with default date range data', async () => {
        await act(async () => {
            render(<ReportForm onSubmit={() => {}} />);
        });

        const start = toDateString(
            new Date(new Date().getTime() - DEFAULT_DATE_RANGE * DAY_IN_MS)
        );
        const end = toDateString(new Date());

        expect(screen.queryByText('Start Date')).toBeInTheDocument();
        expect(screen.queryByText('End Date')).toBeInTheDocument();
        expect(screen.queryByText('Set to default')).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toHaveValue(start);
        expect(screen.getByLabelText(/end date/i)).toHaveValue(end);
    });

    it('should reset to default date range when click clear button', async () => {
        await act(async () => {
            render(<ReportForm onSubmit={jest.fn()} />);
        });
        const clearBtn = screen.queryByText(
            'Set to default'
        ) as HTMLButtonElement;
        fireEvent.change(screen.getByLabelText(/start date/i), {
            target: { value: '2021-01-01' },
        });
        fireEvent.change(screen.getByLabelText(/end date/i), {
            target: { value: '2021-02-28' },
        });
        fireEvent.click(clearBtn);

        const start = toDateString(
            new Date(new Date().getTime() - DEFAULT_DATE_RANGE * DAY_IN_MS)
        );
        const end = toDateString(new Date());

        expect(screen.getByLabelText(/start date/i)).toHaveValue(start);
        expect(screen.getByLabelText(/end date/i)).toHaveValue(end);
    });
});
