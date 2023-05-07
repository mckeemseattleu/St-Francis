import styles from './Form.module.css';

type FormItemProps = React.HTMLProps<HTMLInputElement> &
    React.HTMLProps<HTMLTextAreaElement>;

function FormItem(props: FormItemProps) {
    const { id, label, className, type = 'text' } = props;
    const updatedProps = { ...props };
    if (type === 'number') updatedProps.min = 0;
    return (
        <div className={`${className || styles.formItem}`}>
            <label htmlFor={id}>{label}</label>

            {type === 'textarea' ? (
                <textarea {...updatedProps} />
            ) : (
                <input {...updatedProps} />
            )}
        </div>
    );
}

export default FormItem;
