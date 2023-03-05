import styles from './profile.module.css';

export default function ProfileLayout({ children }: any) {
    return <div className={styles.container}>{children}</div>;
}
