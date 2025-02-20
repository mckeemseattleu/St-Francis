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

    useEffect(() => {
        function formatData() {
            if (!visitData) return;

            let ans: Array<FormItem> = [];
            
            // 1. Add Clothing Section
            const clothingItems: Array<string> = [];
            if (visitData.clothingMen) clothingItems.push('Men');
            if (visitData.clothingWomen) clothingItems.push('Women');
            if (visitData.clothingBoy || visitData.clothingGirl || visitData.clothingKids) {
                clothingItems.push('Kids');
            }
            
            if (clothingItems.length > 0) {
                ans.push({
                    title: 'Clothing',
                    type: 'checkbox',
                    items: clothingItems,
                });
            }

            // 2. Add Special Requests Section
            const specialRequestItemKeys = [
                'backpack',
                'sleepingBag',
                'food',
                'busTicket',
                'orcaCard',
                'giftCard',
                'financialAssistance',
                'diaper',
            ];

            const itemLabels = {
                backpack: 'Backpack',
                sleepingBag: 'Sleeping Bag',
                food: 'Food',
                busTicket: 'Bus Ticket',
                orcaCard: 'Orca Card',
                giftCard: 'Gift Card',
                diaper: 'Diapers',
                financialAssistance: 'Financial Assistance',
            };

            let specialRequestItems: Array<string> = [];
            
            specialRequestItemKeys.forEach(key => {
                const value = visitData[key as keyof typeof visitData];
                if (value && value !== 0) {
                    specialRequestItems.push(itemLabels[key as keyof typeof itemLabels]);
                }
            });

            if (specialRequestItems.length > 0) {
                ans.push({
                    title: 'Special Requests',
                    type: 'checkbox',
                    items: specialRequestItems,
                });
            }

            // 3. Add Household Items Section (if selected)
            if (visitData.householdItem) {
                ans.push({
                    title: 'Household Items',
                    type: 'text',
                    items: [''],
                });
            }

            // 4. Add Notes Section (if visitData has notes)
            if (visitData.notes) {
                ans.push({
                    title: 'Notes',
                    type: 'text',
                    items: [visitData.notes],
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
