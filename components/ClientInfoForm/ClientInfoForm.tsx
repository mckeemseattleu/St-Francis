import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';

interface ClientInfoFormProps {
    id?: string;
}

export default function ClientInfoForm({
    id = undefined,
}: ClientInfoFormProps) {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [middleInitial, setMiddleInitial] = useState<string>('');
    const [birthday, setBirthday] = useState<any>(
        new Date().toISOString().substring(0, 10)
    );
    const [gender, setGender] = useState<string>('');
    const [race, setRace] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const [numKids, setNumKids] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');
    const router = useRouter();

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
                isBanned: false,
            });
        }

        // Redirect back to index page
        router.push('/');
    };

    const updateClientData = async () => {
        // Ensure id's not undefined
        if (id)
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
                isCheckedIn: false,
                isBanned: false,
            });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                // If we have an id as a prop, update, else create new
                id ? updateClientData() : addNewClient();
            }}
        >
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

            <button type="submit">Create</button>
        </form>
    );
}
