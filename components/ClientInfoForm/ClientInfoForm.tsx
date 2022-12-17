import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClientDoc } from '../../app/profile/[userId]/page';
import { firestore } from '../../firebase/firebase';
import styles from './ClientInfoForm.module.css';

interface ClientInfoFormProps {
    id?: string;
    initialData?: ClientDoc;
    redirect?: string;
    title?: string;
}

/**
 * A form for creating or editing a client's document in the database.
 *
 * @param id The client's document we want to edit. If none is given, a new
 * client document will be created
 * @param initialData Initial values to have in the input fields. If none are
 * given, empty strings will be used for text fields, 0 for number fields, and
 * the current date used for birthday
 * @param redirect Route to redirect to when form is submitted. Defaults to homepage
 */
export default function ClientInfoForm({
    id = undefined,
    initialData = undefined,
    redirect = '/',
    title = 'Client Form',
}: ClientInfoFormProps) {
    // Use default values if no initial data was passed in
    const [clientData, setClientData] = useState<ClientDoc>(
        initialData
            ? {
                  firstName: initialData.firstName ? initialData.firstName : '',
                  lastName: initialData.lastName ? initialData.lastName : '',
                  middleInitial: initialData.middleInitial
                      ? initialData.middleInitial
                      : '',
                  birthday: initialData.birthday
                      ? initialData.birthday
                      : new Date().toISOString().substring(0, 10), // TODO: Consider saving as timestamp
                  gender: initialData.gender ? initialData.gender : '',
                  race: initialData.race ? initialData.race : '',
                  postalCode: initialData.postalCode
                      ? initialData.postalCode
                      : '',
                  numKids: initialData.numKids ? initialData.numKids : 0,
                  notes: initialData.notes ? initialData.notes : '',
                  isCheckedIn: initialData.isCheckedIn
                      ? initialData.isCheckedIn
                      : false,
                  isBanned: initialData.isBanned ? initialData.isBanned : false,
              }
            : {
                  firstName: '',
                  lastName: '',
                  middleInitial: '',
                  birthday: new Date().toISOString().substring(0, 10), // TODO: Consider saving as timestamp
                  gender: '',
                  race: '',
                  postalCode: '',
                  numKids: 0,
                  notes: '',
                  isCheckedIn: false,
                  isBanned: false,
              }
    );

    const router = useRouter();

    /**
     * Creates a new doc with an automatically generated id for the client
     *
     * @param newCheckedInStatus The new isCheckedIn status to save
     */
    const addNewClient = async (newCheckedInStatus: boolean) => {
        // Only create if either first or last name is not empty
        if (clientData.firstName !== '' || clientData.lastName !== '') {
            await addDoc(collection(firestore, 'clients'), {
                ...clientData,
                isCheckedIn: newCheckedInStatus,
            });
        }

        // Redirect back to specified redirect route
        router.push(redirect);
    };

    /**
     *
     * Updates an existing client's document. If id is invalid will do nothing,
     * but this should never run with an invalid id
     * @param newCheckedInStatus The new isCheckedIn status to save
     */
    const updateClientData = async (newCheckedInStatus: boolean) => {
        // Ensure id's not undefined
        if (id) {
            await setDoc(doc(firestore, 'clients', id), {
                ...clientData,
                isCheckedIn: newCheckedInStatus,
            });

            // Redirect to specified route
            router.push(redirect);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1>{title}</h1>

                <div>
                    <label htmlFor="isBanned">Ban</label>
                    <input
                        type="checkbox"
                        name="isBanned"
                        id="isBanned"
                        defaultChecked={clientData.isBanned}
                        value={clientData.isBanned ? 'on' : 'off'}
                        onChange={(e) => {
                            setClientData({
                                ...clientData,
                                isBanned: e.target.checked,
                            });
                        }}
                    />
                </div>
            </div>

            <form>
                <div className={styles.formRows}>
                    <div className={styles.formRowItem}>
                        <label htmlFor="firstName">First name</label>
                        <input
                            type="text"
                            value={clientData.firstName}
                            id="firstName"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    firstName: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="middleInitial">Middle initial</label>
                        <input
                            type="text"
                            value={clientData.middleInitial}
                            id="middleInitial"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    middleInitial: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="lastName">Last name</label>
                        <input
                            type="text"
                            value={clientData.lastName}
                            id="lastName"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    lastName: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="birthday">Birthday</label>
                        <input
                            type="date"
                            name="birthday"
                            id="birthday"
                            value={clientData.birthday}
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    birthday: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="gender">Gender</label>
                        <input
                            type="text"
                            value={clientData.gender}
                            id="gender"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    gender: e.target.value,
                                });
                            }}
                        />
                        <br />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="race">Race</label>
                        <input
                            type="text"
                            value={clientData.race}
                            id="race"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    race: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="postalCode">Postal code</label>
                        <input
                            type="text"
                            value={clientData.postalCode}
                            id="postalCode"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    postalCode: e.target.value,
                                });
                            }}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="numKids">Number of Kids</label>
                        <input
                            type="number"
                            value={clientData.numKids}
                            id="numKids"
                            onChange={(e) => {
                                setClientData({
                                    ...clientData,
                                    numKids: parseInt(e.target.value),
                                });
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        value={clientData.notes}
                        id="notes"
                        onChange={(e) => {
                            setClientData({
                                ...clientData,
                                notes: e.target.value,
                            });
                        }}
                        rows={5}
                    />
                </div>
            </form>

            <button
                onClick={() => {
                    // If we have an id as a prop, update, else create new; also
                    // keep current isCheckedIn status
                    id
                        ? updateClientData(clientData.isCheckedIn)
                        : addNewClient(clientData.isCheckedIn);
                }}
            >
                Save
            </button>

            <button
                onClick={() => {
                    // If we have an id as a prop, update, else create new; also
                    // toggle isCheckedIn status
                    id
                        ? updateClientData(!clientData.isCheckedIn)
                        : addNewClient(!clientData.isCheckedIn);
                }}
            >
                Save and check {clientData.isCheckedIn ? 'out' : 'in'}
            </button>
        </div>
    );
}
