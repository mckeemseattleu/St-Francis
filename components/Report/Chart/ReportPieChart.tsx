'use client';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styles from '../Report.module.css';

type ReportPieChartProps = {
    title: string;
    data: Array<{ name: string; value: number; fill: string }>;
    cx?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function ReportPieChart(props: ReportPieChartProps) {
    const { title, data, ...rest } = props;
    const filteredData = data.filter((dataPoint) => dataPoint.value !== 0);

    return (
        <div
            className={
                styles.outerPieChartContainer + ` ${rest.className || ''}`
            }
        >
            <h2>{title}</h2>
            <ResponsiveContainer height="90%" aspect={1.5} maxHeight={250}>
                <PieChart className={styles.innerPieChartContainer}>
                    <Pie
                        data={filteredData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={'40%'}
                        outerRadius={'65%'}
                        label={(dataPoint) => dataPoint.name}
                        fontSize={'0.9rem'}
                        width={'100%'}
                        paddingAngle={2}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="left"
                        payload={filteredData.map((dataPoint) => ({
                            value: dataPoint.name + ': ' + dataPoint.value,
                            type: 'line',
                        }))}
                        wrapperStyle={{ lineHeight: 2 }}
                    />
                    <Tooltip formatter={(value) => [value]} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
