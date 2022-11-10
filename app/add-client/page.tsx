'use client';

import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { firestore } from '../../firebase/firebase';

export default function AddClient() {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const router = useRouter();

    const addNewClient = async () => {
        // Only create if either first or last name is not empty
        if (firstName !== '' || lastName !== '') {
            await addDoc(collection(firestore, 'clients'), {
                firstName,
                lastName,
                isCheckedIn: false,
                notes,
            });

            // Redirect back to index page
            router.push('/');
        }
    };

    return (
        <>
            <h1>New client</h1>
            <p>{`${firstName} ${lastName}`}</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addNewClient();
                }}
            >
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }}
                />
                <br />

                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                />
                <br />

                <input
                    type="text"
                    value={notes}
                    onChange={(e) => {
                        setNotes(e.target.value);
                    }}
                />
                <br />

                <button type="submit">Create</button>
            </form>
        </>
    );
}
