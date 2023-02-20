import styles from './Footer.module.css';

export default function Footer({ enabled = false }) {
    if (!enabled) return null;
    return (
        <footer className={styles.footer}>
            <p className={styles.footerHeading}>ST. FRANCIS HOUSE</p>
            <a
                className={styles.footerLink}
                href="https://goo.gl/maps/ifn9pJEydgeCJwGbA"
            >
                P.O. Box 22444 Seattle, WA 98122
            </a>
            <a
                className={styles.footerLink}
                href="mailto:info@stfrancishouseseattle.org"
            >
                206-268-0784 | info@stfrancishouseseattle.org
            </a>
        </footer>
    );
}
