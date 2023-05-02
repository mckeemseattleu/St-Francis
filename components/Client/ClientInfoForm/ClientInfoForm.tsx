'use client';
import { Button, Form, FormItem, FormRow, FormTitle } from '@/components/UI';
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
        birthday: initialData.birthday || '',
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
    const [submitted, setSubmitted] = useState(false);

    const handleSave = async () => {
        if (!clientData.birthday) return;
        setSubmitted(true);
        const data = {
            ...clientData,
            numKids: parseInt(clientData.numKids) || 0,
        };
        onSave && onSave(data);
    };

    const handleSaveAndCheck = async () => {
        if (!clientData.birthday) return;
        setSubmitted(true);
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
            <Form>
                <FormRow>
                    <FormTitle>
                        {(!clientData.firstName &&
                            !clientData.middleInitial &&
                            !clientData.lastName &&
                            title) ||
                            getFullName()}
                    </FormTitle>
                    <FormItem
                        label="Unhoused"
                        type="checkbox"
                        name="unhoused"
                        id="unhoused"
                        title="Check if client is unhoused"
                        defaultChecked={clientData.unhoused}
                        value={clientData.unhoused ? 'on' : 'off'}
                        onChange={handleChange('unhoused')}
                        className={styles.formTitleItem}
                    />
                    <FormItem
                        label="Ban"
                        type="checkbox"
                        name="isBanned"
                        id="isBanned"
                        title="Check if client is banned"
                        defaultChecked={clientData.isBanned}
                        value={clientData.isBanned ? 'on' : 'off'}
                        onChange={handleChange('isBanned')}
                        className={styles.formTitleItem}
                    />
                </FormRow>
                <hr />
                <FormRow>
                    <FormItem
                        label="First name"
                        value={clientData.firstName}
                        id="firstName"
                        onChange={handleChange('firstName')}
                    />

                    <FormItem
                        label="Middle initial"
                        id="middleInitial"
                        value={clientData.middleInitial}
                        onChange={handleChange('middleInitial')}
                    />

                    <FormItem
                        label="Last name"
                        id="lastName"
                        value={clientData.lastName}
                        onChange={handleChange('lastName')}
                    />

                    <FormItem
                        label="Birthday"
                        type="date"
                        id="birthday"
                        name="birthday"
                        title="Enter client's birthday MM/DD/YYYY. 
                                    Select today's date if unknown"
                        value={clientData.birthday}
                        onChange={handleChange('birthday')}
                        max={new Date().toISOString().split('T')[0]}
                        required
                        className={`${styles.birthday} ${
                            submitted && styles.submitted
                        }`}
                    />

                    <FormItem
                        label="Gender"
                        id="gender"
                        value={clientData.gender}
                        onChange={handleChange('gender')}
                    />

                    <FormItem
                        label="Race"
                        id="race"
                        value={clientData.race}
                        onChange={handleChange('race')}
                    />

                    <FormItem
                        label="Postal code"
                        id="postalCode"
                        value={clientData.postalCode}
                        onChange={handleChange('postalCode')}
                    />

                    <FormItem
                        label="Number of Kids"
                        type="number"
                        id="numKids"
                        value={clientData.numKids}
                        onChange={handleChange('numKids')}
                    />
                </FormRow>

                <FormRow>
                    <FormItem
                        label="Notes"
                        id="notes"
                        type="textarea"
                        rows={5}
                        value={clientData.notes}
                        onChange={handleChange('notes')}
                    />
                </FormRow>
                <div className={styles.saveButtons}>
                    {clientData.id && (
                        <>
                            <Link href={`/profile/${clientData.id}`}>
                                <Button className={styles.backButton}>
                                    Back to Profile
                                </Button>
                            </Link>

                            <span />
                        </>
                    )}

                    <Button className={styles.saveButton} onClick={handleSave}>
                        Save
                    </Button>

                    <Button
                        className={styles.saveButton}
                        onClick={handleSaveAndCheck}
                    >
                        Save and check {clientData.isCheckedIn ? 'out' : 'in'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
