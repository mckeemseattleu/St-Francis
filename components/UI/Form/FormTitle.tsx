import styles from './Form.module.css';

function FormTitle(props: { children: React.ReactNode }) {
    const { children } = props;
    return <h1 className={styles.formTitle}>{children}</h1>;
}

export default FormTitle;
