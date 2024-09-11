'use client';
import { Button, Form, FormItem, FormRow, FormTitle } from '@/components/UI';
import { Client } from '@/models/index';
import { DocFilter } from '@/utils/index';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './ClientInfoForm.module.css';

interface ClientInfoFormProps {
    id?: string;
    initialData?: Omit<Client, 'birthday'> & { birthday?: string };
    redirect?: string;
    title?: string;
    showBackButton?: boolean;
    actions?: { [actionType: string]: (clientData: DocFilter) => void };
}

export const raceList = [
    'Black or African American',
    'White',
    'Hispanic or Latino',
    'Asian',
    'American Indian or Alaska Native',
    'Native Hawaiian or Other Pacific Islander',
    'Other',
];
export const genderList = ['Male', 'Female', 'Other'];

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
    actions,
}: ClientInfoFormProps) {
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
        sheltered: !!initialData.sheltered,
        BPCResident: !!initialData.BPCResident,
    };

    const [clientData, setClientData] = useState(defaultData);
    const [required, setRequired] = useState(false);
    const [actionType, setActionType] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isFormValid, setIsFormValid] = useState(true);
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid) {
            // TODO: Add error message to user
            console.log("Form has errors. Please correct them before submitting.");
            return;
        }

        const data = {
            ...clientData,
            numKids: parseInt(clientData.numKids) || 0,
        };
        actions?.[actionType]?.(data);
    };

    const handleChange = (key: any) => (e: any) => {
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        
        if (key === 'postalCode') {
            value = value.replace(/\D/g, '').slice(0, 5);
        }

        // Update the state immediately
        if (key === 'firstName') {
            setClientData(prev => ({
                ...prev,
                firstName: value,
                firstNameLower: value.toLowerCase()
            }));
        } else if (key === 'lastName') {
            setClientData(prev => ({
                ...prev,
                lastName: value,
                lastNameLower: value.toLowerCase()
            }));
        } else {
            setClientData(prev => ({ ...prev, [key]: value }));
        }
    
        // Validate the field
        const error = validateField(key, value.toString());
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const validateField = (key: string, value: string): string => {
        switch (key) {
            case 'firstName':
            case 'lastName':
            case 'middleInitial':
                return /^[a-zA-Z\-]*$/.test(value) 
                    ? '' 
                    : 'Names can only contain letters and hyphens';
            case 'postalCode':
                if (value === '') return ''; // Allow empty input
                return /^\d{5}$/.test(value)
                    ? ''
                    : 'Postal code must be exactly 5 digits';
            // placeholder for other validations
            default:
                return '';
        }
    };
    
    const getFullName = () =>
        `${clientData.firstName} ${clientData.middleInitial} ${clientData.lastName}`;

    useEffect(() => {
        const hasErrors = Object.values(errors).some(error => error !== '');
        const requiredFieldsMissing = required && (
            !clientData.firstName || 
            !clientData.lastName || 
            !clientData.birthday || 
            !clientData.gender
        );
        const isValid = !hasErrors && !requiredFieldsMissing;
        setIsFormValid(isValid);

        // Set error message
        if (!isValid) {
            if (hasErrors) {
                setFormErrorMessage('Please correct the errors in the form.');
            } else if (requiredFieldsMissing) {
                setFormErrorMessage('Please fill in all required fields.');
            }
        } else {
            setFormErrorMessage('');
        }
    }, [errors, clientData, required]);

    return (
        <div className={styles.container}>
            <Form onSubmit={handleSubmit}>
                <FormRow>
                    <FormTitle>
                        {(!clientData.firstName &&
                            !clientData.middleInitial &&
                            !clientData.lastName &&
                            title) ||
                            getFullName()}
                    </FormTitle>
                    <FormItem
                        label="BPC Resident"
                        type="checkbox"
                        name="BPCResident"
                        id="BPCResident"
                        title="Check if client is a BPC resident"
                        checked={clientData.BPCResident}
                        onChange={handleChange('BPCResident')}
                        className={styles.formTitleItem}
                    />
                    <FormItem
                        label="Shelter"
                        type="checkbox"
                        name="sheltered"
                        id="sheltered"
                        title="Check if client has shelter"
                        checked={clientData.sheltered}
                        onChange={handleChange('sheltered')}
                        className={styles.formTitleItem}
                    />
                    <FormItem
                        label="Unhoused"
                        type="checkbox"
                        name="unhoused"
                        id="unhoused"
                        title="Check if client is unhoused"
                        checked={clientData.unhoused}
                        onChange={handleChange('unhoused')}
                        className={styles.formTitleItem}
                    />
                    <FormItem
                        label="Ban"
                        type="checkbox"
                        name="isBanned"
                        id="isBanned"
                        title="Check if client is banned"
                        checked={clientData.isBanned}
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
                        required={required}
                        error={errors.firstName}
                    />

                    <FormItem
                        label="Middle initial"
                        id="middleInitial"
                        value={clientData.middleInitial}
                        onChange={handleChange('middleInitial')}
                        error={errors.middleInitial}
                    />

                    <FormItem
                        label="Last name"
                        id="lastName"
                        value={clientData.lastName}
                        onChange={handleChange('lastName')}
                        error={errors.lastName}
                    />

                    <FormItem
                        label="Birthday"
                        type="date"
                        id="birthday"
                        name="birthday"
                        title="Client's birthday, use today's date if unknown"
                        value={clientData.birthday}
                        onChange={handleChange('birthday')}
                        max={new Date().toISOString().split('T')[0]}
                        required={required}
                    />

                    <FormItem
                        label="Gender"
                        id="gender"
                        list="genderList"
                        value={clientData.gender}
                        onChange={handleChange('gender')}
                        required={required}
                    />
                    <datalist id="genderList">
                        {genderList.map((gender) => (
                            <option value={gender} key={gender} />
                        ))}
                    </datalist>

                    <FormItem
                        label="Race"
                        id="race"
                        list="raceList"
                        value={clientData.race}
                        onChange={handleChange('race')}
                    />
                    <datalist id="raceList">
                        {raceList.map((race) => (
                            <option value={race} key={race} />
                        ))}
                    </datalist>

                    <FormItem
                        label="Postal code"
                        id="postalCode"
                        value={clientData.postalCode}
                        onChange={handleChange('postalCode')}
                        error={errors.postalCode}
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
                    <div className={styles.saveButtonGroup}>
                        {actions &&
                            Object.keys(actions).map((label) => (
                                <Button
                                    key={label}
                                    className={styles.saveButton}
                                    onClick={() => {
                                        setActionType(label);
                                        setRequired(true);
                                    }}
                                    type="submit"
                                    disabled={!isFormValid}
                                >
                                    {label}
                                </Button>
                            ))}
                        {!isFormValid && (
                            <span className={styles.formErrorMessage}>
                                {formErrorMessage}
                            </span>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}
