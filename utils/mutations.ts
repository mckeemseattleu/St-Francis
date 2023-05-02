import { Timestamp } from 'firebase/firestore';
import { Visit } from '@/models/index';
import { DocFilter, fetchLatestData, mutateData } from './fetchData';
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
 *  Revise client data after any visit data mutation.
 * This function will update lastBackpack and lastSleepingBag of client
 * @param clientID - id of client to be revised
 */
const reviseClient = async (clientID: string) => {
    const path = [CLIENTS_PATH, clientID, VISITS_PATH];
    const lastBackpack =
        (await fetchLatestData<Visit>({ backpack: true }, path))?.createdAt ||
        null;
    const lastSleepingBag =
        (await fetchLatestData<Visit>({ sleepingBag: true }, path))
            ?.createdAt || null;
    return await updateClient({
        id: clientID,
        lastBackpack,
        lastSleepingBag,
    });
};

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
    await reviseClient(clientID);
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
    await reviseClient(clientID);
    return visitData;
}

/**
 *  Deletes visit data
 * @param visitID  - id of visit to be deleted
 * @param clientID  - id of visit's client to be updated
 */
export async function deleteVisit(visitID: string, clientID: string) {
    await mutateData(
        { id: visitID },
        [CLIENTS_PATH, clientID, VISITS_PATH],
        true
    );
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
