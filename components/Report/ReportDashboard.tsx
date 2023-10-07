'use client';
import {
    genderList,
    raceList,
} from '@/components/Client/ClientInfoForm/ClientInfoForm';
import ReportBarChart from '@/components/Report/Chart/ReportBarChart';
import ReportPieChart from '@/components/Report/Chart/ReportPieChart';
import { Client } from '@/models/index';
import { colorPalette } from '@/styles/colorPalette';
import ReportNumberBlock from './Chart/ReportDataBlock';
import styles from './Report.module.css';

const shortenRaceLabels = {
    'Black or African American': 'Black',
    'American Indian or Alaska Native': 'Native American',
    'Native Hawaiian or Other Pacific Islander': 'Pacific Islander',
} as Record<string, string>;

export default function ReportDashboard(props: { clients: Array<Client> }) {
    const { clients } = props;

    const getRaceData = (clients: Client[]) => {
        const raceCountsMap = {} as Record<string, number>;
        raceList.forEach((race) => (raceCountsMap[race] = 0));
        clients.forEach((client) =>
            client.race
                ? raceCountsMap[client.race]++
                : raceCountsMap['Other']++
        );
        return Object.entries(raceCountsMap).map((entry) => ({
            name: shortenRaceLabels[entry[0]] || entry[0],
            value: entry[1],
            fill: getRandomColor(),
        }));
    };

    const getRandomColor = () => {
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    };

    const getKidsCount = (clients: Client[]) => {
        return clients.reduce(
            (count, client) => count + (client.numKids || 0),
            0
        );
    };

    const getBPCResidentCount = (clients: Client[]) => {
        return clients.filter((client) => !!client.BPCResident).length;
    };

    const getGenderData = (clients: Client[]) => {
        const genderCountsMap = {} as Record<string, number>;

        genderList.forEach((race) => (genderCountsMap[race] = 0));
        clients.forEach((client) =>
            client.gender
                ? genderCountsMap[client.gender]++
                : genderCountsMap['Other']++
        );
        return Object.entries(genderCountsMap).map((entry) => ({
            name: entry[0],
            value: entry[1],
            fill: getRandomColor(),
        }));
    };

    const getOtherStatsData = (clients: Client[]) => {
        const otherStats = {
            Kids: getKidsCount(clients),
            Sheltered: clients.filter((client) => !!client.sheltered).length,
            Unhoused: clients.filter((client) => !!client.unhoused).length,
            Banned: clients.filter((client) => !!client.isBanned).length,
            'BPC Residents': getBPCResidentCount(clients),
        };
        return Object.entries(otherStats).map(([name, value]) => ({
            name,
            value,
            fill: getRandomColor(),
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.dashboardContainer}>
                <ReportNumberBlock
                    title="Clients"
                    data={clients.length}
                    data-testid="client-count"
                />
                <ReportNumberBlock
                    title="Kids"
                    data={getKidsCount(clients)}
                    data-testid="kid-count"
                />
                <ReportNumberBlock
                    title="BPC Residents"
                    data={getBPCResidentCount(clients)}
                    data-testid="bpc-resident-count"
                />
            </div>
            <div className={styles.dashboardContainer}>
                <ReportPieChart title="Gender" data={getGenderData(clients)} />
            </div>
            <div className={styles.dashboardContainer}>
                <ReportPieChart title="Race" data={getRaceData(clients)} />
            </div>
            <ReportBarChart
                title="Other Stats"
                data={getOtherStatsData(clients)}
            />
        </div>
    );
}
