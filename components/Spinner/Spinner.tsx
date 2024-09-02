import clsx from 'clsx';
import styles from './Spinner.module.css';

type SpinnerProps = {
    variant?: 'small';
};

export default function Spinner(
    props: SpinnerProps & React.HTMLAttributes<HTMLDivElement>
) {
    return (
        <div {...props}>
            <div
                className={clsx(styles.spinner, {
                    [styles.secondary]: props.variant === 'small',
                })}
            >
                <div></div>
            </div>
        </div>
    );
}
