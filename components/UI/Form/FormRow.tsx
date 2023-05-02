import styles from './Form.module.css';

type FormRowProps = React.HTMLProps<HTMLDivElement>;

function FormRow(props: FormRowProps) {
    const { children, className, ...rest } = props;
    return (
        <div className={`${className || styles.formRow}`} {...rest}>
            {children}
        </div>
    );
}

export default FormRow;
