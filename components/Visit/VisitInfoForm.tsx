'use client';

import { Button, Form, FormItem, FormRow } from '@/components/UI';
import { Visit } from '@/models/index';
import { useState } from 'react';

interface VisitInfoFormProps {
    initialVisitData?: Visit;
    onSubmit?: (visitData: Visit) => void;
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

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent redirect

        const transformedVisitData = {
            ...visitData,
            busTicket: parseInt(visitData.busTicket) || 0,
            giftCard: parseInt(visitData.giftCard) || 0,
            diaper: parseInt(visitData.diaper) || 0,
            financialAssistance: parseInt(visitData.financialAssistance) || 0,
        };
        onSubmit && onSubmit(transformedVisitData);
    };

    const handleChange = (key: string) => (e: any) => {
        let value = '';
        if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else value = e.target.value;
        setVisitData({ ...visitData, [key]: value });
    };

    return (
        <Form onSubmit={handleSubmit}>
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
                {initialVisitData ? 'Save Visit' : 'New Visit / Check-in'}
            </Button>
        </Form>
    );
}
