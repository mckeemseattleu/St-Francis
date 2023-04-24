import { Client, Visit } from '@/models/index';
import { Timestamp } from 'firebase/firestore';
import { DocFilter, fetchData } from './fetchData';

export const CLIENTS_PATH = 'clients';
export const VISITS_PATH = 'visits';

// TODO: consider moving these to user settings
export const CLIENTS_LIMIT = 50;
export const VISITS_LIMIT = 5;

/**
 * List clients documents from firestore based on the provided filter fields.
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
    const clientDocs = (await fetchData<Client>(
        fields,
        CLIENTS_PATH,
        limit
    )) as Array<Client>;
    return clientDocs.map((clientDoc: Client) => ({
        ...clientDoc,
        birthday:
            clientDoc.birthday &&
            new Timestamp(
                clientDoc.birthday.seconds,
                clientDoc.birthday.nanoseconds
            ),
        createdAt:
            clientDoc.createdAt &&
            new Timestamp(
                clientDoc.createdAt.seconds,
                clientDoc.createdAt.nanoseconds
            ),
        updatedAt:
            clientDoc.updatedAt &&
            new Timestamp(
                clientDoc.updatedAt.seconds,
                clientDoc.updatedAt.nanoseconds
            ),
    }));
}

/**
 * Get a single client document from firestore based on id
 *
 * @param id Id of the client document to fetch.
 * @returns requested client document fetched from firestore.
 * @author ducmvo
 */
export async function getClient(id: string) {
    const clientDoc = (await fetchData<Client>(
        { id: id },
        CLIENTS_PATH
    )) as Client;
    return clientDoc?.birthday
        ? {
              ...clientDoc,
              birthday: new Timestamp(
                  clientDoc.birthday.seconds,
                  clientDoc.birthday.nanoseconds
              ),
          }
        : clientDoc;
}

/**
 * List visit documents from firestore based on the provided client id and filter fields .
 *
 * @param clientID Id of the client to fetch visits for.
 * @param fields Filtering object where the key is the field name and the value is the value to filter by.
 * @param limit Maximum number of documents to fetch. If not provided, the default limit is used.
 * @returns Array of documents fetched from firestore.
 * @author ducmvo
 */
export async function listVisits(
    clientID: string,
    fields: DocFilter = {},
    limit = VISITS_LIMIT
) {
    const visitDocs = (await fetchData<Visit>(
        fields,
        [CLIENTS_PATH, clientID, VISITS_PATH],
        limit
    )) as Array<Visit>;
    return visitDocs.map((visit: Visit) => ({
        ...visit,
        createdAt:
            visit.createdAt &&
            new Timestamp(visit.createdAt.seconds, visit.createdAt.nanoseconds),
    }));
}

/**
 *  Get a single visit document from firestore based on client id and visit id.
 * @param clientID  Id of the client to fetch visits for.
 * @param visitID  Id of the visit to fetch.
 * @returns  requested visit document fetched from firestore.
 */
export async function getVisit(clientID: string, visitID: string) {
    const visitDoc = (await fetchData<Visit>({ id: visitID }, [
        CLIENTS_PATH,
        clientID,
        VISITS_PATH,
    ])) as Visit;
    return visitDoc?.createdAt
        ? {
              ...visitDoc,
              createdAt: new Timestamp(
                  visitDoc.createdAt.seconds,
                  visitDoc.createdAt.nanoseconds
              ),
          }
        : visitDoc;
}
