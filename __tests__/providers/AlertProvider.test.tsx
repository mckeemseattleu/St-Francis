import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertProvider from '@/providers/AlertProvider';
import useAlert from '@/hooks/useAlert';

const TestComponent = () => {
    const [, setAlert] = useAlert();
    return (
        <div
            onClick={() => setAlert({ type: 'error', message: 'mockMessage' })}
        >
            Set Alert
        </div>
    );
};

describe('AlertProvider', () => {
    it('renders children properly', () => {
        render(<AlertProvider>mock children</AlertProvider>);
        expect(screen.getByText('mock children')).toBeInTheDocument();
    });

    it('provides proper alert functionalities', () => {
        render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        );
        const alertBtn = screen.getByText('Set Alert');
        fireEvent.click(alertBtn);
        const alert = screen.getByText(/mockmessage/i);
        expect(alert).toBeInTheDocument();
        fireEvent.click(alert);
        expect(alert).not.toBeInTheDocument();
    });
});
