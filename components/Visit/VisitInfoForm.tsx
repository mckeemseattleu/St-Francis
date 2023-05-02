'use client';

import { useSettings } from '@/hooks/index';
import { Client, Visit } from '@/models/index';
import { useEffect, useState } from 'react';
import { FormRow, FormItem, Form, Button } from '@/components/UI';
import styles from './VisitInfoForm.module.css';

interface VisitInfoFormProps {
    clientData?: Client;
    initialVisitData?: Visit;
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
};

export default function VisitInfoForm({
    clientData,
    onSubmit,
    initialVisitData,
}: VisitInfoFormProps) {
    const [visitData, setVisitData] = useState({
        ...defaultVisitData,
        ...initialVisitData,
        busTicket: initialVisitData?.busTicket?.toString() || '',
        giftCard: initialVisitData?.giftCard?.toString() || '',
        diaper: initialVisitData?.diaper?.toString() || '',
        financialAssistance:
            initialVisitData?.financialAssistance?.toString() || '',
    });
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
        if (settings?.earlyOverride) return true;
        const daysEarlyThreshold = settings?.daysEarlyThreshold || 0;
        const backpackThreshold = settings?.backpackThreshold || 0;
        const sleepingBagThreshold = settings?.sleepingBagThreshold || 0;

        // TODO: Validate >= vs >
        return (
            validationData.daysVisit > daysEarlyThreshold &&
            (visitData.backpack
                ? validationData.daysBackpack > backpackThreshold
                : true) &&
            (visitData.sleepingBag
                ? validationData.daysSleepingBag > sleepingBagThreshold
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

            const transformedVisitData = {
                ...visitData,
                busTicket: parseInt(visitData.busTicket) || 0,
                giftCard: parseInt(visitData.giftCard) || 0,
                diaper: parseInt(visitData.diaper) || 0,
                financialAssistance:
                    parseInt(visitData.financialAssistance) || 0,
            };
            onSubmit && onSubmit(transformedVisitData);
        };

    // TODO: Give more details
    const validationErrorMessage = validates ? null : (
        <div className={styles.errorMessageContainer}>
            <p>Trying to check in too early</p>
            <button onClick={handleSubmit(true)}>Force Check-in</button>
        </div>
    );

    const handleChange = (key: string) => (e: any) => {
        let value = '';
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else value = e.target.value;
        setVisitData({ ...visitData, [key]: value });
    };

    return (
        <Form onSubmit={handleSubmit()}>
            <h2>Clothing</h2>

            <FormRow>
                <FormItem
                    label="Men"
                    type="checkbox"
                    id="clothingMen"
                    checked={!!visitData.clothingMen}
                    onChange={handleChange('clothingMen')}
                />
                <FormItem
                    type="checkbox"
                    id="clothingWomen"
                    label="Women"
                    checked={!!visitData.clothingWomen}
                    onChange={handleChange('clothingWomen')}
                />
                <FormItem
                    type="checkbox"
                    id="clothingBoy"
                    label="Kids (Boy)"
                    checked={!!visitData.clothingBoy}
                    onChange={handleChange('clothingBoy')}
                />
                <FormItem
                    type="checkbox"
                    id="clothingGirl"
                    label="Kids (Girl)"
                    checked={!!visitData.clothingGirl}
                    onChange={handleChange('clothingGirl')}
                />
            </FormRow>

            <h2>Special Requests</h2>

            <FormRow>
                <FormItem
                    type="number"
                    id="busTicket"
                    label="Bus Ticket"
                    value={visitData.busTicket}
                    onChange={handleChange('busTicket')}
                />
                <FormItem
                    type="number"
                    id="giftCard"
                    label="Gift Card"
                    value={visitData.giftCard}
                    onChange={handleChange('giftCard')}
                />
                <FormItem
                    type="number"
                    id="diaper"
                    label="Diaper"
                    value={visitData.diaper}
                    onChange={handleChange('diaper')}
                />
                <FormItem
                    type="number"
                    id="financialAssistance"
                    label="Financial Assistance"
                    value={visitData.financialAssistance}
                    onChange={handleChange('financialAssistance')}
                />
                <FormItem
                    type="checkbox"
                    id="backpack"
                    label="Backpack"
                    checked={!!visitData.backpack}
                    onChange={handleChange('backpack')}
                />
                <FormItem
                    type="checkbox"
                    id="sleepingBag"
                    label="Sleeping Bag"
                    checked={!!visitData.sleepingBag}
                    onChange={handleChange('sleepingBag')}
                />
            </FormRow>

            <h2>Household items</h2>

            <FormItem
                type="textarea"
                id="household"
                rows={3}
                value={visitData.household || ''}
                onChange={handleChange('household')}
            />

            <h2>Notes</h2>

            <FormItem
                type="textarea"
                id="notes"
                rows={3}
                value={visitData.notes || ''}
                onChange={handleChange('notes')}
            />
            <Button type="submit">
                {initialVisitData ? 'Save Visit' : 'New Visit'}
            </Button>
            {validationErrorMessage}
        </Form>
    );
}
