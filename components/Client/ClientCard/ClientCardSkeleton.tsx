import styles from './ClientCard.module.css';

export default function ClientCardSkeleton(
    props: React.HTMLAttributes<HTMLDivElement>
) {
    const nameStyle = `${styles.skeleton} ${styles.skeletonName}`;
    const headerStyle = `${styles.skeleton} ${styles.skeletonHeader}`;
    const textStyle = `${styles.skeleton} ${styles.skeletonText}`;
    const buttonStyle = `${styles.skeleton} ${styles.skeletonButton}`;
    return (
        <div className={styles.card} {...props}>
            <h1 className={nameStyle}></h1>
            <div className={headerStyle}></div>
            <div className={textStyle}></div>
            <div className={headerStyle}></div>
            <div className={textStyle}></div>
            <div className={textStyle}></div>
            <div className={textStyle}></div>

            <div className={styles.buttonContainer}>
                <div className={buttonStyle}></div>
                <div className={buttonStyle}></div>
                <div className={buttonStyle}></div>
                <div className={buttonStyle}></div>
            </div>
        </div>
    );
}
