import styles from './Form.module.css';

type FormItemProps = React.HTMLProps<HTMLInputElement> &
    React.HTMLProps<HTMLTextAreaElement>;

function FormItem(props: FormItemProps) {
    const { id, label, className, type = 'text' } = props;
    return (
        <div className={`${className || styles.formItem}`}>
            <label htmlFor={id}>{label}</label>

            {type === 'textarea' ? (
                <textarea {...props} />
            ) : (
                <input {...props} />
            )}
        </div>
    );
}

export default FormItem;
