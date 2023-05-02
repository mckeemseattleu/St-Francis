import styles from './Button.module.css';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <button className={styles.defaultButton} {...props}>
            {children}
        </button>
    );
}
