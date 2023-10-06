'use client';
import { Button } from '@/components/UI';
import type { DocFilter } from '@/utils/index';
import { useState } from 'react';
import styles from './ReportForm.module.css';

type ReportFormProps = {
    onSubmit: (fields: DocFilter) => void;
    onClear?: () => void;
};
export default function ReportForm(props: ReportFormProps) {
    const { onSubmit, onClear } = props;

    const defaultData = {
        startDate: '',
        endDate: '',
    };

    const [reportData, setReportData] = useState({
        startDate: "",
        endDate:"",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fields: DocFilter = {};
        const { startDate, endDate } = reportData;
        fields['lastVisit'] = [
            { opStr: '>=', value: new Date(startDate) }, 
            { opStr: '<=', value: new Date(endDate)}];

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

    return (
        <div className={styles.container}>
            <h1>Generate Report</h1>

            <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                 
                    <label>
                        Start Date
                        <div className={styles.birthdayControlsContainer}>
                            <input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={reportData.startDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                            />
                          
                        </div>
                    </label>

                    <label>
                        End Date
                        <div className={styles.birthdayControlsContainer}>
                            <input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={reportData.endDate}
                                onChange={handleChange}
                                min={reportData.startDate}
                                max={new Date().toISOString().split('T')[0]}
                            />
                     
                        </div>
                    </label>
                </div>

                <div className={styles.formControls}>
                    <Button type="submit">
                        Submit
                    </Button>
                    <Button type="button" onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </form>
        </div>
    );
}
