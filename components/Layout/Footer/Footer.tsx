import styles from './Footer.module.css';

export type FooterProps = {
    enabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Footer(props: FooterProps) {
    const { enabled = false, className, ...rest } = props;
    if (!enabled) return null;
    return (
        <footer {...rest} className={`${className} ${styles.footer} noprint`}>
            <h1 className={styles.footerHeading}>ST. FRANCIS HOUSE</h1>
            <a
                href="https://goo.gl/maps/ifn9pJEydgeCJwGbA"
            >
                P.O. Box 22444 Seattle, WA 98122_test
            </a>
            <a
                className={styles.footerLink}
                href="mailto:info@stfrancishouseseattle.org"
            >
                206-268-0784 | info@stfrancishouseseattle.org | Test
            </a>
        </footer>
    );
}
