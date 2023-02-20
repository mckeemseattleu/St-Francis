import styles from '../styles/Home.module.css';
import ClientLookup from '@/components/Client/index';

export default function Home() {
    return (
        <>
            <h1 className={styles.title}>St. Francis House</h1>

            <ClientLookup />
        </>
    );
}
