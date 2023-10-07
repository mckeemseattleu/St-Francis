'use client';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from '../Report.module.css';

type ReportBarChartProps = {
    title: string;
    data: Array<{ name: string; value: number; fill: string }>;
};

export default function ReportBarChart(props: ReportBarChartProps) {
    const { title, data } = props;
    const filteredData = data.filter((dataPoint) => dataPoint.value !== 0);
    return (
        <div className={styles.outerBarChartContainer}>
            <h2>{title}</h2>
            <ResponsiveContainer aspect={2.5 / 1}>
                <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" barSize={40} />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="left"
                        payload={filteredData.map((dp) => ({
                            value: dp.name + ': ' + dp.value,
                            type: 'line',
                        }))}
                        wrapperStyle={{ width: '200px', lineHeight: 2 }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
