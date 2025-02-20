'use client';

import { Button, Form, FormItem, FormRow } from '@/components/UI';
import { Visit } from '@/models/index';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './VisitInfoForm.module.css';

interface VisitInfoFormProps {
    initialVisitData?: Visit;
    onSubmit?: (visitData: Visit) => void;
    submitLabel?: string;
    onChange?: (visitData: Visit) => void;
    isCheckIn?: boolean;
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
    food: false,
    mensQ: '',
    womensQ: '',
    kidsQ: '',
    householdItem: false,
    householdItemQ: '',
    clothingKids: false,
};

const toInt = (value: string) => parseInt(value) || 0;
const toString = (value: number | undefined | null) => {
    if (value === 0) return '';
    return value?.toString() || '';
};

export default function VisitInfoForm({
    onSubmit,
    initialVisitData,
    submitLabel,
    onChange,
    isCheckIn,
}: VisitInfoFormProps) {
    // Append boyAge and girlAge to notes
    let initialNotes = initialVisitData?.notes || '';
    initialVisitData?.boyAge &&
        (initialNotes += `\nBoy Age: ${initialVisitData?.boyAge} `);
    initialVisitData?.girlAge &&
        (initialNotes += `\nGirl Age: ${initialVisitData?.girlAge} `);

    const [visitData, setVisitData] = useState({
        ...defaultVisitData,
        ...initialVisitData,
        busTicket: toString(initialVisitData?.busTicket),
        orcaCard: toString(initialVisitData?.orcaCard),
        giftCard: toString(initialVisitData?.giftCard),
        diaper: toString(initialVisitData?.diaper),
        financialAssistance: toString(initialVisitData?.financialAssistance),
        mensQ: toString(initialVisitData?.mensQ),
        womensQ: toString(initialVisitData?.womensQ),
        kidsQ: toString(initialVisitData?.kidsQ),
        notes: initialNotes,
        householdItem:
            initialVisitData?.householdItem || initialVisitData?.household
                ? true
                : false,
        householdItemQ: toString(initialVisitData?.householdItemQ),

        // carry existed boy & girl clothing state to clothingKids
        clothingKids:
            initialVisitData?.clothingBoy ||
            initialVisitData?.clothingGirl ||
            initialVisitData?.clothingKids
                ? true
                : false,
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent redirect
        onSubmit && onSubmit(transformData(visitData));
    };

    const transformData = (visitData: any) => {
        if (isCheckIn) {
            // During check-in, don't set any numerical values
            return {
                ...visitData,
                orcaCard: visitData.orcaCard ? true : null,
                giftCard: visitData.giftCard ? true : null,
                diaper: visitData.diaper ? true : null,
                // ... other transformations
            };
        }
        
        // During checkout, handle the actual values
        return {
            ...visitData,
            orcaCard: toInt(visitData.orcaCard),
            giftCard: toInt(visitData.giftCard),
            diaper: toInt(visitData.diaper),
            // ... other transformations
        };
    };

    const handleChange = (key: string) => (e: any) => {
        let value: string | number | boolean = '';
        
        if (isCheckIn && ['orcaCard', 'giftCard', 'diaper'].includes(key)) {
            value = e.target.checked;
        } else {
            // Normal handling for other fields and checkout mode
            if (e.target.type === 'checkbox') {
                value = e.target.checked;
            } else if (e.target.type === 'number') {
                value = e.target.value;
            } else {
                value = e.target.value;
            }
        }
        
        const data = transformData({ ...visitData, [key]: value });
        onChange && onChange(data);
        setVisitData({ ...visitData, [key]: value });
    };
    return (
        <Form onSubmit={handleSubmit}>
            <h2>Clothing</h2>

            <FormRow className={styles.formRows}>
                <FormRow className={styles.rowItems}>
                    <FormItem
                        label="Men"
                        type="checkbox"
                        id="clothingMen"
                        checked={!!visitData.clothingMen}
                        onChange={handleChange('clothingMen')}
                    />
                    <FormItem
                        type="number"
                        id="mensQ"
                        placeholder="Count"
                        value={visitData.mensQ}
                        onChange={handleChange('mensQ')}
                        hidden={!visitData.clothingMen}
                    />
                </FormRow>
                <FormRow className={styles.rowItems}>
                    <FormItem
                        type="checkbox"
                        id="clothingWomen"
                        label="Women"
                        checked={!!visitData.clothingWomen}
                        onChange={handleChange('clothingWomen')}
                    />
                    <FormItem
                        type="number"
                        id="womensQ"
                        placeholder="Count"
                        value={visitData.womensQ}
                        onChange={handleChange('womensQ')}
                        hidden={!visitData.clothingWomen}
                    />
                </FormRow>
                <FormRow className={styles.rowItems}>
                    <FormItem
                        type="checkbox"
                        id="clothingKids"
                        label="Kids"
                        checked={!!visitData.clothingKids}
                        onChange={handleChange('clothingKids')}
                    />
                    <FormItem
                        type="number"
                        id="kidsQ"
                        placeholder="Count"
                        value={visitData.kidsQ}
                        onChange={handleChange('kidsQ')}
                        hidden={
                            !visitData.clothingBoy &&
                            !visitData.clothingGirl &&
                            !visitData.clothingKids
                        }
                    />
                </FormRow>
            </FormRow>

            <h2>Special Requests</h2>

            <FormRow>
                <FormItem
                    type="number"
                    id="busTicket"
                    label="Bus Ticket"
                    placeholder="Count"
                    value={visitData.busTicket}
                    onChange={handleChange('busTicket')}
                />
                {isCheckIn ? (
                    // Show checkboxes during check-in
                    <>
                        <FormItem
                            type="checkbox"
                            id="orcaCard"
                            label="Orca Card"
                            checked={!!visitData.orcaCard}
                            onChange={handleChange('orcaCard')}
                        />
                        <FormItem
                            type="checkbox"
                            id="giftCard"
                            label="Gift Card"
                            checked={!!visitData.giftCard}
                            onChange={handleChange('giftCard')}
                        />
                        <FormItem
                            type="checkbox"
                            id="diaper"
                            label="Diaper"
                            checked={!!visitData.diaper}
                            onChange={handleChange('diaper')}
                        />
                    </>
                ) : (
                    // Show number inputs during checkout
                    <>
                        <FormItem
                            type="number"
                            id="orcaCard"
                            placeholder="Value in Dollars"
                            label="Orca Card"
                            value={visitData.orcaCard}
                            onChange={handleChange('orcaCard')}
                        />
                        <FormItem
                            type="number"
                            id="giftCard"
                            label="Gift Card"
                            placeholder="Value in Dollars"
                            value={visitData.giftCard}
                            onChange={handleChange('giftCard')}
                        />
                        <FormItem
                            type="number"
                            id="diaper"
                            label="Diaper"
                            placeholder="Diaper Count"
                            value={visitData.diaper}
                            onChange={handleChange('diaper')}
                        />
                    </>
                )}
                <FormItem
                    type="number"
                    id="financialAssistance"
                    label="Financial Assistance"
                    placeholder="Value in Dollars"
                    value={visitData.financialAssistance}
                    onChange={handleChange('financialAssistance')}
                />
            </FormRow>
            <FormRow>
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
                <FormItem
                    type="checkbox"
                    id="food"
                    label="Food"
                    checked={!!visitData.food}
                    onChange={handleChange('food')}
                />
                <div className={clsx(styles.rowItems, styles.householdRow)}>
                    <FormItem
                        type="checkbox"
                        id="householdItem"
                        label="Household Items"
                        checked={!!visitData.householdItem}
                        onChange={handleChange('householdItem')}
                    />

                    <FormItem
                        type="number"
                        id="householdItemQ"
                        placeholder="Count"
                        value={visitData.householdItemQ}
                        onChange={handleChange('householdItemQ')}
                        hidden={!visitData.householdItem}
                    />
                </div>
            </FormRow>

            <div hidden={!visitData.householdItem}>
                <h2>Household items</h2>
                <FormItem
                    type="textarea"
                    id="household"
                    rows={3}
                    value={visitData.household || ''}
                    onChange={handleChange('household')}
                />
            </div>

            <h2>Notes</h2>

            <FormItem
                type="textarea"
                id="notes"
                rows={3}
                value={visitData.notes || ''}
                onChange={handleChange('notes')}
            />
            <Button type="submit" className={styles.submitBtn}>
                {submitLabel || 'Submit'}
            </Button>
        </Form>
    );
}
