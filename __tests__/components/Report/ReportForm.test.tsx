import ReportForm, {
    DAY_IN_MS,
    DEFAULT_DATE_RANGE,
} from '@/components/Report/ReportForm';
import { toDateString } from '@/utils/formatDate';
import { DocFilter } from '@/utils/index';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

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
        expect(screen.queryByText('Submit')).toBeInTheDocument();
        expect(screen.queryByText('Clear')).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toHaveValue(start);
        expect(screen.getByLabelText(/end date/i)).toHaveValue(end);
    });

    it('Submit date range correctly with date start and end at midnight', async () => {
        let spyFields = {} as DocFilter;
        const mockSubmit = (fields: DocFilter) => (spyFields = fields);
        await act(async () => {
            render(<ReportForm onSubmit={mockSubmit} />);
        });
        const submitBtn = screen.queryByText('Submit') as HTMLButtonElement;
        fireEvent.change(screen.getByLabelText(/start date/i), {
            target: { value: '2021-01-01' },
        });
        fireEvent.change(screen.getByLabelText(/end date/i), {
            target: { value: '2021-02-28' },
        });
        fireEvent.click(submitBtn);
        expect(spyFields.lastVisit).toEqual([
            { opStr: '>=', value: new Date('2021/01/01 00:00:00:000') },
            { opStr: '<=', value: new Date('2021/02/28 23:59:59:999') },
        ]);
    });

    it('should reset to default date range when click clear button', async () => {
        await act(async () => {
            render(<ReportForm onSubmit={jest.fn()} />);
        });
        const clearBtn = screen.queryByText('Clear') as HTMLButtonElement;
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
