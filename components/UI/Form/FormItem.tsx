import styles from './Form.module.css';

type FormItemProps = React.HTMLProps<HTMLInputElement> &
    React.HTMLProps<HTMLTextAreaElement> & {
    error?: string;
};

function FormItem(props: FormItemProps) {
    const { id, label, className, type = 'text', error, ...restProps } = props;
    const updatedProps = { ...restProps };
    if (type === 'number') updatedProps.min = 0;

    return (
        <div className={`${className || styles.formItem}`}>
            {type === 'checkbox' ? (
                <>
                    <input id={id} type="checkbox" {...updatedProps} />
                    <label htmlFor={id}>{label}</label>
                </>
            ) : (
                <>
                    <label htmlFor={id}>{label}</label>
                    {type === 'textarea' ? (
                        <textarea id={id} {...updatedProps} />
                    ) : (
                        <input id={id} type={type} {...updatedProps} />
                    )}
                </>
            )}
            <div className={styles.errorMessage}>
                {error && <span>{error}</span>}
            </div>
        </div>
    );
}

export default FormItem;