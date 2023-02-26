'use client';
import { Client } from '@/models/index';
import { DocFilter } from '@/utils/index';
import Link from 'next/link';
import { useState } from 'react';
import styles from './ClientInfoForm.module.css';
interface ClientInfoFormProps {
    id?: string;
    initialData?: Client;
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
    initialData = {} as Client,
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
        numKids: initialData.numKids || 0,
        notes: initialData.notes || '',
        isCheckedIn: !!initialData.isCheckedIn,
        isBanned: !!initialData.isBanned,
    };
    const [clientData, setClientData] = useState(defaultData);

    const handleSave = async () => {
        if (onSave) {
            onSave(clientData);
        }
    };

    const handleSaveAndCheck = async () => {
        if (onSaveAndCheck) {
            onSaveAndCheck(clientData);
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
                                    firstNameLower:
                                        e.target.value.toLowerCase(),
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
                                    lastNameLower: e.target.value.toLowerCase(),
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
                                    // prevent NaN value when field is empty
                                    numKids: !!e.target.value
                                        ? parseInt(e.target.value)
                                        : 0,
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
