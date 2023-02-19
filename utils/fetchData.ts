import {
    collection,
    getDocs,
    limit as flimit,
    query as fquery,
    where,
} from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

const DEFAULT_PATH = 'clients';
const LIMIT = 50;

export type DocFilter = {
    [key: string]: string | boolean;
};

/**
 * Fetches documents from firestore based on the provided fields and path parameters.
 * 
 * @param fields Filtering object where the key is the field name and the value is the value to filter by.
 * @param limit Maximum number of documents to fetch. If not provided, the default limit is used.
 * @param path  Path to the collection to fetch from. If not provided, the default collection is used. 
 *              Path can be an array of path segments
 * @returns Array of documents fetched from firestore.
 * @author ducmvo
 */
export async function fetchData<DocType>(
    fields: DocFilter,
    path: string | Array<string> = DEFAULT_PATH,
    limit = LIMIT
): Promise<Array<DocType>> {
    // Todo: Add support for other comparison constraints
    if (!path) return [];
    if (typeof path == 'string') path = [path];
    const collectionRef = collection(firestore, path[0], ...path.slice(1));
    const constraints = Object.entries(fields).map(([key, val]) =>
        where(key, '==', val)
    );
    const preparedQuery = fquery(collectionRef, flimit(limit), ...constraints);
    const snapshot = await getDocs(preparedQuery);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as Array<DocType>;
}
