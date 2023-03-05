import { Client } from '@/models/index';
import { DocFilter, fetchData } from './fetchData';

export const CLIENTS_LIMIT = 50;
export const CLIENTS_PATH = 'clients';

/**
 * List clients documents from firestore based on the provided fields and path parameters.
 *
 * @param fields Filtering object where the key is the field name and the value is the value to filter by.
 * @param limit Maximum number of documents to fetch. If not provided, the default limit is used.
 * @returns Array of documents fetched from firestore.
 * @author ducmvo
 */
export async function listClients(
    fields: DocFilter = {},
    limit = CLIENTS_LIMIT
) {
    const clients = await fetchData<Client>(fields, CLIENTS_PATH, limit);
    return clients as Array<Client>;
}

/**
 * Get a single client document from firestore based on id
 *
 * @param id Id of the client document to fetch.
 * @returns requested client document fetched from firestore.
 * @author ducmvo
 */
export async function getClient(id: string) {
    const doc = await fetchData({ id: id }, CLIENTS_PATH);
    return doc as Client;
}
