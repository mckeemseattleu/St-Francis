'use client';

import { Button, Form, FormItem, FormRow } from '@/components/UI';
import { Visit } from '@/models/index';
import { useState } from 'react';
import styles from './VisitInfoForm.module.css';

interface VisitInfoFormProps {
    initialVisitData?: Visit;
    onSubmit?: (visitData: Visit) => void;
    submitLabel?: string;
    onChange?: (visitData: Visit) => void;
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
};

const toInt = (value: string) => parseInt(value) || 0;
const toString = (value: number | undefined | null) => value?.toString() || '';

export default function VisitInfoForm({
    onSubmit,
    initialVisitData,
    submitLabel,
    onChange,
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
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent redirect
        onSubmit && onSubmit(transformData(visitData));
    };

    const transformData = (visitData: any) => {
        return {
            ...visitData,
            busTicket: toInt(visitData.busTicket),
            orcaCard: toInt(visitData.orcaCard),
            giftCard: toInt(visitData.giftCard),
            diaper: toInt(visitData.diaper),
            financialAssistance: toInt(visitData.financialAssistance),
            // default to 0 if unchecked before submit
            mensQ: visitData.clothingMen ? toInt(visitData.mensQ) : 0,
            womensQ: visitData.clothingWomen ? toInt(visitData.womensQ) : 0,
            kidsQ:
                visitData.clothingBoy || visitData.clothingGirl
                    ? toInt(visitData.kidsQ)
                    : 0,
            // transfer boyAge and girlAge to notes with submit
            boyAge: '',
            girlAge: '',
        };
    };

    const handleChange = (key: string) => (e: any) => {
        let value = '';
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else value = e.target.value;

        if (key === 'householdItem') {
            const booleanValue = Boolean(value);

            setVisitData((visitData) => ({
                ...visitData,
                // reset household items notes if householdItem is unchecked
                household: !booleanValue ? '' : visitData.household,
                householdItem: booleanValue,
            }));
        } else {
            setVisitData((visitData) => ({
                ...visitData,
                [key]: value,
            }));
        }

        if (onChange) {
            const updatedData = {
                ...visitData,
                [key]: value,
                ...(key === 'householdItem' && !value && { household: '' }),
            };
            onChange(transformData(updatedData));
        }
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
                        value={visitData.womensQ}
                        onChange={handleChange('womensQ')}
                        hidden={!visitData.clothingWomen}
                    />
                </FormRow>
                <FormRow className={styles.rowItems}>
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
                    <FormItem
                        type="number"
                        id="kidsQ"
                        value={visitData.kidsQ}
                        onChange={handleChange('kidsQ')}
                        hidden={
                            !visitData.clothingBoy && !visitData.clothingGirl
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
                    value={visitData.busTicket}
                    onChange={handleChange('busTicket')}
                />
                <FormItem
                    type="number"
                    id="orcaCard"
                    label="Orca Card"
                    value={visitData.orcaCard}
                    onChange={handleChange('orcaCard')}
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
                <FormItem
                    type="checkbox"
                    id="householdItem"
                    label="Household Items"
                    checked={!!visitData.householdItem}
                    onChange={handleChange('householdItem')}
                />
            </FormRow>

            <div hidden={!visitData.householdItem}>
                <h2>Household items</h2>
                <FormItem
                    type="textarea"
                    id="household"
                    rows={3}
                    value={visitData.household || ''}
                    onChange={handleChange('household')}
                    // hidden={!visitData.householdItem}
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
