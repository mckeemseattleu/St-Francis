'use client';

import { useSettings } from '@/hooks/index';
import { Client, Visit } from '@/models/index';
import { useEffect, useState } from 'react';
import styles from './VisitInfoForm.module.css';

interface VisitInfoFormProps {
    clientData?: Client;
    onSubmit?: (visitData: Visit) => void;
}

interface ValidationData {
    daysVisit: number;
    daysBackpack: number;
    daysSleepingBag: number;
}

const defaultVisitData = {
    id: '',
    clothingMen: false,
    clothingWomen: false,
    clothingBoy: false,
    clothingGirl: false,
    household: '',
    notes: '',
    backpack: false,
    sleepingBag: false,
    busTicket: '',
    giftCard: '',
    diaper: '',
    financialAssistance: '',
};

export default function VisitInfoForm({
    clientData,
    onSubmit,
}: VisitInfoFormProps) {
    const [visitData, setVisitData] = useState(defaultVisitData);
    const [validationData, setValidationData] = useState<ValidationData>({
        // Set to max to always pass validation if no data available
        daysVisit: Number.MAX_SAFE_INTEGER,
        daysBackpack: Number.MAX_SAFE_INTEGER,
        daysSleepingBag: Number.MAX_SAFE_INTEGER,
    });
    const [validates, setValidates] = useState<boolean>(true);
    const { settings } = useSettings();

    useEffect(() => {
        // Calculate validation data (days between last and threshold)
        // TODO: Validate for edge cases with daylight savings and different timezones
        const daysBetween = (start: Date | undefined, end: Date) => {
            if (start == undefined) return Number.MAX_SAFE_INTEGER;

            const msPerDay = 24 * 60 * 60 * 1000;

            return Math.round(
                Math.abs((start.getTime() - end.getTime()) / msPerDay)
            );
        };

        setValidationData((prevData) => ({
            ...prevData,
            daysVisit: daysBetween(clientData?.lastVisit?.toDate(), new Date()),
            daysBackpack: daysBetween(
                clientData?.lastBackpack?.toDate(),
                new Date()
            ),
            daysSleepingBag: daysBetween(
                clientData?.lastSleepingbag?.toDate(),
                new Date()
            ),
        }));
    }, [clientData]);

    // Validates the new check in passes thresholds as specified in settings
    // page
    const validatesSuccessfully = () => {
        if (settings.earlyOverride) return true;

        // TODO: Validate >= vs >
        return (
            validationData.daysVisit > settings.daysEarlyThreshold &&
            (visitData.backpack
                ? validationData.daysBackpack > settings.backpackThreshold
                : true) &&
            (visitData.sleepingBag
                ? validationData.daysSleepingBag > settings.sleepingBagThreshold
                : true)
        );
    };

    const handleSubmit =
        (tempOverride = false) =>
        (e: any) => {
            e.preventDefault(); // Prevent redirect

            if (!tempOverride && !validatesSuccessfully()) {
                setValidates(false);
                return;
            }

            try {
                const transformedVisitData = {
                    ...visitData,
                    busTicket: parseInt(visitData.busTicket) || 0,
                    giftCard: parseInt(visitData.giftCard) || 0,
                    diaper: parseInt(visitData.diaper) || 0,
                    financialAssistance:
                        parseInt(visitData.financialAssistance) || 0,
                };
                onSubmit && onSubmit(transformedVisitData);
            } catch (err) {
                console.error('error parsing visit data to int');
            }
        };

    // TODO: Give more details
    const validationErrorMessage = validates ? null : (
        <div className={styles.errorMessageContainer}>
            <p>Trying to check in too early</p>
            <button onClick={handleSubmit(true)}>Force Check-in</button>
        </div>
    );

    const handleChange =
        (key: any, type: string = 'value') =>
        (e: any) => {
            setVisitData({ ...visitData, [key]: e.target[type] });
        };

    if (!clientData) return null;

    return (
        <form onSubmit={handleSubmit()} className={styles.form}>
            <h2>Clothing</h2>

            <div className={styles.formRows}>
                <FormField
                    type="checkbox"
                    id="clothingMen"
                    label="Men"
                    value={visitData.clothingMen ? 'on' : 'off'}
                    onChange={handleChange('clothingMen', 'checked')}
                />
                <FormField
                    type="checkbox"
                    id="clothingWomen"
                    label="Women"
                    value={visitData.clothingWomen ? 'on' : 'off'}
                    onChange={handleChange('clothingWomen', 'checked')}
                />
                <FormField
                    type="checkbox"
                    id="clothingBoy"
                    label="Kids (Boy)"
                    value={visitData.clothingBoy ? 'on' : 'off'}
                    onChange={handleChange('clothingBoy', 'checked')}
                />
                <FormField
                    type="checkbox"
                    id="clothingGirl"
                    label="Kids (Girl)"
                    value={visitData.clothingGirl ? 'on' : 'off'}
                    onChange={handleChange('clothingGirl', 'checked')}
                />
            </div>

            <h2>Special Requests</h2>

            <div className={styles.formRows}>
                <FormField
                    type="checkbox"
                    id="backpack"
                    label="Backpack"
                    value={visitData.backpack ? 'on' : 'off'}
                    onChange={handleChange('backpack', 'checked')}
                />
                <FormField
                    type="checkbox"
                    id="sleepingBag"
                    label="Sleeping Bag"
                    value={visitData.sleepingBag ? 'on' : 'off'}
                    onChange={handleChange('sleepingBag', 'checked')}
                />
                <FormField
                    type="number"
                    id="busTicket"
                    label="Bus Ticket"
                    value={visitData.busTicket}
                    onChange={handleChange('busTicket')}
                />
                <FormField
                    type="number"
                    id="giftCard"
                    label="Gift Card"
                    value={visitData.giftCard}
                    onChange={handleChange('giftCard')}
                />
                <FormField
                    type="number"
                    id="diaper"
                    label="Diaper"
                    value={visitData.diaper}
                    onChange={handleChange('diaper')}
                />
                <FormField
                    type="number"
                    id="financialAssistance"
                    label="Financial Assistance"
                    value={visitData.financialAssistance}
                    onChange={handleChange('financialAssistance')}
                />
            </div>

            <FormField
                type="text"
                id="household"
                label="Household items"
                value={visitData.household || ''}
                onChange={handleChange('household')}
                isHeader
            />
            <FormField
                type="text"
                label="Notes"
                id="notes"
                value={visitData.notes || ''}
                onChange={handleChange('notes')}
                isHeader
            />
            <button type="submit">Check in</button>
            {validationErrorMessage}
        </form>
    );
}

const FormField = (props: any) => {
    const { label, type, value, onChange, id, isHeader = false } = props;
    const field = (
        <>
            <label htmlFor={id}>{isHeader ? <h2>{label}</h2> : label}</label>
            <input
                type={type}
                name={id}
                id={id}
                value={value}
                onChange={onChange}
            />
        </>
    );
    return isHeader ? field : <div className={styles.formRowItem}>{field}</div>;
};
