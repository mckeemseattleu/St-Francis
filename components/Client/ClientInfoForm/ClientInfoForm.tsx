'use client';
import { Client } from '@/models/index';
import { DocFilter } from '@/utils/index';
import Link from 'next/link';
import { useState } from 'react';
import styles from './ClientInfoForm.module.css';
interface ClientInfoFormProps {
    id?: string;
    initialData?: Omit<Client, 'birthday'> & { birthday?: string };
    redirect?: string;
    title?: string;
    showBackButton?: boolean;
    onSave?: (clientData: DocFilter) => void;
    onSaveAndCheck?: (clientData: DocFilter) => void;
}

/**
 * A form for creating or editing a client's document in the database.
 *
 * @param initialData Initial values to have in the input fields. If none are
 * given, empty strings will be used for text fields, 0 for number fields, and
 * the current date used for birthday
 * @param title Heading to show atop form
 * @param showBackButton Whether to show a "back to profile" button or not
 */
export default function ClientInfoForm({
    initialData = {} as Omit<Client, 'birthday'> & { birthday?: string },
    title = 'Client Form',
    onSave,
    onSaveAndCheck,
}: ClientInfoFormProps) {
    //TODO: Add Validation

    // Use default values if no initial data was passed in
    const defaultData = {
        id: initialData.id || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        firstNameLower: initialData.firstNameLower || '',
        lastNameLower: initialData.lastNameLower || '',
        middleInitial: initialData.middleInitial || '',
        birthday:
            initialData.birthday || new Date().toLocaleDateString('en-CA'),
        gender: initialData.gender || '',
        race: initialData.race || '',
        postalCode: initialData.postalCode || '',
        numKids: initialData.numKids?.toString() || '',
        notes: initialData.notes || '',
        isCheckedIn: !!initialData.isCheckedIn,
        isBanned: !!initialData.isBanned,
        unhoused: !!initialData.unhoused,
    };

    const [clientData, setClientData] = useState(defaultData);
    const handleSave = async () => {
        const data = {
            ...clientData,
            numKids: parseInt(clientData.numKids) || 0,
        };
        onSave && onSave(data);
    };

    const handleSaveAndCheck = async () => {
        const data = {
            ...clientData,
            numKids: parseInt(clientData.numKids) || 0,
        };
        onSaveAndCheck && onSaveAndCheck(data);
    };

    const handleChange = (key: any) => (e: any) => {
        let value = e.target.value;
        if (key === 'isBanned') value = e.target.checked;
        if (key === 'firstName')
            clientData.firstNameLower = value.toLowerCase();
        if (key === 'lastName') clientData.lastNameLower = value.toLowerCase();
        setClientData({ ...clientData, [key]: value });
    };
    const getFullName = () =>
        `${clientData.firstName} ${clientData.middleInitial} ${clientData.lastName}`;

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1>
                    {(!clientData.firstName &&
                        !clientData.middleInitial &&
                        !clientData.lastName &&
                        title) ||
                        getFullName()}
                </h1>
                <div className={styles.titleItem}>
                    <label htmlFor="unhoused">Unhoused</label>
                    <input
                        type="checkbox"
                        name="unhoused"
                        id="unhoused"
                        title="Check if client is unhoused"
                        defaultChecked={clientData.unhoused}
                        value={clientData.unhoused ? 'on' : 'off'}
                        onChange={handleChange('unhoused')}
                    />
                </div>
                <div className={styles.titleItem}>
                    <label htmlFor="isBanned">Ban</label>
                    <input
                        type="checkbox"
                        name="isBanned"
                        id="isBanned"
                        title="Check if client is banned"
                        defaultChecked={clientData.isBanned}
                        value={clientData.isBanned ? 'on' : 'off'}
                        onChange={handleChange('isBanned')}
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
                            onChange={handleChange('firstName')}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="middleInitial">Middle initial</label>
                        <input
                            type="text"
                            value={clientData.middleInitial}
                            id="middleInitial"
                            onChange={handleChange('middleInitial')}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="lastName">Last name</label>
                        <input
                            type="text"
                            value={clientData.lastName}
                            id="lastName"
                            onChange={handleChange('lastName')}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="birthday">Birthday</label>
                        <input
                            type="date"
                            name="birthday"
                            id="birthday"
                            title="Enter client's birthday MM/DD/YYYY"
                            value={clientData.birthday}
                            onChange={handleChange('birthday')}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="gender">Gender</label>
                        <input
                            type="text"
                            value={clientData.gender}
                            id="gender"
                            onChange={handleChange('gender')}
                        />
                        <br />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="race">Race</label>
                        <input
                            type="text"
                            value={clientData.race}
                            id="race"
                            onChange={handleChange('race')}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="postalCode">Postal code</label>
                        <input
                            type="text"
                            value={clientData.postalCode}
                            id="postalCode"
                            onChange={handleChange('postalCode')}
                        />
                    </div>

                    <div className={styles.formRowItem}>
                        <label htmlFor="numKids">Number of Kids</label>
                        <input
                            type="number"
                            value={clientData.numKids}
                            id="numKids"
                            onChange={handleChange('numKids')}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        value={clientData.notes}
                        id="notes"
                        onChange={handleChange('notes')}
                        rows={5}
                    />
                </div>
            </form>

            <div className={styles.saveButtons}>
                {clientData.id && (
                    <>
                        <Link href={`/profile/${clientData.id}`}>
                            <button className={styles.backButton}>
                                Back to Profile
                            </button>
                        </Link>

                        <span />
                    </>
                )}

                <button className={styles.saveButton} onClick={handleSave}>
                    Save
                </button>

                <button
                    className={styles.saveButton}
                    onClick={handleSaveAndCheck}
                >
                    Save and check {clientData.isCheckedIn ? 'out' : 'in'}
                </button>
            </div>
        </div>
    );
}
