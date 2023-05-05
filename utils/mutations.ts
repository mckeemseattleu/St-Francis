import { CLIENTS_PATH, SETTINGS_PATH, VISITS_PATH } from '@/utils/constants';
import { Timestamp } from 'firebase/firestore';
import { mutateData, DocFilter } from '@/utils/fetchData';
import { listVisits } from '@/utils/queries';
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
 * This function will update client lastVisit, lastBackpack, and lastSleepingbag
 * @param clientID - id of client to be revised
 */
export const reviseClient = async (clientID: string) => {
    const lastVisit = (await listVisits(clientID, {}, 1))[0]?.createdAt || null;
    const lastBackpack =
        (await listVisits(clientID, { backpack: true }, 1))[0]?.createdAt ||
        null;
    const lastSleepingbag =
        (await listVisits(clientID, { sleepingBag: true }, 1))[0]?.createdAt ||
        null;

    return await updateClient({
        id: clientID,
        lastBackpack,
        lastSleepingbag,
        lastVisit,
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
 * Deletes visit data
 * @param visitID  - id of visit to be deleted
 * @param clientID  - id of visit's client to be updated
 */
export async function deleteVisit(visitID: string, clientID: string) {
    await mutateData(
        { id: visitID },
        [CLIENTS_PATH, clientID, VISITS_PATH],
        true
    );
    await reviseClient(clientID);
}

/**
 * Deletes client data
 * @param clientID - id of client to be deleted
 */
export async function deleteClient(clientID: string) {
    return await mutateData({ id: clientID }, CLIENTS_PATH, true);
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
