import styles from './Spinner.module.css';

export default function Spinner(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <div className={styles.spinner}>
                <div></div>
            </div>
        </div>
    );
}
