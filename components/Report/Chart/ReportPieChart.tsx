'use client';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styles from '../Report.module.css';

type ReportPieChartProps = {
    title: string;
    data: Array<{ name: string; value: number; fill: string }>;
};

export default function ReportPieChart(props: ReportPieChartProps) {
    const { title, data } = props;
    const filteredData = data.filter((dataPoint) => dataPoint.value !== 0);
    return (
        <div className={styles.outerPieChartContainer}>
            <h2>{title}</h2>
            <ResponsiveContainer width="99%" aspect={3.5 / 1}>
                <PieChart>
                    <Pie
                        data={filteredData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={'40%'}
                        outerRadius={'65%'}
                        label={(data) =>
                            `${data.name} (${Math.round(data.percent * 100)}%)`
                        }
                        style={{ fontSize: '0.9rem' }}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="left"
                        payload={filteredData.map((dataPoint) => ({
                            value: dataPoint.name + ': ' + dataPoint.value,
                            type: 'line',
                        }))}
                        wrapperStyle={{ width: '200px', lineHeight: 2 }}
                    />
                    <Tooltip formatter={(value) => [value]} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
