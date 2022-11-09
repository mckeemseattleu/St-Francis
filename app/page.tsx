import styles from '../styles/Home.module.css';
import ClientList from '../components/ClientList/ClientList';

export default function Home() {
    return (
        <>
            <h1 className={styles.title}>St. Francis House</h1>

            <ClientList />
        </>
    );
}
