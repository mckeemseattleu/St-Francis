'use client';

import { useState } from 'react';
import { Button } from '@/components/UI';
import { toDateString } from '@/utils/formatDate';
import { DocFilter } from '@/utils/index';
import { useGenerateReport } from './hooks';
import Spinner from '../Spinner/Spinner';
import styles from './Report.module.css';

type ReportFormProps = {
    onSubmit: (fields: DocFilter) => void;
    onClear?: () => void;
};

export const DAY_IN_MS = 24 * 60 * 60 * 1000;
export const DEFAULT_DATE_RANGE = 30;

export default function ReportForm(props: ReportFormProps) {
    const { onSubmit, onClear } = props;

    const { mutateAsync: generateReport, isLoading } = useGenerateReport();

    const defaultData = {
        startDate: toDateString(
            new Date(new Date().getTime() - DEFAULT_DATE_RANGE * DAY_IN_MS)
        ),
        endDate: toDateString(new Date()),
    };

    const [reportData, setReportData] = useState(defaultData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reportData.startDate === '' || reportData.endDate === '') return;
        const fields: DocFilter = {};
        const { startDate, endDate } = reportData;
        const start = new Date(startDate.split('-').join('/'));
        const end = new Date(endDate.split('-').join('/'));
        end.setHours(23, 59, 59, 999);
        fields['lastVisit'] = [
            { opStr: '>=', value: start },
            { opStr: '<=', value: end },
        ];

        onSubmit(fields);
    };

    const handleClear = () => {
        setReportData(defaultData);
        if (onClear) onClear();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string | boolean = e.target.value;
        if (e.target.type === 'checkbox') value = e.target.checked;

        setReportData({ ...reportData, [e.target.name]: value });
    };

    const handleGenerateReport = async () => {
        if (reportData.startDate === '' || reportData.endDate === '') return;
        await generateReport(reportData);
    };

    const downloadCsvFileText = isLoading ? (
        <Spinner variant="small" />
    ) : (
        'Download CSV'
    );

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                    <label htmlFor="startDate">
                        Start Date
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={reportData.startDate}
                            onChange={handleChange}
                            max={defaultData.endDate}
                        />
                    </label>

                    <label htmlFor="endDate">
                        End Date
                        <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={reportData.endDate}
                            onChange={handleChange}
                            min={reportData.startDate}
                            max={defaultData.endDate}
                        />
                    </label>
                </div>
                <div className={styles.formControls}>
                    <Button type="button" onClick={handleClear}>
                        Set to default
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                    >
                        {downloadCsvFileText}
                    </Button>
                </div>
            </form>
        </div>
    );
}
