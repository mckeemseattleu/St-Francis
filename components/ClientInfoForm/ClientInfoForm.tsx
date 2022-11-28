import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';

interface ClientInfoFormProps {
    id?: string;
    initialData?: {
        firstName: string;
        lastName: string;
        middleInitial: string;
        birthday: string; // TODO: Consider saving as timestamp
        gender: string;
        race: string;
        postalCode: string;
        numKids: number;
        notes: string;
        isCheckedIn: boolean;
        isBanned: boolean;
    };
}

/**
 * A form for creating or editing a client's document in the database.
 *
 * @param id The client's document we want to edit. If none is given, a new
 * client document will be created
 * @param initialData Initial values to have in the input fields. If none are
 * given, empty strings will be used for text fields, 0 for number fields, and
 * the current date used for birthday
 */
export default function ClientInfoForm({
    id = undefined,
    initialData = undefined,
}: ClientInfoFormProps) {
    // Use old info from props if it exists, else default values
    const [firstName, setFirstName] = useState<string>(
        initialData ? initialData.firstName : ''
    );
    const [lastName, setLastName] = useState<string>(
        initialData ? initialData.lastName : ''
    );
    const [middleInitial, setMiddleInitial] = useState<string>(
        initialData ? initialData.middleInitial : ''
    );
    const [birthday, setBirthday] = useState<any>(
        initialData
            ? initialData.birthday
            : new Date().toISOString().substring(0, 10)
    );
    const [gender, setGender] = useState<string>(
        initialData ? initialData.gender : ''
    );
    const [race, setRace] = useState<string>(
        initialData ? initialData.race : ''
    );
    const [postalCode, setPostalCode] = useState<string>(
        initialData ? initialData.postalCode : ''
    );
    const [numKids, setNumKids] = useState<number>(
        initialData ? initialData.numKids : 0
    );
    const [notes, setNotes] = useState<string>(
        initialData ? initialData.notes : ''
    );
    const [isCheckedIn, setIsCheckedIn] = useState<boolean>(
        initialData ? initialData.isCheckedIn : false
    );
    const [isBanned, setIsBanned] = useState<boolean>(
        initialData ? initialData.isBanned : false
    );
    const router = useRouter();

    // Creates a new doc with an automatically generated id for the client
    const addNewClient = async () => {
        // Only create if either first or last name is not empty
        if (firstName !== '' || lastName !== '') {
            await addDoc(collection(firestore, 'clients'), {
                firstName,
                lastName,
                middleInitial,
                birthday, // TODO: Consider saving as timestamp
                gender,
                race,
                postalCode,
                numKids,
                notes,
                isCheckedIn: false,
                isBanned,
            });
        }

        // Redirect back to index page
        router.push('/');
    };

    // Updates an existing client's document. If id is invalid will do nothing,
    // but this should never run with an invalid id
    const updateClientData = async () => {
        // Ensure id's not undefined
        if (id) {
            await setDoc(doc(firestore, 'clients', id), {
                firstName,
                lastName,
                middleInitial,
                birthday, // TODO: Consider saving as timestamp
                gender,
                race,
                postalCode,
                numKids,
                notes,
                isCheckedIn,
                isBanned,
            });

            router.push('/');
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
                defaultChecked={isBanned}
                value={isBanned ? 'on' : 'off'}
                onChange={(e) => {
                    setIsBanned(e.target.checked);
                }}
            />

            <h2>First name</h2>
            <input
                type="text"
                value={firstName}
                onChange={(e) => {
                    setFirstName(e.target.value);
                }}
            />
            <br />

            <h2>Middle initial</h2>
            <input
                type="text"
                value={middleInitial}
                onChange={(e) => {
                    setMiddleInitial(e.target.value);
                }}
            />
            <br />

            <h2>Last name</h2>
            <input
                type="text"
                value={lastName}
                onChange={(e) => {
                    setLastName(e.target.value);
                }}
            />
            <br />

            <h2>Birthday</h2>
            <input
                type="date"
                name="birthday"
                id="birthday"
                value={birthday}
                onChange={(e) => {
                    setBirthday(e.target.value);
                }}
            />

            <h2>Gender</h2>
            <input
                type="text"
                value={gender}
                onChange={(e) => {
                    setGender(e.target.value);
                }}
            />
            <br />

            <h2>Race</h2>
            <input
                type="text"
                value={race}
                onChange={(e) => {
                    setRace(e.target.value);
                }}
            />
            <br />

            <h2>Postal code</h2>
            <input
                type="text"
                value={postalCode}
                onChange={(e) => {
                    setPostalCode(e.target.value);
                }}
            />
            <br />

            <h2>Number of kids</h2>
            <input
                type="number"
                value={numKids}
                onChange={(e) => {
                    setNumKids(parseInt(e.target.value));
                }}
            />
            <br />

            <h2>Notes</h2>
            <textarea
                value={notes}
                onChange={(e) => {
                    setNotes(e.target.value);
                }}
                cols={40}
                rows={5}
            />
            <br />

            <button type="submit">Save</button>
        </form>
    );
}
