import NavMenuMobile from '@/components/Layout/NavBar/NavMenuMobile';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

global.scrollTo = jest.fn();

describe('NavMenuMobile', () => {
    it('matches snapshot without any props', async () => {
        const tree = renderer.create(<NavMenuMobile />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders without any props', async () => {
        const { container } = render(<NavMenuMobile />);
        expect(container).toBeInTheDocument();
    })

    it('shows menu when button is clicked', async () => {
        const { container, getByRole } = render(<NavMenuMobile />);
        const button = getByRole('button');
        fireEvent.click(button);
        expect(container).toBeInTheDocument();
    })
});
