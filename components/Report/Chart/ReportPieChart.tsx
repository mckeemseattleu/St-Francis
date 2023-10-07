'use client';
import { Pie, PieChart, Tooltip } from 'recharts';
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
            <div className={styles.innerPieChartContainer}>
                <div>
                    {filteredData.map(
                        (dataPoint: { name: string; value: number }) => (
                            <p
                                key={dataPoint.name}
                                data-testid={dataPoint.name}
                            >
                                {dataPoint.name}: {dataPoint.value}
                            </p>
                        )
                    )}
                </div>
                <div>
                    <PieChart width={250} height={250}>
                        <Pie
                            data={filteredData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </div>
            </div>
        </div>
    );
}
