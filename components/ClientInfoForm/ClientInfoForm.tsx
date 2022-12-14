import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClientDoc } from '../../app/profile/[userId]/page';
import { firestore } from '../../firebase/firebase';

interface ClientInfoFormProps {
    id?: string;
    initialData?: ClientDoc;
    redirect?: string;
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
}: ClientInfoFormProps) {
    // Use default values if no initial data was passed in
    const [clientData, setClientData] = useState<ClientDoc>(
        initialData
            ? initialData
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

    // Creates a new doc with an automatically generated id for the client
    const addNewClient = async () => {
        // Only create if either first or last name is not empty
        if (clientData.firstName !== '' || clientData.lastName !== '') {
            await addDoc(collection(firestore, 'clients'), clientData);
        }

        // Redirect back to specified redirect route
        router.push(redirect);
    };

    // Updates an existing client's document. If id is invalid will do nothing,
    // but this should never run with an invalid id
    const updateClientData = async () => {
        // Ensure id's not undefined
        if (id) {
            await setDoc(doc(firestore, 'clients', id), clientData);

            // Redirect to specified route
            router.push(redirect);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                // Prevent redirect
                e.preventDefault();
                // If we have an id as a prop, update, else create new
                id ? updateClientData() : addNewClient();
            }}
        >
            <h2>Ban</h2>
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

            <h2>First name</h2>
            <input
                type="text"
                value={clientData.firstName}
                onChange={(e) => {
                    setClientData({ ...clientData, firstName: e.target.value });
                }}
            />
            <br />

            <h2>Middle initial</h2>
            <input
                type="text"
                value={clientData.middleInitial}
                onChange={(e) => {
                    setClientData({
                        ...clientData,
                        middleInitial: e.target.value,
                    });
                }}
            />
            <br />

            <h2>Last name</h2>
            <input
                type="text"
                value={clientData.lastName}
                onChange={(e) => {
                    setClientData({ ...clientData, lastName: e.target.value });
                }}
            />
            <br />

            <h2>Birthday</h2>
            <input
                type="date"
                name="birthday"
                id="birthday"
                value={clientData.birthday}
                onChange={(e) => {
                    setClientData({ ...clientData, birthday: e.target.value });
                }}
            />

            <h2>Gender</h2>
            <input
                type="text"
                value={clientData.gender}
                onChange={(e) => {
                    setClientData({ ...clientData, gender: e.target.value });
                }}
            />
            <br />

            <h2>Race</h2>
            <input
                type="text"
                value={clientData.race}
                onChange={(e) => {
                    setClientData({ ...clientData, race: e.target.value });
                }}
            />
            <br />

            <h2>Postal code</h2>
            <input
                type="text"
                value={clientData.postalCode}
                onChange={(e) => {
                    setClientData({
                        ...clientData,
                        postalCode: e.target.value,
                    });
                }}
            />
            <br />

            <h2>Number of kids</h2>
            <input
                type="number"
                value={clientData.numKids}
                onChange={(e) => {
                    setClientData({
                        ...clientData,
                        numKids: parseInt(e.target.value),
                    });
                }}
            />
            <br />

            <h2>Notes</h2>
            <textarea
                value={clientData.notes}
                onChange={(e) => {
                    setClientData({ ...clientData, notes: e.target.value });
                }}
                cols={40}
                rows={5}
            />
            <br />

            <button type="submit">Save</button>
        </form>
    );
}
