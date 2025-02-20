'use client';

import { useState } from 'react';
import { Button } from '@/components/UI';
import type { DocFilter } from '@/utils/index';
import Image from 'next/image';
import Spinner from '@/components/Spinner/Spinner';
import styles from './ClientSearchForm.module.css';
import { Timestamp } from 'firebase/firestore';

type ClientSearchFormProps = {
    onSubmit: (fields: DocFilter) => void;
    isLoading: boolean;
    onClear?: () => void;
};

export default function ClientSearchForm(props: ClientSearchFormProps) {
    const { onSubmit, onClear, isLoading } = props;

    const defaultData = {
        firstName: '',
        lastName: '',
        birthday: '',
        filterByBirthday: false,
    };

    const [clientData, setClientData] = useState({
        birthday: defaultData.birthday,
        filterByBirthday: defaultData.filterByBirthday,
        firstName: '',
        lastName: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fields: DocFilter = {};
        const { firstName, lastName, birthday } = clientData;
        
        if (firstName) fields['firstNameLower'] = firstName.toLowerCase();
        if (lastName) fields['lastNameLower'] = lastName.toLowerCase();
        
        if (birthday) {
            const [year, month, day] = birthday.split('-').map(Number);
            const dateObj = new Date(Date.UTC(year, month - 1, day));
            const timestamp = Timestamp.fromDate(dateObj);
            
            fields['birthday'] = {
                opStr: '==',
                value: timestamp
            };
        }
        
        onSubmit(fields);
    };

    const handleClear = () => {
        setClientData(defaultData);
        if (onClear) onClear();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (e.target.name === 'birthday') {
            setClientData({
                ...clientData,
                birthday: value,
                filterByBirthday: value !== '',
            });
        } else {
            setClientData({ ...clientData, [e.target.name]: value });
        }
    };

    const renderSubmitButton = () => {
        if (isLoading) {
            return (
                <Button disabled>
                    <Spinner variant="small" />
                </Button>
            );
        } else {
            return (
                <Button type="submit">
                    Search
                    <Image
                        src="/search.svg"
                        alt="client-search-icon"
                        width="20"
                        height="20"
                    />
                </Button>
            );
        }
    };

    return (
        <div className={styles.container}>
            <h1>Lookup Client</h1>

            <form onSubmit={handleSubmit}>
                <div className={styles.formContainer}>
                    <label>
                        First name
                        <input
                            type="text"
                            name="firstName"
                            value={clientData.firstName}
                            onChange={handleChange}
                            autoFocus
                        />
                    </label>

                    <label>
                        Last name
                        <input
                            type="text"
                            name="lastName"
                            value={clientData.lastName}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Birthday
                        <div className={styles.birthdayControlsContainer}>
                            <input
                                type="date"
                                name="birthday"
                                id="birthday"
                                value={clientData.birthday}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </label>
                </div>

                <div className={styles.formControls}>
                    {renderSubmitButton()}
                    <Button type="button" onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </form>
        </div>
    );
}
