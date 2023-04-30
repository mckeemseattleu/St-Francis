import { Timestamp } from 'firebase/firestore';
import { DocFilter, mutateData } from './fetchData';
import { CLIENTS_PATH, SETTINGS_PATH, VISITS_PATH } from './queries';

/**
 * Creates client data, id will be generated
 * @param clientData - client data to be created
 * @returns created client data with created timestamp
 * @author ducmvo
 */
export async function createClient(clientData: DocFilter) {
    clientData.createdAt = Timestamp.now();
    clientData.id = await mutateData(clientData, CLIENTS_PATH);
    return clientData;
}

/**
 *  Updates client data
 * @param clientData - client data to be updated, must contain id
 * @returns  updated client data with updated timestamp
 * @author ducmvo
 */
export async function updateClient(clientData: DocFilter) {
    clientData.updatedAt = Timestamp.now();
    await mutateData(clientData, CLIENTS_PATH);
    return clientData;
}

/**
 *  Creates visit data, id will be generated
 * @param visitData  - visit data to be created
 * @param clientID  - id of visit's client
 * @returns  created visit data with created timestamp
 * @author ducmvo
 */
export async function createVisit(visitData: DocFilter, clientID: string) {
    visitData.createdAt = Timestamp.now();
    visitData.id = await mutateData(visitData, [
        CLIENTS_PATH,
        clientID,
        VISITS_PATH,
    ]);
    return visitData;
}

/**
 *  Updates visit data
 * @param visitData - visit data to be updated, must contain id
 * @param clientID - id of visit's client to be updated
 * @returns updated visit data with updated timestamp
 * @author ducmvo
 */
export async function updateVisit(visitData: DocFilter, clientID: string) {
    visitData.updatedAt = Timestamp.now();
    await mutateData(visitData, [CLIENTS_PATH, clientID, VISITS_PATH]);
    return visitData;
}

/**
 * Updates settings data
 * @param settingsData - settings data to be updated, must contain id
 * @returns updated settings data with updated timestamp
 * @author ducmvo
 */
export async function updateSettings(settingsData: DocFilter) {
    settingsData.updatedAt = Timestamp.now();
    await mutateData(settingsData, SETTINGS_PATH);
    return settingsData;
}
