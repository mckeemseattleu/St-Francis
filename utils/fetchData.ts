import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit as flimit,
    query as fquery,
    setDoc,
    where,
    Timestamp,
    orderBy,
    deleteDoc,
} from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';

const DEFAULT_PATH = 'clients';
const LIMIT = 50;

/**
 * Interface for filtering documents in firestore.
 * The key is the field name and the value is the value to filter by.
 * Could be used with QueryFieldFilterConstraint from firebase/firestore.
 */
export type DocFilter = {
    [key: string]: string | number | boolean | Timestamp | Date | null;
};

/**
 * Fetches documents from firestore based on the provided fields and path parameters.
 *
 * @param fields Filtering object where the key is the field name and the value is the value to filter by.
 *               Support: the filter supports equality ('==') only for key-value pair.
 * @param limit Maximum number of documents to fetch. If not provided, the default limit is used.
 * @param path  Path to the collection to fetch from. If not provided, the default collection is used.
 *              Path can be an array of path segments
 * @returns Array of documents fetched from firestore.
 * @author ducmvo
 */
export async function fetchData<DocType>(
    fields: DocFilter = {},
    path: string | Array<string> = DEFAULT_PATH,
    limit = LIMIT,
    order: { by: string; desc: boolean } | null = null
): Promise<Array<DocType> | DocType> {
    // Todo: Add support for other comparison constraints
    if (!path) return [];
    if (typeof path == 'string') path = [path];

    // Fetch single document based on id
    if (fields.id && typeof fields.id == 'string') {
        const docRef = doc(firestore, path[0], ...path.slice(1), fields.id);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) return null as DocType;
        return { ...docSnapshot.data(), id: docSnapshot.id } as DocType;
    }

    const collectionRef = collection(firestore, path[0], ...path.slice(1));
    const constraints = Object.entries(fields).map(([key, val]) =>
        where(key, '==', val)
    );

    const orderContraints = [];
    if (order)
        orderContraints.push(orderBy(order.by, order.desc ? 'desc' : 'asc'));

    const preparedQuery = fquery(
        collectionRef,
        flimit(limit),
        ...orderContraints,
        ...constraints
    );
    const snapshot = await getDocs(preparedQuery);

    return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as Array<DocType>;
}

/**
 * Create or update a document in firestore based on the provided fields and path parameters.
 *
 * @param data  Data to be stored in the document.
 * @param path  Path to the collection to mutate. If not provided, the default collection is used.
 *              Path can be an array of path segments
 * @param isDelete  If true, the document will be deleted instead of updated.
 * @returns id of the updated or newly created document.
 * @author ducmvo
 */
export async function mutateData(
    data: DocFilter,
    path: string | Array<string> = DEFAULT_PATH,
    isDelete: boolean = false
) {
    if (!path) return null;
    if (typeof path == 'string') path = [path];

    let docRef;
    const id = data.id as string;
    if (id) docRef = doc(firestore, path[0], ...path.slice(1), id);
    else docRef = doc(collection(firestore, path[0], ...path.slice(1)));

    if (isDelete) await deleteDoc(docRef);
    else await setDoc(docRef, data, { merge: true });

    return docRef.id;
}
