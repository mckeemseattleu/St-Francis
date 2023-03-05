import Footer from './Footer/Footer';
import styles from './Layout.module.css';
import Main from './Main/Main';
import NavBar from './NavBar/NavBar';

export type LayoutProps = React.HTMLAttributes<HTMLDivElement>;
export default function Layout(props: LayoutProps) {
    const { children, ...rest } = props;
    return (
        <div className={styles.layout} {...rest}>
            <NavBar className={styles.nav} />
            <Main className={styles.main}>{children}</Main>
            <Footer className={styles.footer} enabled />
        </div>
    );
}
