import { Client, Settings, Visit } from '@/models/index';
import {
    DocFilter,
    fetchData,
    CLIENTS_LIMIT,
    CLIENTS_PATH,
    SETTINGS_ID,
    SETTINGS_PATH,
    VISITS_LIMIT,
    VISITS_PATH,
} from '@/utils/index';

/**
 * List clients documents from firestore based on the provided filter fields.
 *
 * @param fields Filtering object where the key is the field name and the value is the value to filter by.
 *              Support: the filter supports equality ('==') only for key-value pair.
 * @param limit Maximum number of documents to fetch. If not provided, the default limit is used.
 * @returns Array of documents fetched from firestore.
 * @author ducmvo
 */
export async function listClients(
    fields: DocFilter = {},
    limit = CLIENTS_LIMIT,
    order: { by: string; desc: boolean } | null = null
) {
    return (await fetchData<Client>(
        fields,
        CLIENTS_PATH,
        limit,
        order
    )) as Array<Client>;
}

/**
 * Get a single client document from firestore based on id
 *
 * @param id Id of the client document to fetch.
 * @returns requested client document fetched from firestore.
 * @author ducmvo
 */
export async function getClient(id: string) {
    return (await fetchData<Client>({ id: id }, CLIENTS_PATH)) as Client;
}

/**
 * List visit documents from firestore based on the provided client id and filter fields .
 *
 * @param clientID Id of the client to fetch visits for.
 * @param fields Filtering object where the key is the field name and the value is the value to filter by.
 *              Support: the filter supports equality ('==') only for key-value pair.
 * @param limit Maximum number of documents to fetch. If not provided, the default limit is used.
 * @returns Array of documents fetched from firestore.
 * @author ducmvo
 */
export async function listVisits(
    clientID: string,
    fields: DocFilter = {},
    limit = VISITS_LIMIT,
    order: { by: string; desc: boolean } | null = {
        by: 'createdAt',
        desc: true,
    }
) {
    return (await fetchData(
        fields,
        [CLIENTS_PATH, clientID, VISITS_PATH],
        limit,
        order
    )) as Array<Visit>;
}

/**
 *  Get a single visit document from firestore based on client id and visit id.
 * @param clientID  Id of the client to fetch visits for.
 * @param visitID  Id of the visit to fetch.
 * @returns  requested visit document fetched from firestore.
 */
export async function getVisit(clientID: string, visitID: string) {
    return (await fetchData<Visit>({ id: visitID }, [
        CLIENTS_PATH,
        clientID,
        VISITS_PATH,
    ])) as Visit;
}

/**
 * Get settings document from firestore based on the provided settings id.
 * @param settingsID  Id of the settings document to fetch, if null use 'default'.
 * @returns requested settings document fetched from firestore.
 */
export async function getSettings(settingsID: string = SETTINGS_ID) {
    return (await fetchData<Settings>(
        { id: settingsID },
        SETTINGS_PATH
    )) as Settings;
}
