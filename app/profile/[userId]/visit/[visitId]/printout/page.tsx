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
            console.log("Starting formatData with visitData:", visitData);
            if (!visitData) return;

            const specialRequestItemKeys = [
                'backpack',
                'sleepingBag',
                'food',
                'busTicket',
                'orcaCard',
                'giftCard',
                'financialAssistance',
                'diaper',
                'householdItem',
            ];

            const itemLabels = {
                clothingMen: 'Mens',
                clothingWomen: 'Womens',
                clothingBoy: 'Kids (Boy)',
                clothingGirl: 'Kids (Girl)',
                clothingKids: 'Kids',
                backpack: 'Backpack',
                sleepingBag: 'Sleeping Bag',
                food: 'Food',
                busTicket: 'Bus Ticket',
                orcaCard: 'Orca Card',
                giftCard: 'Gift Card',
                diaper: 'Diapers',
                financialAssistance: 'Financial Assistance',
                householdItem: 'Household Items',
            };

            let specialRequestItems: Array<string> = [];
            
            // Debug each special request check
            specialRequestItemKeys.forEach(key => {
                const value = visitData[key as keyof typeof visitData];
                console.log(`Checking ${key}:`, value);
                if (value && value !== 0) {
                    specialRequestItems.push(itemLabels[key as keyof typeof itemLabels]);
                    console.log(`Added ${key} to special requests`);
                }
            });

            console.log("Final specialRequestItems:", specialRequestItems);

            let ans: Array<FormItem> = [];
            
            if (specialRequestItems.length > 0) {
                ans.push({
                    title: 'Special Requests',
                    type: 'checkbox',
                    items: specialRequestItems,
                });
            }

            console.log("Final formData:", ans);
            setFormData(ans);
        }
        formatData();
    }, [visitData, clientData]);
    if (isClientloading || isVisitLoading || !formData) return <Spinner />;

    // Add this log right before the return statement
    console.log("DEBUG - Data being passed to PrintoutForm:", {
        clientData,
        visitData,
        formData
    });

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
