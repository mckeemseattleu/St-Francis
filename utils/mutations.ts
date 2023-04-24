import { Timestamp } from 'firebase/firestore';
import { DocFilter, mutateData } from './fetchData';
import { CLIENTS_PATH, VISITS_PATH } from './queries';

export async function createClient(clientData: DocFilter) {
    clientData.createdAt = Timestamp.now();
    clientData.id = await mutateData(clientData, CLIENTS_PATH);
    return clientData;
}

export async function updateClient(clientData: DocFilter) {
    clientData.updatedAt = Timestamp.now();
    await mutateData(clientData, CLIENTS_PATH);
    return clientData;
}

export async function createVisit(visitData: DocFilter, clientID: string) {
    visitData.createdAt = Timestamp.now();
    visitData.id = await mutateData(visitData, [
        CLIENTS_PATH,
        clientID,
        VISITS_PATH,
    ]);
    return visitData;
}

export async function updateVisit(visitData: DocFilter, clientID: string) {
    visitData.updatedAt = Timestamp.now();
    await mutateData(visitData, [CLIENTS_PATH, clientID, VISITS_PATH]);
    return visitData;
}
