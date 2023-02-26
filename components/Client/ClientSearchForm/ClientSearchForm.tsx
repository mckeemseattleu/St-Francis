'use client';
import type { DocFilter } from '@/utils/index';
import Link from 'next/link';
import { useState } from 'react';
import styles from './ClientSearchForm.module.css';

type ClientSearchFormProps = {
    onSubmit: (fields: DocFilter) => void;
};
export default function ClientSearchForm(props: ClientSearchFormProps) {
    const { onSubmit } = props;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [filterByBirthday, setFilterByBirthday] = useState(false);
    const [birthday, setBirthday] = useState(
        new Date().toLocaleDateString('en-CA')
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fields: DocFilter = {};
        if (firstName) fields['firstNameLower'] = firstName.toLowerCase();
        if (lastName) fields['lastNameLower'] = lastName.toLowerCase();
        if (filterByBirthday) fields['birthday'] = birthday;
        onSubmit(fields);
    };

    const display = (
        <>
            <div className={styles.container}>
                <h1>Lookup Client</h1>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formContainer}>
                        <label>
                            First name
                            <input
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>

                        <label>
                            Last name
                            <input
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                }}
                            />
                        </label>

                        <label>
                            Birthday
                            <div className={styles.birthdayControlsContainer}>
                                <input
                                    type="date"
                                    name="birthday"
                                    id="birthday"
                                    value={birthday}
                                    onChange={(e) => {
                                        setBirthday(e.target.value);
                                    }}
                                />
                                <input
                                    type="checkbox"
                                    name="filterByBirthday"
                                    id="filterByBirthday"
                                    value={filterByBirthday ? 'on' : 'off'}
                                    onChange={(e) => {
                                        setFilterByBirthday(e.target.checked);
                                    }}
                                />
                            </div>
                        </label>
                    </div>

                    <div className={styles.formControls}>
                        <button type="submit">Filter</button>

                        <Link href="/add-client">
                            <button>New client</button>
                        </Link>
                    </div>
                </form>
                <br />
                <br />
            </div>
        </>
    );
    return display;
}
