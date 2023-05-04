'use client';

import PrintoutForm, { FormItem } from '@/components/PrintoutForm/PrintoutForm';
import Spinner from '@/components/Spinner/Spinner';
import { CLIENTS_PATH, getClient, getVisit, VISITS_PATH } from '@/utils/index';
import ErrorPage from 'next/error';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

interface PrintoutProps {
    params: { visitId: string; userId: string };
}

export default function Printout({ params }: PrintoutProps) {
    const [formData, setFormData] = useState<Array<FormItem>>();

    const { isLoading: isClientloading, data: clientData } = useQuery({
        queryKey: [CLIENTS_PATH, params.userId],
        queryFn: () => getClient(params.userId),
    });

    const { isLoading: isVisitLoading, data: visitData } = useQuery({
        queryKey: [CLIENTS_PATH, params.userId, VISITS_PATH, params.visitId],
        queryFn: () => getVisit(params.userId, params.visitId),
    });

    // TODO: Convert to waiting for both to finish using Promises to prevent doing this twice
    useEffect(() => {
        // Formats the data into a form <PrintoutForm /> expects
        function formatData() {
            if (!visitData) return;
            // Keys we consider "Special Requests"
            const specialRequestItemKeys = [
                'backpack',
                'sleepingBag',
                'busTicket',
                'giftCard',
                'financialAssistance',
                'diaper',
            ];
            // What we want the form to label each checkbox
            const itemLabels = {
                clothingMen: 'Mens',
                clothingWomen: 'Womens',
                clothingBoy: 'Kids (Boy)',
                clothingGirl: 'Kids (Girl)',
                backpack: 'Backpack',
                sleepingBag: 'Sleeping Bag',
                busTicket: 'Bus Ticket',
                giftCard: 'Gift Card',
                diaper: 'Diapers',
                financialAssistance: 'Financial Assistance',
            };
            let ans: typeof formData = [];
            // Get clothing items to show
            let clothingItems: Array<string> = [];
            Object.keys(visitData).forEach((key) => {
                if (
                    key.startsWith('clothing') &&
                    visitData[key as keyof typeof visitData]
                ) {
                    clothingItems.push(
                        itemLabels[key as keyof typeof itemLabels]
                    );
                }
            });
            // Get special request items to show
            let specialRequestItems: Array<string> = [];
            Object.keys(visitData).forEach((key) => {
                if (
                    specialRequestItemKeys.includes(key) &&
                    visitData[key as keyof typeof visitData] != 0
                ) {
                    specialRequestItems.push(
                        itemLabels[key as keyof typeof itemLabels]
                    );
                }
            });
            // Add clothing items
            if (clothingItems.length != 0) {
                ans.push({
                    title: 'Clothing',
                    type: 'checkbox',
                    items: clothingItems,
                });
            }
            // Add special request items
            if (specialRequestItems.length != 0) {
                ans.push({
                    title: 'Special Requests',
                    type: 'checkbox',
                    items: specialRequestItems,
                });
            }
            // Add household items if present
            if (visitData?.household?.length) {
                ans.push({
                    title: 'Household',
                    type: 'text',
                    items: [visitData?.household],
                });
            }
            // Add notes if present
            if (visitData?.notes?.length) {
                ans.push({
                    title: 'Notes',
                    type: 'text',
                    items: [visitData.notes],
                });
            }

            setFormData(ans);
        }
        formatData();
    }, [visitData, clientData]);
    if (isClientloading || isVisitLoading) return <Spinner />;
    return clientData && visitData && formData ? (
        <PrintoutForm
            clientData={clientData}
            visitData={visitData}
            data={formData}
        />
    ) : (
        <ErrorPage
            statusCode={404}
            title="Data Not Found"
            withDarkMode={false}
        />
    );
}
