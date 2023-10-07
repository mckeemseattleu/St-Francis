'use client';
import styles from '../Report.module.css';

export default function ReportDataBlock(props: {
    title: string;
    data: number | string;
}) {
    const { title, data, ...rest } = props;
    return (
        <div className={styles.dataBlockContainer}>
            <h2>{title}</h2>
            <p {...rest}>{data}</p>
        </div>
    );
}
