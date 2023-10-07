'use client';
import {
    Bar,
    BarChart,
    CartesianGrid,
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
            <div className={styles.innerBarChartContainer}>
                <div>
                    {filteredData.map((dataPoint: any) => (
                        <p key={dataPoint.name}>
                            {dataPoint.name}: {dataPoint.value}
                        </p>
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" aspect={2.0 / 1.0}>
                        <BarChart
                            data={filteredData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
