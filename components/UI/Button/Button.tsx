import styles from './Button.module.css';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button className={`${className} ${styles.defaultButton}`} {...props}>
            {children}
        </button>
    );
}
